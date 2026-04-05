"""
POST /api/calculate — production contract (stateless, abril 2026).
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from ..config import settings
from ..rate_limit import rate_limit
from ..schemas_api_calculate import ApiCalculateRequest, ApiCalculateResponse
from ..services.api_footprint import compute_api_footprint
from ..services.carbon import EMISSION_FACTORS

router = APIRouter(prefix="/api", tags=["calculate"])


@router.post("/calculate", response_model=ApiCalculateResponse)
def calculate_footprint(req: ApiCalculateRequest, request: Request) -> ApiCalculateResponse:
    rate_limit(request)
    try:
        products_tuples = [(p.category, p.weight_proportion) for p in req.products]
        out = compute_api_footprint(
            settings=settings,
            weight_kg=req.weight_kg,
            distance_km=req.distance_km,
            transport_mode=req.transport_mode,
            products=products_tuples,
            carbon_interface_kg=req.carbon_interface_response,
            ef_table=EMISSION_FACTORS,
        )
        return ApiCalculateResponse(
            request_id=out.request_id,
            co2_total_kg=out.co2_total_kg,
            co2_ida_kg=out.co2_ida_kg,
            co2_devoluciones_estimadas_kg=out.co2_devoluciones_estimadas_kg,
            tasa_compensacion_eur=out.tasa_compensacion_eur,
            tasa_servicio_ecotrace_eur=out.tasa_servicio_ecotrace_eur,
            total_upgrade_cliente_eur=out.total_upgrade_cliente_eur,
            category_rates_used=out.category_rates_used,
            notes="Cálculo audit-ready con reconciliación mensual (ver POST /analytics/{store_public_id}/reconciliation).",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en cálculo: {e!s}") from e
