"""
CRUD de reconciliación y wallet (EcoTrace).

Convención:
  `climate_charge_eur` (= total_adjustment_eur en ReconciliationLog): positivo si r_real > r_est
  (más compensación adeudada); negativo si r_real < r_est (bonus → abono al wallet).

  `balance_eur -= climate_charge_eur`  →  cargo negativo aumenta el saldo.

  `balance_delta_applied_eur` en el log = cambio real del saldo (bal_after − bal_before),
  es decir −climate_charge_eur.
"""

from __future__ import annotations

import hashlib
import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Merchant, MerchantWallet, ReconciliationLog, WalletLedgerEntry


def immutable_audit_hash(payload: dict[str, Any]) -> str:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def ensure_merchant_wallet(db: Session, merchant_id: int) -> MerchantWallet:
    w = db.get(MerchantWallet, merchant_id)
    if w is None:
        w = MerchantWallet(merchant_id=merchant_id, balance_eur=0.0)
        db.add(w)
        db.flush()
    return w


def get_reconciliation_log(db: Session, merchant_id: int, year_month: str) -> ReconciliationLog | None:
    return db.scalar(
        select(ReconciliationLog).where(
            ReconciliationLog.merchant_id == merchant_id,
            ReconciliationLog.month == year_month,
        )
    )


def persist_failed_reconciliation(
    db: Session,
    *,
    merchant: Merchant,
    year_month: str,
    message: str,
    hash_fn: Any = immutable_audit_hash,
) -> None:
    run = get_reconciliation_log(db, merchant.id, year_month)
    h = hash_fn({"failed": True, "reason": message, "month": year_month, "merchant": merchant.public_id})
    if run is None:
        db.add(
            ReconciliationLog(
                merchant_id=merchant.id,
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
    merchant: Merchant,
    year_month: str,
    existing: ReconciliationLog | None,
    total_adjustment_eur: float,
    action: str,
    details: list[dict[str, Any]],
    orders_snap: dict[str, int],
    returns_snap: dict[str, int],
    rates_snap: dict[str, float],
    audit_hash: str,
    notification_hint: str,
) -> None:
    """Persist ReconciliationLog, adjust wallet, optional WalletLedgerEntry; commit."""
    details_json = json.dumps(details, separators=(",", ":"), ensure_ascii=False)
    orders_json = json.dumps(orders_snap, separators=(",", ":"), ensure_ascii=False)
    returns_json = json.dumps(returns_snap, separators=(",", ":"), ensure_ascii=False)
    rates_json = json.dumps(dict(sorted(rates_snap.items())), separators=(",", ":"), ensure_ascii=False)

    run = existing
    if run is None:
        run = ReconciliationLog(
            merchant_id=merchant.id,
            month=year_month,
            status="completed",
            total_adjustment_eur=total_adjustment_eur,
            balance_delta_applied_eur=0.0,
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
        run.action = action
        run.details_json = details_json
        run.orders_snapshot_json = orders_json
        run.returns_snapshot_json = returns_json
        run.rates_snapshot_json = rates_json
        run.audit_hash = audit_hash
        run.notification_hint = notification_hint[:500]
        run.error_message = None

    db.flush()

    wallet = ensure_merchant_wallet(db, merchant.id)
    bal_before = float(wallet.balance_eur)
    climate_charge_eur = float(total_adjustment_eur)
    bal_after = bal_before - climate_charge_eur
    wallet.balance_eur = bal_after
    wallet_balance_change_eur = bal_after - bal_before
    run.balance_delta_applied_eur = wallet_balance_change_eur

    if abs(climate_charge_eur) >= 1e-9:
        db.add(
            WalletLedgerEntry(
                merchant_id=merchant.id,
                adjustment_eur=climate_charge_eur,
                balance_after_eur=bal_after,
                reason="monthly_reconciliation",
                reconciliation_log_id=run.id,
                extra_metadata=json.dumps(
                    {
                        "month": year_month,
                        "audit_hash": audit_hash,
                        "wallet_balance_change_eur": wallet_balance_change_eur,
                        "climate_charge_eur": climate_charge_eur,
                    },
                    separators=(",", ":"),
                ),
            )
        )

    db.commit()
