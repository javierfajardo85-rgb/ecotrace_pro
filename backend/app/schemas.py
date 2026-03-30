from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
    store_url: str = Field(min_length=3, max_length=2048)
    industry: str | None = Field(default=None, max_length=200)


class RegisterResponse(BaseModel):
    user_id: int
    store_public_id: str
    api_key: str
    token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str


class CalculateRequest(BaseModel):
    store_public_id: str
    origin_zip: str
    destination_zip: str
    weight_kg: float | None = Field(default=None, gt=0)
    vehicle_type: str = Field(default="truck")

    distance_km: float | None = Field(default=None, gt=0)
    origin_lat: float | None = None
    origin_lon: float | None = None
    destination_lat: float | None = None
    destination_lon: float | None = None

    is_offset_purchased: bool | None = Field(default=False)


class CalculateResponse(BaseModel):
    co2_kg: float
    distance_km: float
    source: str

    smartphone_charges: int
    tree_days: int


class AnalyticsResponse(BaseModel):
    store_public_id: str
    month: str
    total_orders: int
    total_co2_kg: float
    smartphone_charges: int
    tree_days: int

    offset_orders: int
    offset_revenue_eur: float
    offset_tree_counter: int


class DailyEmissionPoint(BaseModel):
    date: str  # YYYY-MM-DD
    co2_kg: float


class DailyEmissionsResponse(BaseModel):
    store_public_id: str
    days: int
    points: list[DailyEmissionPoint]


class OrganizationCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    country: str = Field(min_length=2, max_length=2)  # ISO 3166-1 alpha-2
    industry: str | None = Field(default=None, max_length=120)
    baseline_year: int | None = Field(default=None, ge=1900, le=2100)
    consolidation_method: str = Field(default="operational_control", max_length=32)


class OrganizationResponse(BaseModel):
    id: int
    name: str
    country: str
    industry: str | None
    baseline_year: int | None
    consolidation_method: str


class ActivityCreateRequest(BaseModel):
    facility_id: int | None = None
    scope: int = Field(ge=1, le=3)
    category: str = Field(min_length=2, max_length=200)
    activity_data_value: float | None = None
    activity_data_unit: str | None = Field(default=None, max_length=60)
    spend_amount: float | None = Field(default=None, ge=0)
    spend_currency: str | None = Field(default=None, min_length=3, max_length=3)
    data_quality_level: str = Field(default="estimated", max_length=20)
    confidence_score: int = Field(default=50, ge=0, le=100)
    input_metadata: dict | None = None


class ActivityResponse(BaseModel):
    id: int
    organization_id: int
    facility_id: int | None
    scope: int
    category: str
    activity_data_value: float | None
    activity_data_unit: str | None
    spend_amount: float | None
    spend_currency: str | None
    data_quality_level: str
    confidence_score: int


class EmissionFactorImportItem(BaseModel):
    source: str = Field(min_length=2, max_length=40)
    year: int = Field(ge=1900, le=2100)
    region: str = Field(min_length=2, max_length=40)
    category: str = Field(min_length=2, max_length=240)
    unit: str = Field(min_length=2, max_length=80)
    factor_value: float
    methodology_reference: str | None = Field(default=None, max_length=400)
    version: str = Field(min_length=1, max_length=60)


class EmissionFactorResolveRequest(BaseModel):
    scope: int = Field(ge=1, le=3)
    category: str = Field(min_length=2, max_length=240)
    region: str = Field(min_length=2, max_length=40)
    year: int = Field(ge=1900, le=2100)


class EmissionFactorResolved(BaseModel):
    factor_id: int
    factor_value: float
    source: str
    version: str
    unit: str


class CalculationResponse(BaseModel):
    calculation_id: int
    activity_id: int
    factor_id: int
    result_value: float
    result_unit: str
    data_quality_level: str
    confidence_score: int


class ComplianceStatusResponse(BaseModel):
    framework: str
    percent_complete: int
    missing_requirements: list[str]

