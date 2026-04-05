import datetime as dt

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base, DATABASE_URL


def _utcnow() -> dt.datetime:
    return dt.datetime.now(dt.UTC)


def _jsonb_type():
    # Use JSONB on Postgres, and plain TEXT on SQLite for MVP compatibility.
    # (SQLite has no native JSONB; we store JSON serialized in TEXT there.)
    if DATABASE_URL.startswith("sqlite"):
        return Text
    return JSONB


JsonField = _jsonb_type()


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    country: Mapped[str] = mapped_column(String(2), nullable=False)  # ISO 3166-1 alpha-2
    industry: Mapped[str | None] = mapped_column(String(120), nullable=True)
    baseline_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    consolidation_method: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="operational_control",  # operational_control | financial_control | equity_share
    )
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    memberships: Mapped[list["Membership"]] = relationship(back_populates="organization", cascade="all, delete-orphan")
    facilities: Mapped[list["Facility"]] = relationship(back_populates="organization", cascade="all, delete-orphan")
    activities: Mapped[list["Activity"]] = relationship(back_populates="organization", cascade="all, delete-orphan")


class Membership(Base):
    __tablename__ = "memberships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(16), nullable=False, default="owner")  # owner | admin | analyst | viewer | auditor
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    organization: Mapped[Organization] = relationship(back_populates="memberships")


class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    country: Mapped[str] = mapped_column(String(2), nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    organization: Mapped[Organization] = relationship(back_populates="facilities")


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    facility_id: Mapped[int | None] = mapped_column(ForeignKey("facilities.id"), nullable=True, index=True)

    scope: Mapped[int] = mapped_column(Integer, nullable=False)  # 1 | 2 | 3
    category: Mapped[str] = mapped_column(String(200), nullable=False)

    activity_data_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    activity_data_unit: Mapped[str | None] = mapped_column(String(60), nullable=True)

    spend_amount: Mapped[float | None] = mapped_column(Numeric(18, 2), nullable=True)
    spend_currency: Mapped[str | None] = mapped_column(String(3), nullable=True)

    data_quality_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="estimated",  # estimated | spend_based | supplier_primary | verified
    )
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False, default=50)  # 0-100

    input_metadata: Mapped[dict | str | None] = mapped_column(JsonField, nullable=True)

    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)

    organization: Mapped[Organization] = relationship(back_populates="activities")


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source: Mapped[str] = mapped_column(String(40), nullable=False)  # DEFRA | IPCC | EPA | ...
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    region: Mapped[str] = mapped_column(String(40), nullable=False)  # e.g. "UK", "EU", "US", "GLOBAL"
    category: Mapped[str] = mapped_column(String(240), nullable=False)
    unit: Mapped[str] = mapped_column(String(80), nullable=False)  # e.g. "kgCO2e/kWh"
    factor_value: Mapped[float] = mapped_column(Float, nullable=False)
    methodology_reference: Mapped[str | None] = mapped_column(String(400), nullable=True)
    version: Mapped[str] = mapped_column(String(60), nullable=False)
    valid_from: Mapped[dt.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    valid_to: Mapped[dt.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)


class Calculation(Base):
    __tablename__ = "calculations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"), nullable=False, index=True)
    factor_id: Mapped[int] = mapped_column(ForeignKey("emission_factors.id"), nullable=False, index=True)

    factor_snapshot: Mapped[dict | str] = mapped_column(JsonField, nullable=False)
    formula_used: Mapped[str] = mapped_column(String(40), nullable=False, default="E = A × EF")
    result_value: Mapped[float] = mapped_column(Float, nullable=False)
    result_unit: Mapped[str] = mapped_column(String(40), nullable=False, default="kgCO2e")
    performed_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)


class AuditTrail(Base):
    __tablename__ = "audit_trails"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    calculation_id: Mapped[int] = mapped_column(ForeignKey("calculations.id"), nullable=False, index=True)
    full_trace: Mapped[dict | str] = mapped_column(JsonField, nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)


class SpendCategory(Base):
    __tablename__ = "spend_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    raw_input_name: Mapped[str] = mapped_column(String(240), nullable=False, index=True)
    mapped_standard_category: Mapped[str] = mapped_column(String(240), nullable=False)
    auto_mapped: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False, default=60)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)

