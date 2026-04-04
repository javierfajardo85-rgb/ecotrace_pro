from pydantic import BaseModel, Field


class ApiProductItem(BaseModel):
    category: str = Field(..., description="Categoría del producto", min_length=1, max_length=80)
    weight_proportion: float = Field(1.0, ge=0.0, le=1.0, description="Proporción del peso total del pedido")


class ApiCalculateRequest(BaseModel):
    weight_kg: float = Field(..., gt=0)
    distance_km: float = Field(..., gt=0)
    transport_mode: str = Field(default="truck", max_length=40)
    products: list[ApiProductItem] = Field(..., min_length=1)
    carbon_interface_response: float | None = Field(
        default=None,
        description="kg CO₂e desde API externa (p. ej. Carbon Interface). Si se informa, se usa como E_ida directo.",
    )


class ApiCalculateResponse(BaseModel):
    request_id: str
    co2_total_kg: float
    co2_ida_kg: float
    co2_devoluciones_estimadas_kg: float
    tasa_compensacion_eur: float
    tasa_servicio_ecotrace_eur: float
    total_upgrade_cliente_eur: float
    category_rates_used: dict[str, float]
    notes: str = "Cálculo audit-ready con reconciliación mensual"
