"""Reconciliación mensual, devoluciones importadas y ledger de wallet."""

from __future__ import annotations

import datetime as dt

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base
from .common import _utcnow
from .merchant import Store


class MonthlyCategoryReturn(Base):
    __tablename__ = "monthly_category_returns"
    __table_args__ = (UniqueConstraint("store_id", "year_month", "category", name="uq_monthly_returns_store_month_cat"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), nullable=False, index=True)
    year_month: Mapped[str] = mapped_column(String(7), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    return_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    source: Mapped[str] = mapped_column(String(40), nullable=False, default="manual_import")
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)
    updated_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False)


class ReconciliationRun(Base):
    """Equiv. a ReconciliationLog del diseño genérico: un registro auditable por tienda y mes."""

    __tablename__ = "reconciliation_runs"
    __table_args__ = (UniqueConstraint("store_id", "month", name="uq_reconciliation_store_month"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), nullable=False, index=True)
    month: Mapped[str] = mapped_column(String(7), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    total_adjustment_eur: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    balance_delta_applied_eur: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    action: Mapped[str] = mapped_column(String(64), nullable=False, default="noop")
    details_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    orders_snapshot_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    returns_snapshot_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    rates_snapshot_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    audit_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    notification_hint: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)

    store: Mapped[Store] = relationship("Store", back_populates="reconciliation_runs")


class WalletLedgerEntry(Base):
    __tablename__ = "wallet_ledger_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), nullable=False, index=True)
    adjustment_eur: Mapped[float] = mapped_column(Float, nullable=False)
    balance_after_eur: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str] = mapped_column(String(80), nullable=False)
    reconciliation_run_id: Mapped[int | None] = mapped_column(ForeignKey("reconciliation_runs.id"), nullable=True, index=True)
    extra_metadata: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)
