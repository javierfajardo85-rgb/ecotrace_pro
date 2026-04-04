"""Schemas Pydantic para reconciliación mensual, wallet y cron."""

from pydantic import BaseModel, Field


class MonthlyReconciliationRequest(BaseModel):
    month: str = Field(pattern=r"^\d{4}-\d{2}$")
    orders_by_category: dict[str, int]
    returns_by_category: dict[str, int]
    avg_co2_ida_kg_by_category: dict[str, float] = Field(default_factory=dict)
    default_avg_co2_ida_kg: float = Field(default=0.35, gt=0)


class MonthlyReconciliationRowResponse(BaseModel):
    category: str
    orders: int
    returns_observed: int
    return_rate_assumed: float
    return_rate_observed: float
    avg_co2_ida_kg: float
    delta_co2_kg: float
    delta_credit_eur: float


class MonthlyReconciliationResponse(BaseModel):
    store_public_id: str
    month: str
    rows: list[MonthlyReconciliationRowResponse]
    total_delta_co2_kg: float
    total_adjustment_eur: float
    note: str = (
        "Positive total_adjustment_eur means observed returns exceeded assumptions — "
        "apply as debit to merchant climate wallet or next invoice."
    )


class MonthlyReturnsImportRequest(BaseModel):
    month: str = Field(pattern=r"^\d{4}-\d{2}$")
    returns_by_category: dict[str, int]
    source: str = Field(default="manual_import", max_length=40)


class CronReconciliationRequest(BaseModel):
    month: str | None = Field(default=None, description="YYYY-MM; default = previous calendar month (UTC)")
    merge_shopify: bool = False


class ReconciliationJobItemResponse(BaseModel):
    store_public_id: str
    month: str
    status: str
    total_adjustment_eur: float
    action: str
    audit_hash: str
    detail: str


class CronReconciliationResponse(BaseModel):
    month_effective: str
    processed: int
    results: list[ReconciliationJobItemResponse]


class WalletBalanceResponse(BaseModel):
    store_public_id: str
    balance_eur: float


class ReconciliationRunSummary(BaseModel):
    month: str
    status: str
    total_adjustment_eur: float
    action: str
    audit_hash: str
    notification_hint: str | None
    created_at: str


class ReconciliationDetailSchema(BaseModel):
    """Detalle por categoría (API genérica / informes)."""

    category: str
    r_estimada: float
    r_real: float
    delta_emisiones_kg: float
    ajuste_credito_eur: float


class ReconciliationResultSchema(BaseModel):
    merchant_public_id: str
    month: str
    total_adjustment_eur: float
    action: str
    details: list[ReconciliationDetailSchema]
