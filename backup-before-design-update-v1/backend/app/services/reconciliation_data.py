"""Aggregate orders / avg E_ida from logs; load monthly return counts from DB."""

from __future__ import annotations

import datetime as dt
from typing import TYPE_CHECKING

from sqlalchemy import func, select

from ..models import CalculationLog, MonthlyCategoryReturn

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


def month_utc_bounds(year_month: str) -> tuple[dt.datetime, dt.datetime]:
    y, m = year_month.split("-")
    start = dt.datetime(int(y), int(m), 1, tzinfo=dt.UTC)
    if int(m) == 12:
        end = dt.datetime(int(y) + 1, 1, 1, tzinfo=dt.UTC)
    else:
        end = dt.datetime(int(y), int(m) + 1, 1, tzinfo=dt.UTC)
    return start, end


def get_previous_year_month(reference: dt.datetime | None = None) -> str:
    ref = reference or dt.datetime.now(dt.UTC)
    first = ref.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    prev_end = first - dt.timedelta(days=1)
    return prev_end.strftime("%Y-%m")


def aggregate_orders_and_avg_ida_kg(
    db: "Session",
    *,
    merchant_id: int,
    year_month: str,
    default_ida_fallback_ratio: float = 0.55,
) -> tuple[dict[str, int], dict[str, float]]:
    """
    From checkout logs: order counts and average outbound CO₂e per category.
    Uses co2_ida_kg when present; else co2_kg * default_ida_fallback_ratio as proxy.
    """
    start, end = month_utc_bounds(year_month)
    ida_expr = func.coalesce(CalculationLog.co2_ida_kg, CalculationLog.co2_kg * default_ida_fallback_ratio)

    rows = db.execute(
        select(
            CalculationLog.primary_category,
            func.count(CalculationLog.id).label("cnt"),
            func.avg(ida_expr).label("avg_ida"),
        )
        .where(
            CalculationLog.merchant_id == merchant_id,
            CalculationLog.created_at >= start,
            CalculationLog.created_at < end,
        )
        .group_by(CalculationLog.primary_category)
    ).all()

    orders: dict[str, int] = {}
    avg_ida: dict[str, float] = {}
    for cat, cnt, avg in rows:
        key = (cat or "general").lower().strip() or "general"
        orders[key] = int(cnt or 0)
        if avg is not None:
            avg_ida[key] = float(avg)
    return orders, avg_ida


def load_returns_by_category_from_db(db: "Session", *, merchant_id: int, year_month: str) -> dict[str, int]:
    rows = db.scalars(
        select(MonthlyCategoryReturn).where(
            MonthlyCategoryReturn.merchant_id == merchant_id,
            MonthlyCategoryReturn.year_month == year_month,
        )
    ).all()
    return {r.category.lower().strip(): int(r.return_count) for r in rows}


def merchant_ids_with_logs_in_month(db: "Session", year_month: str) -> list[int]:
    start, end = month_utc_bounds(year_month)
    subq = (
        select(CalculationLog.merchant_id)
        .where(CalculationLog.created_at >= start, CalculationLog.created_at < end)
        .distinct()
    )
    return list(db.scalars(subq).all())
