"""
Núcleo compartido de huella checkout (/calculate) y API stateless (/api/calculate).

Fórmula unificada (por línea de categoría con reparto de peso w):
  E_ida = raw_trip_co2_kg × F_load × M_RF × M_unc
  con raw_trip_co2_kg = activity_tkm × EF cuando activity_tkm > 0 (misma intensidad que antes de F_load/RF/unc).

  E_devolución_estimada,c = E_ida × w_c × r_categoría × MULTIPLIER_RETURNS × DILUTION_FACTOR
  E_total = E_ida + Σ_c E_devolución_estimada,c

Precios: tasa_1 (compensación €) + tasa_2 (servicio EcoTrace), transparente.
Precio €/t CO₂e: `settings.carbon_price_eur_per_tonne` (default = `app.core.config.CARBON_PRICE_EUR_PER_TONNE`).
"""

from __future__ import annotations

from dataclasses import dataclass

from ..config import Settings


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


def resolve_return_rate(category: str, table: dict[str, float]) -> float:
    c = category.lower().strip()
    if c in table:
        return float(table[c])
    return float(table.get("default", table.get("general", 0.15)))


@dataclass(frozen=True)
class FootprintCoreResult:
    co2_ida_kg: float
    co2_returns_estimated_kg: float
    co2_total_kg: float
    activity_tkm: float
    emission_factor_kg_per_tkm: float
    raw_trip_co2_kg: float
    load_factor: float
    radiative_forcing_multiplier: float
    uncertainty_multiplier: float
    returns_multiplier: float
    dilution_factor: float
    category_breakdown: dict[str, dict[str, float]]
    tasa_compensacion_eur: float
    tasa_servicio_ecotrace_eur: float
    total_client_eur: float


def logistics_multipliers(
    settings: Settings, *, distance_km: float, vehicle_type: str
) -> tuple[float, float, float]:
    """
    F_load, M_RF, M_unc — misma regla en widget y API:
    RF si largo recorrido (umbral km) o modo aéreo explícito.
    Incertidumbre si distancia > umbral largo recorrido.
    """
    v = (vehicle_type or "truck").lower().strip()
    thr = float(settings.longhaul_km_threshold)
    d = float(distance_km)
    inferred_air = d > thr or v in {"plane", "air"}
    m_rf = float(settings.radiative_forcing_air_multiplier) if inferred_air else 1.0
    m_unc = float(settings.uncertainty_longhaul_multiplier) if d > thr else 1.0
    f_load = float(settings.load_factor)
    return f_load, m_rf, m_unc


def compute_footprint_core(
    *,
    settings: Settings,
    activity_tkm: float,
    emission_factor_kg_per_tkm: float,
    raw_trip_co2_kg: float,
    distance_km: float,
    vehicle_type: str,
    normalized_products: list[tuple[str, float]],
) -> FootprintCoreResult:
    """
    `raw_trip_co2_kg`: kg CO₂e del trayecto antes de F_load / M_RF / M_unc (p. ej. Carbon Interface o tkm×EF).
    Si activity_tkm > 0, lo usual es raw_trip_co2_kg ≈ activity_tkm × emission_factor_kg_per_tkm.
    Si activity_tkm == 0, se usa raw_trip_co2_kg directamente como base (API con peso cero y kg externos).
    """
    f_load, m_rf, m_unc = logistics_multipliers(
        settings, distance_km=distance_km, vehicle_type=vehicle_type
    )
    tkm = float(activity_tkm)
    ef = float(emission_factor_kg_per_tkm)
    raw = float(raw_trip_co2_kg)
    base_before_load = (tkm * ef) if tkm > 0 else raw
    co2_ida_kg = base_before_load * f_load * m_rf * m_unc

    r_table = merged_return_rates(settings)
    f_ret = float(settings.returns_logistics_multiplier)
    f_dil = float(settings.returns_dilution_factor)

    category_breakdown: dict[str, dict[str, float]] = {}
    co2_returns = 0.0
    for cat, weight_share in normalized_products:
        c = str(cat).lower().strip() or "general"
        w = float(weight_share)
        r_cat = resolve_return_rate(c, r_table)
        e_alloc = co2_ida_kg * w
        e_ret_line = e_alloc * r_cat * f_ret * f_dil
        co2_returns += e_ret_line
        category_breakdown[c] = {
            "weight_share": w,
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

    return FootprintCoreResult(
        co2_ida_kg=float(co2_ida_kg),
        co2_returns_estimated_kg=float(co2_returns),
        co2_total_kg=float(co2_total),
        activity_tkm=float(tkm),
        emission_factor_kg_per_tkm=float(ef),
        raw_trip_co2_kg=float(raw),
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
