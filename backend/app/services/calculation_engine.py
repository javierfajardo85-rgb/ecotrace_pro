"""
EcoTrace order-level carbon engine (Scope 3 Category 9–aligned).

E_ida: outbound leg with load factor and logistics multipliers.
E_returns_est: category return-rate × reverse-logistics multiplier × optional dilution.
E_total = E_ida + E_returns_est.

Pricing: compensación (€/t CO₂e) + transparent EcoTrace service fee.
"""

from __future__ import annotations

from dataclasses import dataclass

from ..config import Settings
from .calculation_core import (
    DEFAULT_RETURN_RATES,
    compute_footprint_core,
    merged_return_rates,
    resolve_return_rate,
)


@dataclass(frozen=True)
class ProductLineNormalized:
    category: str
    weight_share: float


@dataclass(frozen=True)
class CalculationEngineResult:
    co2_ida_kg: float
    co2_returns_estimated_kg: float
    co2_total_kg: float
    activity_tkm: float
    emission_factor_used: float | None
    base_co2_before_load_kg: float
    load_factor: float
    radiative_forcing_multiplier: float
    uncertainty_multiplier: float
    returns_multiplier: float
    dilution_factor: float
    category_breakdown: dict[str, dict[str, float]]
    tasa_compensacion_eur: float
    tasa_servicio_ecotrace_eur: float
    total_client_eur: float


def normalize_product_lines(
    products: list | None,
    primary_category: str | None,
) -> list[ProductLineNormalized]:
    cat_default = (primary_category or "general").lower().strip() or "general"
    if not products:
        return [ProductLineNormalized(category=cat_default, weight_share=1.0)]

    n = len(products)
    shares: list[float] = []
    if all(getattr(p, "weight_proportion", None) is None for p in products):
        w = 1.0 / float(n)
        shares = [w] * n
    else:
        raw = [float(getattr(p, "weight_proportion") or 0.0) for p in products]
        s = sum(raw)
        if s <= 0:
            w = 1.0 / float(n)
            shares = [w] * n
        else:
            shares = [x / s for x in raw]

    out: list[ProductLineNormalized] = []
    for p, sh in zip(products, shares):
        c = (getattr(p, "category", None) or cat_default).lower().strip() or "general"
        out.append(ProductLineNormalized(category=c, weight_share=sh))
    return out


def compute_engine(
    *,
    settings: Settings,
    weight_kg: float,
    distance_km: float,
    vehicle_type: str,
    base_co2_kg_raw: float,
    ef_fallback: float | None,
    source: str,
    products_normalized: list[ProductLineNormalized],
) -> CalculationEngineResult:
    """base_co2_kg_raw: kg CO2e from Carbon Interface or activity_tkm×EF (before load / RF / unc)."""
    activity_tkm = (weight_kg / 1000.0) * distance_km
    raw_trip = float(base_co2_kg_raw)
    if activity_tkm > 0:
        ef_kg_per_tkm = raw_trip / float(activity_tkm)
    else:
        ef_kg_per_tkm = float(ef_fallback or 0.0)

    core = compute_footprint_core(
        settings=settings,
        activity_tkm=float(activity_tkm),
        emission_factor_kg_per_tkm=ef_kg_per_tkm,
        raw_trip_co2_kg=raw_trip,
        distance_km=float(distance_km),
        vehicle_type=vehicle_type or "truck",
        normalized_products=[(ln.category, ln.weight_share) for ln in products_normalized],
    )

    ef_used: float | None
    if source == "fallback" and ef_fallback is not None:
        ef_used = float(ef_fallback)
    else:
        try:
            ef_used = raw_trip / float(activity_tkm) if activity_tkm > 0 else None
        except Exception:
            ef_used = None

    return CalculationEngineResult(
        co2_ida_kg=core.co2_ida_kg,
        co2_returns_estimated_kg=core.co2_returns_estimated_kg,
        co2_total_kg=core.co2_total_kg,
        activity_tkm=core.activity_tkm,
        emission_factor_used=ef_used,
        base_co2_before_load_kg=raw_trip,
        load_factor=core.load_factor,
        radiative_forcing_multiplier=core.radiative_forcing_multiplier,
        uncertainty_multiplier=core.uncertainty_multiplier,
        returns_multiplier=core.returns_multiplier,
        dilution_factor=core.dilution_factor,
        category_breakdown=core.category_breakdown,
        tasa_compensacion_eur=core.tasa_compensacion_eur,
        tasa_servicio_ecotrace_eur=core.tasa_servicio_ecotrace_eur,
        total_client_eur=core.total_client_eur,
    )
