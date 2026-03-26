import datetime as dt
import uuid

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def _utcnow() -> dt.datetime:
    return dt.datetime.now(dt.UTC)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)

    api_key_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    stores: Mapped[list["Store"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    store_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    industry: Mapped[str | None] = mapped_column(String(200), nullable=True)

    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user: Mapped[User] = relationship(back_populates="stores")
    logs: Mapped[list["Log"]] = relationship(back_populates="store", cascade="all, delete-orphan")


class Log(Base):
    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), nullable=False, index=True)

    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    distance_km: Mapped[float] = mapped_column(Float, nullable=False)
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False, default="truck")

    co2_kg: Mapped[float] = mapped_column(Float, nullable=False)
    co2_source: Mapped[str] = mapped_column(String(30), nullable=False)  # "carbon_interface" | "fallback"

    is_offset_purchased: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)

    store: Mapped[Store] = relationship(back_populates="logs")

