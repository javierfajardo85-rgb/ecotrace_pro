"""
Stateless footprint API used by POST /api/calculate (production contract, Apr 2026).

Differs slightly from the widget /calculate path when `carbon_interface_kg` is passed:
here the external value is used as E_ida as-is (no extra F_load × M_RF × M_unc), matching
the published API spec.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from ..config import Settings
from .calculation_engine import merged_return_rates, resolve_return_rate


def _normalize_weight_proportions(products: list[tuple[str, float]]) -> list[tuple[str, float]]:
    """(category, proportion raw) → same with proportions summing to 1."""
    if not products:
        return []
    raw = [max(0.0, float(p)) for _, p in products]
    s = sum(raw)
    if s <= 0:
        n = len(products)
        return [(c, 1.0 / n) for c, _ in products]
    return [(c, r / s) for (c, _), r in zip(products, raw)]


def emission_factor_for_mode(transport_mode: str, ef_table: dict[str, float]) -> float:
    m = (transport_mode or "truck").lower().strip()
    if m in {"plane", "air"}:
        return float(ef_table.get("air", ef_table.get("plane", 0.5)))
    return float(ef_table.get(m, ef_table["default"]))


@dataclass(frozen=True)
class ApiFootprintResult:
    request_id: str
    co2_total_kg: float
    co2_ida_kg: float
    co2_devoluciones_estimadas_kg: float
    tasa_compensacion_eur: float
    tasa_servicio_ecotrace_eur: float
    total_upgrade_cliente_eur: float
    category_rates_used: dict[str, float]


def compute_api_footprint(
    *,
    settings: Settings,
    weight_kg: float,
    distance_km: float,
    transport_mode: str,
    products: list[tuple[str, float]],
    carbon_interface_kg: float | None,
    ef_table: dict[str, float],
) -> ApiFootprintResult:
    mode_l = (transport_mode or "truck").lower().strip()
    thr = float(settings.longhaul_km_threshold)

    if carbon_interface_kg is not None:
        e_ida = float(carbon_interface_kg)
    else:
        activity_tkm = (float(weight_kg) / 1000.0) * float(distance_km)
        ef = emission_factor_for_mode(mode_l, ef_table)
        m_rf = float(settings.radiative_forcing_air_multiplier) if mode_l in {"air", "plane"} else 1.0
        m_unc = float(settings.uncertainty_longhaul_multiplier) if float(distance_km) > thr else 1.0
        f_load = float(settings.load_factor)
        e_ida = activity_tkm * ef * f_load * m_rf * m_unc

    f_ret = float(settings.returns_logistics_multiplier)
    f_dil = float(settings.returns_dilution_factor)
    r_table = merged_return_rates(settings)

    normalized = _normalize_weight_proportions(products)
    e_devol_total = 0.0
    category_rates_used: dict[str, float] = {}

    for cat, w_prop in normalized:
        c = cat.lower().strip()
        r_cat = resolve_return_rate(c, r_table)
        category_rates_used[c] = r_cat
        e_product = e_ida * w_prop
        e_devol_total += e_product * r_cat * f_ret * f_dil

    e_total = e_ida + e_devol_total

    p_carbon = float(settings.carbon_price_eur_per_tonne)
    tasa_1 = e_total * (p_carbon / 1000.0)
    fee_fixed = float(settings.ecotrace_fee_fixed_eur)
    fee_min = float(settings.ecotrace_fee_min_eur)
    fee_pct = float(settings.ecotrace_fee_pct_on_compensation)
    raw_comm = tasa_1 * fee_pct
    tasa_2 = fee_fixed + max(fee_min, raw_comm)
    total_upgrade = round(tasa_1 + tasa_2, 2)

    return ApiFootprintResult(
        request_id=str(uuid.uuid4()),
        co2_total_kg=round(e_total, 4),
        co2_ida_kg=round(e_ida, 4),
        co2_devoluciones_estimadas_kg=round(e_devol_total, 4),
        tasa_compensacion_eur=round(tasa_1, 2),
        tasa_servicio_ecotrace_eur=round(tasa_2, 2),
        total_upgrade_cliente_eur=total_upgrade,
        category_rates_used=dict(category_rates_used),
    )
