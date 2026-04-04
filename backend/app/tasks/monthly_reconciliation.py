"""
Tarea mensual: reconciliación devoluciones reales vs modelo → wallet.
Ver también `crud/reconciliation.py` para persistencia y `services/reconciliation.py` para núcleo matemático.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

from sqlalchemy.orm import Session

from ..config import settings
from ..crud.reconciliation import (
    commit_completed_reconciliation,
    get_reconciliation_run,
    immutable_audit_hash,
    persist_failed_reconciliation,
)
from ..models import Store
from ..services.calculation_engine import merged_return_rates
from ..services.integrations.shopify_reconciliation import (
    fetch_orders_by_category_shopify,
    fetch_returns_by_category_shopify,
)
from ..services.reconciliation import reconcile_monthly
from ..services.reconciliation_data import (
    aggregate_orders_and_avg_ida_kg,
    get_previous_year_month,
    load_returns_by_category_from_db,
    store_ids_with_logs_in_month,
)

logger = logging.getLogger(__name__)


@dataclass
class ReconcileOneResult:
    store_public_id: str
    month: str
    status: str
    total_adjustment_eur: float
    action: str
    audit_hash: str
    detail: str


def _notification_hint(month: str, total_adj: float) -> str:
    if abs(total_adj) < 1e-6:
        return f"EcoTrace · Reconciliación {month}: sin ajuste (devoluciones alineadas con el modelo)."
    if total_adj > 0:
        return (
            f"EcoTrace · Reconciliación {month}: ajuste −€{total_adj:.2f} en tu wallet climático "
            f"(devoluciones reales superaron la estimación; coste de compensación adicional)."
        )
    return (
        f"EcoTrace · Reconciliación {month}: crédito +€{abs(total_adj):.2f} en tu wallet "
        f"(devoluciones reales por debajo de lo estimado)."
    )


def reconcile_store_month(
    db: Session,
    *,
    store: Store,
    year_month: str,
    merge_shopify: bool = False,
) -> ReconcileOneResult:
    existing = get_reconciliation_run(db, store.id, year_month)
    if existing and existing.status == "completed":
        return ReconcileOneResult(
            store_public_id=store.public_id,
            month=year_month,
            status="skipped_idempotent",
            total_adjustment_eur=0.0,
            action="none",
            audit_hash=existing.audit_hash,
            detail="Already reconciled for this month.",
        )

    orders_local, avg_ida_local = aggregate_orders_and_avg_ida_kg(db, store_id=store.id, year_month=year_month)
    returns_db = load_returns_by_category_from_db(db, store_id=store.id, year_month=year_month)

    orders_shopify: dict[str, int] = {}
    returns_shopify: dict[str, int] = {}
    if merge_shopify:
        orders_shopify = fetch_orders_by_category_shopify(store.public_id, year_month)
        returns_shopify = fetch_returns_by_category_shopify(store.public_id, year_month)

    orders_by_category = dict(orders_local)
    for k, v in orders_shopify.items():
        if v:
            orders_by_category[k.lower().strip()] = int(v)

    returns_by_category = dict(returns_db)
    for k, v in returns_shopify.items():
        if v is not None:
            returns_by_category[k.lower().strip()] = int(v)

    if not orders_by_category:
        msg = "No hay pedidos registrados en logs para este mes."
        logger.info("reconciliation skip store=%s month=%s: %s", store.public_id, year_month, msg)
        return ReconcileOneResult(
            store_public_id=store.public_id,
            month=year_month,
            status="skipped_no_orders",
            total_adjustment_eur=0.0,
            action="noop",
            audit_hash="",
            detail=msg,
        )

    if not returns_by_category:
        logger.warning(
            "reconciliation store=%s month=%s: no return counts in DB; assuming zero returns per category",
            store.public_id,
            year_month,
        )

    result = reconcile_monthly(
        orders_by_category=orders_by_category,
        returns_by_category=returns_by_category,
        avg_co2_ida_kg_by_category=avg_ida_local,
        default_avg_co2_ida_kg=0.35,
    )

    details: list[dict[str, Any]] = [
        {
            "category": r.category,
            "orders": r.orders,
            "returns_observed": r.returns_observed,
            "r_estimada": r.return_rate_assumed,
            "r_real": round(r.return_rate_observed, 4),
            "avg_co2_ida_kg": round(r.avg_co2_ida_kg, 6),
            "delta_emisiones_kg": round(r.delta_co2_kg, 4),
            "ajuste_credito_eur": round(r.delta_credit_eur, 2),
        }
        for r in result.rows
    ]

    rates_snap = merged_return_rates(settings)
    orders_snap = dict(sorted(orders_by_category.items()))
    returns_snap = dict(sorted(returns_by_category.items()))
    hash_payload = {
        "month": year_month,
        "store_public_id": store.public_id,
        "orders": orders_snap,
        "returns": returns_snap,
        "rates": dict(sorted(rates_snap.items())),
        "carbon_price_eur_per_tonne": settings.carbon_price_eur_per_tonne,
        "mult_ret": settings.returns_logistics_multiplier,
        "dilution": settings.returns_dilution_factor,
        "details": details,
        "total_adjustment_eur": round(result.total_adjustment_eur, 6),
    }
    audit = immutable_audit_hash(hash_payload)

    total_adj = float(result.total_adjustment_eur)
    if abs(total_adj) < 1e-9:
        action = "noop"
    elif total_adj > 0:
        action = "wallet_debited"
    else:
        action = "wallet_credited"

    hint = _notification_hint(year_month, total_adj)

    commit_completed_reconciliation(
        db,
        store=store,
        year_month=year_month,
        existing=existing,
        total_adjustment_eur=total_adj,
        action=action,
        details=details,
        orders_snap=orders_snap,
        returns_snap=returns_snap,
        rates_snap=rates_snap,
        audit_hash=audit,
        notification_hint=hint,
    )

    return ReconcileOneResult(
        store_public_id=store.public_id,
        month=year_month,
        status="completed",
        total_adjustment_eur=round(total_adj, 4),
        action=action,
        audit_hash=audit,
        detail=hint,
    )


def run_monthly_reconciliation_for_all_stores(
    db: Session,
    *,
    year_month: str | None = None,
    merge_shopify: bool = False,
) -> list[ReconcileOneResult]:
    ym = year_month or get_previous_year_month()
    store_ids = store_ids_with_logs_in_month(db, ym)
    out: list[ReconcileOneResult] = []
    for sid in store_ids:
        store = db.get(Store, sid)
        if not store:
            continue
        try:
            out.append(reconcile_store_month(db, store=store, year_month=ym, merge_shopify=merge_shopify))
        except Exception as e:
            logger.exception("reconciliation failed store_id=%s month=%s", sid, ym)
            try:
                db.rollback()
                persist_failed_reconciliation(db, store=store, year_month=ym, message=str(e))
            except Exception:
                db.rollback()
            out.append(
                ReconcileOneResult(
                    store_public_id=store.public_id,
                    month=ym,
                    status="failed",
                    total_adjustment_eur=0.0,
                    action="error",
                    audit_hash="",
                    detail=str(e),
                )
            )
    return out
