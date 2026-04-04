"""Cuentas de usuario y comercio (merchant / tienda B2B)."""

from __future__ import annotations

import datetime as dt
import uuid

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base
from .common import _utcnow


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)

    api_key_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    merchants: Mapped[list["Merchant"]] = relationship(
        "Merchant", back_populates="user", cascade="all, delete-orphan"
    )


class Merchant(Base):
    """Tienda / comercio integrado (tabla física `stores` por compatibilidad)."""

    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    store_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    industry: Mapped[str | None] = mapped_column(String(200), nullable=True)

    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user: Mapped[User] = relationship(back_populates="merchants")
    calculation_logs: Mapped[list["CalculationLog"]] = relationship(
        "CalculationLog", back_populates="merchant", cascade="all, delete-orphan"
    )
    wallet: Mapped["MerchantWallet | None"] = relationship(
        "MerchantWallet", back_populates="merchant", uselist=False, cascade="all, delete-orphan"
    )
    reconciliation_logs: Mapped[list["ReconciliationLog"]] = relationship(
        "ReconciliationLog", back_populates="merchant"
    )


class MerchantWallet(Base):
    """Crédito operativo / wallet climático (EUR) por comercio."""

    __tablename__ = "store_wallets"

    merchant_id: Mapped[int] = mapped_column("store_id", ForeignKey("stores.id"), primary_key=True)
    balance_eur: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    merchant: Mapped[Merchant] = relationship("Merchant", back_populates="wallet")
