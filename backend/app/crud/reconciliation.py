"""
CRUD de reconciliación y wallet (EcoTrace).

Convención wallet: `balance_eur -= total_adjustment_eur` (positivo = más devoluciones reales que estimadas).
"""

from __future__ import annotations

import hashlib
import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import ReconciliationRun, Store, StoreWallet, WalletLedgerEntry


def immutable_audit_hash(payload: dict[str, Any]) -> str:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def ensure_store_wallet(db: Session, store_id: int) -> StoreWallet:
    w = db.get(StoreWallet, store_id)
    if w is None:
        w = StoreWallet(store_id=store_id, balance_eur=0.0)
        db.add(w)
        db.flush()
    return w


def get_reconciliation_run(db: Session, store_id: int, year_month: str) -> ReconciliationRun | None:
    return db.scalar(
        select(ReconciliationRun).where(
            ReconciliationRun.store_id == store_id,
            ReconciliationRun.month == year_month,
        )
    )


def persist_failed_reconciliation(
    db: Session,
    *,
    store: Store,
    year_month: str,
    message: str,
    hash_fn: Any = immutable_audit_hash,
) -> None:
    run = get_reconciliation_run(db, store.id, year_month)
    h = hash_fn({"failed": True, "reason": message, "month": year_month, "store": store.public_id})
    if run is None:
        db.add(
            ReconciliationRun(
                store_id=store.id,
                month=year_month,
                status="failed",
                total_adjustment_eur=0.0,
                balance_delta_applied_eur=0.0,
                action="error",
                audit_hash=h,
                error_message=message[:2000],
            )
        )
    else:
        if run.status != "completed":
            run.status = "failed"
            run.error_message = message[:2000]
            run.audit_hash = h
    db.commit()


def commit_completed_reconciliation(
    db: Session,
    *,
    store: Store,
    year_month: str,
    existing: ReconciliationRun | None,
    total_adjustment_eur: float,
    action: str,
    details: list[dict[str, Any]],
    orders_snap: dict[str, int],
    returns_snap: dict[str, int],
    rates_snap: dict[str, float],
    audit_hash: str,
    notification_hint: str,
) -> None:
    """Persist ReconciliationRun, adjust wallet, optional WalletLedgerEntry; commit."""
    details_json = json.dumps(details, separators=(",", ":"), ensure_ascii=False)
    orders_json = json.dumps(orders_snap, separators=(",", ":"), ensure_ascii=False)
    returns_json = json.dumps(returns_snap, separators=(",", ":"), ensure_ascii=False)
    rates_json = json.dumps(dict(sorted(rates_snap.items())), separators=(",", ":"), ensure_ascii=False)

    run = existing
    if run is None:
        run = ReconciliationRun(
            store_id=store.id,
            month=year_month,
            status="completed",
            total_adjustment_eur=total_adjustment_eur,
            balance_delta_applied_eur=total_adjustment_eur,
            action=action,
            details_json=details_json,
            orders_snapshot_json=orders_json,
            returns_snapshot_json=returns_json,
            rates_snapshot_json=rates_json,
            audit_hash=audit_hash,
            notification_hint=notification_hint[:500],
        )
        db.add(run)
    else:
        run.status = "completed"
        run.total_adjustment_eur = total_adjustment_eur
        run.balance_delta_applied_eur = total_adjustment_eur
        run.action = action
        run.details_json = details_json
        run.orders_snapshot_json = orders_json
        run.returns_snapshot_json = returns_json
        run.rates_snapshot_json = rates_json
        run.audit_hash = audit_hash
        run.notification_hint = notification_hint[:500]
        run.error_message = None

    db.flush()

    wallet = ensure_store_wallet(db, store.id)
    bal_after = float(wallet.balance_eur) - total_adjustment_eur
    wallet.balance_eur = bal_after

    if abs(total_adjustment_eur) >= 1e-9:
        db.add(
            WalletLedgerEntry(
                store_id=store.id,
                adjustment_eur=total_adjustment_eur,
                balance_after_eur=bal_after,
                reason="monthly_reconciliation",
                reconciliation_run_id=run.id,
                extra_metadata=json.dumps(
                    {"month": year_month, "audit_hash": audit_hash},
                    separators=(",", ":"),
                ),
            )
        )

    db.commit()
