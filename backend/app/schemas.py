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
    weight_kg: float = Field(gt=0)
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

