"""Merchant-facing entities: user accounts and stores (tienda = merchant en B2B)."""

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

    stores: Mapped[list["Store"]] = relationship("Store", back_populates="user", cascade="all, delete-orphan")


class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    store_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    industry: Mapped[str | None] = mapped_column(String(200), nullable=True)

    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user: Mapped[User] = relationship(back_populates="stores")
    logs: Mapped[list["Log"]] = relationship("Log", back_populates="store", cascade="all, delete-orphan")
    wallet: Mapped["StoreWallet | None"] = relationship(
        "StoreWallet", back_populates="store", uselist=False, cascade="all, delete-orphan"
    )
    reconciliation_runs: Mapped[list["ReconciliationRun"]] = relationship(
        "ReconciliationRun", back_populates="store"
    )


class StoreWallet(Base):
    """Crédito operativo / wallet climático (EUR) por tienda."""

    __tablename__ = "store_wallets"

    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), primary_key=True)
    balance_eur: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    store: Mapped[Store] = relationship("Store", back_populates="wallet")
