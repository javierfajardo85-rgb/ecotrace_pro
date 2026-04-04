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


DEFAULT_RETURN_RATES: dict[str, float] = {
    # Abril 2026 — prioridad tabla operativa; "default" usado por API /api/calculate
    "shoes": 0.28,
    "footwear": 0.28,
    "fashion": 0.25,
    "fashion_women": 0.27,
    "fashion_men": 0.19,
    "apparel": 0.25,
    "clothing": 0.25,
    "electronics": 0.10,
    "beauty": 0.09,
    "cosmetics": 0.09,
    "home": 0.12,
    "accessories": 0.13,
    "default": 0.15,
    "general": 0.15,
    "sports": 0.22,
    "toys": 0.18,
    "books": 0.12,
    "food": 0.08,
}


def merged_return_rates(settings: Settings) -> dict[str, float]:
    out = dict(DEFAULT_RETURN_RATES)
    extra = settings.return_rates_extra or {}
    out.update({str(k).lower().strip(): float(v) for k, v in extra.items()})
    return out


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


def resolve_return_rate(category: str, table: dict[str, float]) -> float:
    c = category.lower().strip()
    if c in table:
        return float(table[c])
    return float(table.get("default", table.get("general", 0.15)))


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
    v = (vehicle_type or "truck").lower().strip()
    inferred_air = float(distance_km) > float(settings.longhaul_km_threshold) or v in {"plane", "air"}
    m_rf = float(settings.radiative_forcing_air_multiplier) if inferred_air else 1.0
    m_unc = float(settings.uncertainty_longhaul_multiplier) if float(distance_km) > float(
        settings.longhaul_km_threshold
    ) else 1.0
    f_load = float(settings.load_factor)

    # E_ida: apply load factor on physical-intensity; RF and uncertainty on reported climate impact.
    co2_ida_kg = float(base_co2_kg_raw) * f_load * m_rf * m_unc

    r_table = merged_return_rates(settings)
    f_ret = float(settings.returns_logistics_multiplier)
    f_dil = float(settings.returns_dilution_factor)

    category_breakdown: dict[str, dict[str, float]] = {}
    co2_returns = 0.0
    for line in products_normalized:
        r_cat = resolve_return_rate(line.category, r_table)
        e_alloc = co2_ida_kg * line.weight_share
        e_ret_line = e_alloc * r_cat * f_ret * f_dil
        co2_returns += e_ret_line
        category_breakdown[line.category] = {
            "weight_share": line.weight_share,
            "return_rate_assumed": r_cat,
            "co2_returns_estimated_kg": e_ret_line,
        }

    co2_total = co2_ida_kg + co2_returns
    p_carbon = float(settings.carbon_price_eur_per_tonne)
    tasa_1 = co2_total * (p_carbon / 1000.0)
    fee_fixed = float(settings.ecotrace_fee_fixed_eur)
    fee_pct = float(settings.ecotrace_fee_pct_on_compensation)
    fee_min = float(settings.ecotrace_fee_min_eur)
    raw_comm = tasa_1 * fee_pct
    tasa_2 = fee_fixed + max(fee_min, raw_comm)
    total = round(tasa_1 + tasa_2, 2)

    ef_used: float | None
    if source == "fallback" and ef_fallback is not None:
        ef_used = float(ef_fallback)
    else:
        try:
            ef_used = float(base_co2_kg_raw) / float(activity_tkm) if activity_tkm > 0 else None
        except Exception:
            ef_used = None

    return CalculationEngineResult(
        co2_ida_kg=float(co2_ida_kg),
        co2_returns_estimated_kg=float(co2_returns),
        co2_total_kg=float(co2_total),
        activity_tkm=float(activity_tkm),
        emission_factor_used=ef_used,
        base_co2_before_load_kg=float(base_co2_kg_raw),
        load_factor=f_load,
        radiative_forcing_multiplier=m_rf,
        uncertainty_multiplier=m_unc,
        returns_multiplier=f_ret,
        dilution_factor=f_dil,
        category_breakdown=category_breakdown,
        tasa_compensacion_eur=float(tasa_1),
        tasa_servicio_ecotrace_eur=float(tasa_2),
        total_client_eur=float(total),
    )
