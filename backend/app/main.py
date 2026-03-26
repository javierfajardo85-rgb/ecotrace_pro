import datetime as dt

from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, DATABASE_URL, engine, get_db
from .models import Log, Store, User
from .rate_limit import rate_limit
from .schemas import (
    AnalyticsResponse,
    DailyEmissionsResponse,
    CalculateRequest,
    CalculateResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
)
from .security import (
    create_access_token,
    decode_access_token,
    generate_api_key,
    hash_api_key,
    hash_password,
    verify_password,
)
from .services.carbon import estimate_shipping_co2_kg, fallback_co2_kg
from .services.equivalents import kgco2_to_smartphone_charges, kgco2_to_tree_days
from .services.geo import coords_for_zip, haversine_km


app = FastAPI(title="EcoTrace Widget API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer = HTTPBearer(auto_error=False)


@app.on_event("startup")
def _startup() -> None:
    Base.metadata.create_all(bind=engine)
    _maybe_migrate_sqlite()


def _maybe_migrate_sqlite() -> None:
    # Minimal, safe migrations for MVP (SQLite only).
    if not DATABASE_URL.startswith("sqlite"):
        return
    try:
        with engine.connect() as conn:
            cols = conn.exec_driver_sql("PRAGMA table_info(logs);").fetchall()
            col_names = {c[1] for c in cols}  # (cid, name, type, notnull, dflt_value, pk)
            if "is_offset_purchased" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN is_offset_purchased BOOLEAN NOT NULL DEFAULT 0;")
                conn.commit()
    except Exception:
        # If the table doesn't exist yet, create_all already handled it.
        return


def require_user_id(creds: HTTPAuthorizationCredentials | None = Depends(bearer)) -> int:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Missing bearer token")
    user_id = decode_access_token(creds.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/auth/register", response_model=RegisterResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    api_key = generate_api_key()
    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        api_key_hash=hash_api_key(api_key),
    )
    db.add(user)
    db.flush()

    store = Store(user_id=user.id, store_url=payload.store_url, industry=payload.industry)
    db.add(store)
    db.commit()

    token = create_access_token(user_id=user.id)
    return RegisterResponse(user_id=user.id, store_public_id=store.public_id, api_key=api_key, token=token)


@app.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return LoginResponse(token=create_access_token(user_id=user.id))


@app.post("/calculate", response_model=CalculateResponse)
def calculate(payload: CalculateRequest, request: Request, db: Session = Depends(get_db)):
    rate_limit(request)

    store = db.scalar(select(Store).where(Store.public_id == payload.store_public_id))
    if not store:
        raise HTTPException(status_code=404, detail="Unknown store_public_id")

    if payload.distance_km:
        distance_km = float(payload.distance_km)
    elif (
        payload.origin_lat is not None
        and payload.origin_lon is not None
        and payload.destination_lat is not None
        and payload.destination_lon is not None
    ):
        distance_km = haversine_km(payload.origin_lat, payload.origin_lon, payload.destination_lat, payload.destination_lon)
    else:
        o = coords_for_zip(payload.origin_zip)
        d = coords_for_zip(payload.destination_zip)
        if not o or not d:
            raise HTTPException(
                status_code=422,
                detail="Unknown ZIP code for distance lookup. Provide distance_km or lat/lon fields.",
            )
        distance_km = haversine_km(o[0], o[1], d[0], d[1])

    weight_kg = float(payload.weight_kg)

    co2_kg = estimate_shipping_co2_kg(weight_kg=weight_kg, distance_km=distance_km, vehicle_type=payload.vehicle_type)
    if co2_kg is None:
        co2_kg = fallback_co2_kg(weight_kg=weight_kg, distance_km=distance_km)
        source = "fallback"
    else:
        source = "carbon_interface"

    log = Log(
        store_id=store.id,
        weight_kg=weight_kg,
        distance_km=distance_km,
        vehicle_type=(payload.vehicle_type or "truck"),
        co2_kg=float(co2_kg),
        co2_source=source,
        is_offset_purchased=bool(payload.is_offset_purchased),
    )
    db.add(log)
    db.commit()

    return CalculateResponse(
        co2_kg=float(co2_kg),
        distance_km=float(distance_km),
        source=source,
        smartphone_charges=kgco2_to_smartphone_charges(float(co2_kg)),
        tree_days=kgco2_to_tree_days(float(co2_kg)),
    )


@app.get("/analytics/{store_public_id}", response_model=AnalyticsResponse)
def analytics(store_public_id: str, user_id: int = Depends(require_user_id), db: Session = Depends(get_db)):
    store = db.scalar(select(Store).where(Store.public_id == store_public_id))
    if not store or store.user_id != user_id:
        raise HTTPException(status_code=404, detail="Store not found")

    now = dt.datetime.now(dt.UTC)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_orders = db.scalar(
        select(func.count(Log.id)).where(Log.store_id == store.id, Log.created_at >= month_start)
    ) or 0
    total_co2 = db.scalar(
        select(func.coalesce(func.sum(Log.co2_kg), 0.0)).where(Log.store_id == store.id, Log.created_at >= month_start)
    ) or 0.0

    offset_orders = db.scalar(
        select(func.count(Log.id)).where(
            Log.store_id == store.id, Log.created_at >= month_start, Log.is_offset_purchased == True  # noqa: E712
        )
    ) or 0
    offset_revenue = float(offset_orders) * 0.50
    offset_tree_counter = int(offset_orders)

    return AnalyticsResponse(
        store_public_id=store.public_id,
        month=month_start.strftime("%Y-%m"),
        total_orders=int(total_orders),
        total_co2_kg=float(total_co2),
        smartphone_charges=kgco2_to_smartphone_charges(float(total_co2)),
        tree_days=kgco2_to_tree_days(float(total_co2)),
        offset_orders=int(offset_orders),
        offset_revenue_eur=float(offset_revenue),
        offset_tree_counter=int(offset_tree_counter),
    )


@app.get("/analytics/{store_public_id}/daily", response_model=DailyEmissionsResponse)
def analytics_daily(
    store_public_id: str,
    days: int = Query(default=7, ge=1, le=31),
    user_id: int = Depends(require_user_id),
    db: Session = Depends(get_db),
):
    store = db.scalar(select(Store).where(Store.public_id == store_public_id))
    if not store or store.user_id != user_id:
        raise HTTPException(status_code=404, detail="Store not found")

    now = dt.datetime.now(dt.UTC)
    start = (now - dt.timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)

    day_col = func.date(Log.created_at)
    rows = db.execute(
        select(day_col.label("day"), func.coalesce(func.sum(Log.co2_kg), 0.0).label("co2"))
        .where(Log.store_id == store.id, Log.created_at >= start)
        .group_by(day_col)
        .order_by(day_col.asc())
    ).all()

    by_day = {str(r.day): float(r.co2) for r in rows}
    points = []
    for i in range(days):
        d = (start + dt.timedelta(days=i)).date().isoformat()
        points.append({"date": d, "co2_kg": float(by_day.get(d, 0.0))})

    return DailyEmissionsResponse(store_public_id=store.public_id, days=days, points=points)

