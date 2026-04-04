"""
Stateless footprint API used by POST /api/calculate (production contract, Apr 2026).

Usa el mismo núcleo que /calculate (`compute_footprint_core`): M_RF, M_unc, F_load y
devoluciones estimadas con la misma regla operativa.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from ..config import Settings
from .calculation_core import compute_footprint_core, merged_return_rates, resolve_return_rate


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
    activity_tkm = (float(weight_kg) / 1000.0) * float(distance_km)

    if carbon_interface_kg is not None:
        raw_trip = float(carbon_interface_kg)
        ef = (raw_trip / activity_tkm) if activity_tkm > 0 else 0.0
    else:
        ef = emission_factor_for_mode(mode_l, ef_table)
        raw_trip = activity_tkm * ef

    normalized = _normalize_weight_proportions(products)
    core = compute_footprint_core(
        settings=settings,
        activity_tkm=float(activity_tkm),
        emission_factor_kg_per_tkm=float(ef),
        raw_trip_co2_kg=float(raw_trip),
        distance_km=float(distance_km),
        vehicle_type=mode_l,
        normalized_products=normalized,
    )

    r_table = merged_return_rates(settings)
    category_rates_used: dict[str, float] = {}
    for cat, _w in normalized:
        c = str(cat).lower().strip()
        category_rates_used[c] = resolve_return_rate(c, r_table)

    return ApiFootprintResult(
        request_id=str(uuid.uuid4()),
        co2_total_kg=round(core.co2_total_kg, 4),
        co2_ida_kg=round(core.co2_ida_kg, 4),
        co2_devoluciones_estimadas_kg=round(core.co2_returns_estimated_kg, 4),
        tasa_compensacion_eur=round(core.tasa_compensacion_eur, 2),
        tasa_servicio_ecotrace_eur=round(core.tasa_servicio_ecotrace_eur, 2),
        total_upgrade_cliente_eur=core.total_client_eur,
        category_rates_used=dict(category_rates_used),
    )
