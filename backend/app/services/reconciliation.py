"""
Monthly reconciliation: compare assumed category return rates vs observed rates,
estimate delta CO₂e and EUR credit adjustment (wallet-ready).
"""

from __future__ import annotations

from dataclasses import dataclass

from ..config import settings
from .calculation_core import merged_return_rates, resolve_return_rate


@dataclass(frozen=True)
class CategoryReconciliationRow:
    category: str
    orders: int
    returns_observed: int
    return_rate_assumed: float
    return_rate_observed: float
    avg_co2_ida_kg: float
    delta_co2_kg: float
    merchant_climate_charge_eur: float

    @property
    def delta_credit_eur(self) -> float:
        """Alias histórico: mismo valor que merchant_climate_charge_eur (€ con signo)."""
        return self.merchant_climate_charge_eur


@dataclass(frozen=True)
class MonthlyReconciliationResult:
    rows: list[CategoryReconciliationRow]
    total_delta_co2_kg: float
    total_adjustment_eur: float


def reconcile_monthly(
    *,
    orders_by_category: dict[str, int],
    returns_by_category: dict[str, int],
    avg_co2_ida_kg_by_category: dict[str, float],
    default_avg_co2_ida_kg: float = 0.35,
) -> MonthlyReconciliationResult:
    """
    Por categoría:
      ΔCO₂ ≈ n × avg(E_ida) × (r_real − r_estimada) × MULT_RET × DILUTION

    Cargo climático al comerciante (€), mismo signo que ΔCO₂ valorado al P_carbon:
      − Positivo: r_real > r_est → más huella de devolución que lo modelado → el comerciante
        debe más compensación → el wallet se reduce con `balance -= cargo`.
      − Negativo: r_real < r_est → bonus → el cargo es negativo y `balance -= cargo` aumenta el saldo.

    `total_adjustment_eur` = suma de esos cargos (convención alineada con crud/reconciliation).
    """
    f_ret = float(settings.returns_logistics_multiplier)
    f_dil = float(settings.returns_dilution_factor)
    p_carbon = float(settings.carbon_price_eur_per_tonne)
    table = merged_return_rates(settings)

    rows: list[CategoryReconciliationRow] = []
    total_d_co2 = 0.0
    total_adj = 0.0

    for cat, n_orders in orders_by_category.items():
        if n_orders <= 0:
            continue
        c = str(cat).lower().strip()
        n_ret = int(returns_by_category.get(c, returns_by_category.get(cat, 0)))
        r_ass = resolve_return_rate(c, table)
        r_obs = n_ret / float(n_orders)
        e_avg = float(avg_co2_ida_kg_by_category.get(c, avg_co2_ida_kg_by_category.get(cat, default_avg_co2_ida_kg)))
        d_r = r_obs - r_ass
        d_co2 = float(n_orders) * e_avg * d_r * f_ret * f_dil
        charge_eur = d_co2 * (p_carbon / 1000.0)
        rows.append(
            CategoryReconciliationRow(
                category=c,
                orders=n_orders,
                returns_observed=n_ret,
                return_rate_assumed=r_ass,
                return_rate_observed=r_obs,
                avg_co2_ida_kg=e_avg,
                delta_co2_kg=d_co2,
                merchant_climate_charge_eur=charge_eur,
            )
        )
        total_d_co2 += d_co2
        total_adj += charge_eur

    return MonthlyReconciliationResult(
        rows=rows,
        total_delta_co2_kg=total_d_co2,
        total_adjustment_eur=total_adj,
    )
