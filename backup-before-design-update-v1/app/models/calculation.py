"""Historial de cálculos en checkout (/calculate) y transacciones de compensación."""

from __future__ import annotations

import datetime as dt
import enum
import uuid

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base
from .common import _utcnow
from .merchant import Merchant


class CalculationLog(Base):
    """Registro de cálculo por pedido (tabla física `logs`)."""

    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    merchant_id: Mapped[int] = mapped_column("store_id", ForeignKey("stores.id"), nullable=False, index=True)

    transaction_id: Mapped[str] = mapped_column(String(32), nullable=False, index=True)

    origin_zip: Mapped[str | None] = mapped_column(String(20), nullable=True)
    destination_zip: Mapped[str | None] = mapped_column(String(20), nullable=True)
    origin_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    origin_lon: Mapped[float | None] = mapped_column(Float, nullable=True)
    destination_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    destination_lon: Mapped[float | None] = mapped_column(Float, nullable=True)

    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    distance_km: Mapped[float] = mapped_column(Float, nullable=False)
    activity_tkm: Mapped[float | None] = mapped_column(Float, nullable=True)
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False, default="truck")

    co2_kg: Mapped[float] = mapped_column(Float, nullable=False)
    co2_ida_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    co2_returns_estimated_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    primary_category: Mapped[str | None] = mapped_column(String(60), nullable=True)
    co2_source: Mapped[str] = mapped_column(String(30), nullable=False)
    emission_factor_used: Mapped[float | None] = mapped_column(Float, nullable=True)
    emission_factor_source: Mapped[str | None] = mapped_column(String(60), nullable=True)
    source_metadata: Mapped[str | None] = mapped_column(Text, nullable=True)
    radiative_forcing_multiplier: Mapped[float | None] = mapped_column(Float, nullable=True)
    uncertainty_multiplier: Mapped[float | None] = mapped_column(Float, nullable=True)
    audit_status: Mapped[str | None] = mapped_column(String(20), nullable=True)
    audit_log: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_offset_purchased: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)

    merchant: Mapped[Merchant] = relationship(back_populates="calculation_logs")


class TransactionStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id: Mapped[int] = mapped_column("store_id", ForeignKey("stores.id"), nullable=False, index=True)
    order_id: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    carbon_kg: Mapped[float] = mapped_column(Float, nullable=False)
    tasa_1_compensacion: Mapped[float] = mapped_column(Float, nullable=False)
    tasa_2_devolucion: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(
        Enum(TransactionStatus, native_enum=False, length=20),
        nullable=False,
        default=TransactionStatus.pending,
    )
    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        nullable=False,
        index=True,
    )

    merchant: Mapped[Merchant] = relationship()
