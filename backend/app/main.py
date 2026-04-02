import datetime as dt

import json
import uuid
from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, DATABASE_URL, engine, get_db
from .models import Log, Store, Transaction, User
from .green_models import Activity, AuditTrail, Calculation, EmissionFactor, Facility, Membership, Organization, SpendCategory  # noqa: F401
from .rate_limit import rate_limit
from .compliance import CSRD_MVP_REQUIREMENTS
from .schemas import (
    AnalyticsResponse,
    DailyEmissionsResponse,
    ActivityCreateRequest,
    ActivityResponse,
    CalculateRequest,
    CalculateResponse,
    EmissionFactorImportItem,
    EmissionFactorResolveRequest,
    EmissionFactorResolved,
    CalculationResponse,
    ComplianceStatusResponse,
    LoginRequest,
    LoginResponse,
    OrganizationCreateRequest,
    OrganizationResponse,
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
from .services.carbon import EMISSION_FACTORS, estimate_shipping_co2_kg, fallback_co2_kg
from .services.equivalents import kgco2_to_smartphone_charges, kgco2_to_tree_days
from .services.geo import coords_for_zip, haversine_km


app = FastAPI(title="EcoTrace Widget API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer = HTTPBearer(auto_error=False)


@app.get("/")
def root():
    return {"status": "EcoTrace API Online", "version": "1.0", "message": "Climate Compliance System Active"}


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
            if "origin_zip" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN origin_zip VARCHAR(20);")
                conn.commit()
            if "destination_zip" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN destination_zip VARCHAR(20);")
                conn.commit()
            if "emission_factor_used" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN emission_factor_used FLOAT;")
                conn.commit()
            if "source_metadata" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN source_metadata TEXT;")
                conn.commit()
            if "transaction_id" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN transaction_id VARCHAR(32) NOT NULL DEFAULT 'ECO-legacy';")
                conn.commit()
            if "origin_lat" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN origin_lat FLOAT;")
                conn.commit()
            if "origin_lon" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN origin_lon FLOAT;")
                conn.commit()
            if "destination_lat" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN destination_lat FLOAT;")
                conn.commit()
            if "destination_lon" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN destination_lon FLOAT;")
                conn.commit()
            if "activity_tkm" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN activity_tkm FLOAT;")
                conn.commit()
            if "emission_factor_source" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN emission_factor_source VARCHAR(60);")
                conn.commit()
            if "radiative_forcing_multiplier" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN radiative_forcing_multiplier FLOAT;")
                conn.commit()
            if "uncertainty_multiplier" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN uncertainty_multiplier FLOAT;")
                conn.commit()
            if "audit_status" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN audit_status VARCHAR(20);")
                conn.commit()
            if "audit_log" not in col_names:
                conn.exec_driver_sql("ALTER TABLE logs ADD COLUMN audit_log TEXT;")
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


def require_org_role(
    org_id: int,
    *,
    user_id: int,
    db: Session,
    allow_roles: set[str] | None = None,
) -> Membership:
    m = db.scalar(select(Membership).where(Membership.organization_id == org_id, Membership.user_id == user_id))
    if not m:
        raise HTTPException(status_code=403, detail="Not a member of this organization")
    if allow_roles and m.role not in allow_roles:
        raise HTTPException(status_code=403, detail="Insufficient role")
    return m


@app.post("/orgs", response_model=OrganizationResponse)
def create_org(payload: OrganizationCreateRequest, user_id: int = Depends(require_user_id), db: Session = Depends(get_db)):
    org = Organization(
        name=payload.name,
        country=payload.country.upper(),
        industry=payload.industry,
        baseline_year=payload.baseline_year,
        consolidation_method=payload.consolidation_method,
    )
    db.add(org)
    db.flush()
    db.add(Membership(user_id=user_id, organization_id=org.id, role="owner"))
    db.commit()
    return OrganizationResponse(
        id=org.id,
        name=org.name,
        country=org.country,
        industry=org.industry,
        baseline_year=org.baseline_year,
        consolidation_method=org.consolidation_method,
    )


@app.get("/orgs", response_model=list[OrganizationResponse])
def list_orgs(user_id: int = Depends(require_user_id), db: Session = Depends(get_db)):
    rows = db.execute(
        select(Organization)
        .join(Membership, Membership.organization_id == Organization.id)
        .where(Membership.user_id == user_id)
        .order_by(Organization.created_at.desc())
    ).scalars()
    return [
        OrganizationResponse(
            id=o.id,
            name=o.name,
            country=o.country,
            industry=o.industry,
            baseline_year=o.baseline_year,
            consolidation_method=o.consolidation_method,
        )
        for o in rows
    ]


def _auto_map_spend_category(raw: str) -> tuple[str, int]:
    s = (raw or "").lower()
    rules = [
        ("electricity", "Electricity"),
        ("fuel", "Fuel"),
        ("diesel", "Fuel"),
        ("gas", "Fuel"),
        ("shipping", "Transport"),
        ("freight", "Transport"),
        ("transport", "Transport"),
        ("travel", "Business travel"),
        ("flight", "Business travel"),
        ("hotel", "Business travel"),
        ("waste", "Waste"),
        ("software", "Purchased goods and services"),
        ("saas", "Purchased goods and services"),
        ("cloud", "Purchased goods and services"),
        ("office", "Purchased goods and services"),
    ]
    for k, mapped in rules:
        if k in s:
            return mapped, 80
    return "Purchased goods and services", 55


@app.post("/orgs/{org_id}/activities", response_model=ActivityResponse)
def create_activity(
    org_id: int,
    payload: ActivityCreateRequest,
    user_id: int = Depends(require_user_id),
    db: Session = Depends(get_db),
):
    require_org_role(org_id, user_id=user_id, db=db, allow_roles={"owner", "admin", "analyst"})

    category = payload.category
    if payload.scope == 3 and payload.spend_amount is not None:
        mapped, conf = _auto_map_spend_category(payload.category)
        category = mapped
        db.add(
            SpendCategory(
                raw_input_name=payload.category,
                mapped_standard_category=mapped,
                auto_mapped=True,
                confidence_score=int(conf),
            )
        )

    a = Activity(
        organization_id=org_id,
        facility_id=payload.facility_id,
        scope=int(payload.scope),
        category=category,
        activity_data_value=payload.activity_data_value,
        activity_data_unit=payload.activity_data_unit,
        spend_amount=payload.spend_amount,
        spend_currency=(payload.spend_currency.upper() if payload.spend_currency else None),
        data_quality_level=payload.data_quality_level,
        confidence_score=int(payload.confidence_score),
        input_metadata=(json.dumps(payload.input_metadata) if (payload.input_metadata and DATABASE_URL.startswith("sqlite")) else payload.input_metadata),
        created_by=user_id,
    )
    db.add(a)
    db.commit()
    return ActivityResponse(
        id=a.id,
        organization_id=a.organization_id,
        facility_id=a.facility_id,
        scope=a.scope,
        category=a.category,
        activity_data_value=a.activity_data_value,
        activity_data_unit=a.activity_data_unit,
        spend_amount=float(a.spend_amount) if a.spend_amount is not None else None,
        spend_currency=a.spend_currency,
        data_quality_level=a.data_quality_level,
        confidence_score=a.confidence_score,
    )


def resolve_emission_factor(*, db: Session, category: str, region: str, year: int) -> EmissionFactor:
    """
    Deterministic resolver:
    1) exact match (region, year, category)
    2) region fallback to GLOBAL (same year, category)
    3) year fallback to latest <= year (region, category)
    4) year fallback latest <= year (GLOBAL, category)
    """
    region = (region or "").upper().strip()
    category = category.strip()

    q = (
        select(EmissionFactor)
        .where(EmissionFactor.region == region, EmissionFactor.year == year, EmissionFactor.category == category)
        .order_by(EmissionFactor.id.asc())
    )
    ef = db.scalar(q)
    if ef:
        return ef

    ef = db.scalar(
        select(EmissionFactor)
        .where(EmissionFactor.region == "GLOBAL", EmissionFactor.year == year, EmissionFactor.category == category)
        .order_by(EmissionFactor.id.asc())
    )
    if ef:
        return ef

    ef = db.scalar(
        select(EmissionFactor)
        .where(EmissionFactor.region == region, EmissionFactor.year <= year, EmissionFactor.category == category)
        .order_by(EmissionFactor.year.desc(), EmissionFactor.id.asc())
    )
    if ef:
        return ef

    ef = db.scalar(
        select(EmissionFactor)
        .where(EmissionFactor.region == "GLOBAL", EmissionFactor.year <= year, EmissionFactor.category == category)
        .order_by(EmissionFactor.year.desc(), EmissionFactor.id.asc())
    )
    if ef:
        return ef

    raise HTTPException(status_code=404, detail="No emission factor found for category/region/year")


@app.post("/admin/emission-factors/import")
def import_emission_factors(
    items: list[EmissionFactorImportItem],
    user_id: int = Depends(require_user_id),
    db: Session = Depends(get_db),
):
    # MVP guardrail: only allow owners/admins of any org to import.
    is_privileged = db.scalar(select(func.count(Membership.id)).where(Membership.user_id == user_id, Membership.role.in_(["owner", "admin"])))
    if not is_privileged:
        raise HTTPException(status_code=403, detail="Not allowed")

    created = 0
    for it in items:
        # Deduplicate by (source, year, region, category, unit, version)
        existing = db.scalar(
            select(EmissionFactor).where(
                EmissionFactor.source == it.source,
                EmissionFactor.year == it.year,
                EmissionFactor.region == it.region.upper(),
                EmissionFactor.category == it.category,
                EmissionFactor.unit == it.unit,
                EmissionFactor.version == it.version,
            )
        )
        if existing:
            continue
        db.add(
            EmissionFactor(
                source=it.source,
                year=it.year,
                region=it.region.upper(),
                category=it.category,
                unit=it.unit,
                factor_value=float(it.factor_value),
                methodology_reference=it.methodology_reference,
                version=it.version,
            )
        )
        created += 1
    db.commit()
    return {"ok": True, "created": created, "received": len(items)}


@app.post("/emission-factors/resolve", response_model=EmissionFactorResolved)
def api_resolve_emission_factor(payload: EmissionFactorResolveRequest, user_id: int = Depends(require_user_id), db: Session = Depends(get_db)):
    # Resolver is org-agnostic in MVP; access requires auth.
    ef = resolve_emission_factor(db=db, category=payload.category, region=payload.region, year=payload.year)
    return EmissionFactorResolved(
        factor_id=ef.id,
        factor_value=float(ef.factor_value),
        source=ef.source,
        version=ef.version,
        unit=ef.unit,
    )


def _normalize_activity_value(activity: Activity) -> tuple[float, str]:
    """
    MVP normalization:
    - If activity_data_value/unit provided, use it as-is.
    - If spend-based, use spend_amount as A and a unit like "currency".
    """
    if activity.activity_data_value is not None and activity.activity_data_unit:
        return float(activity.activity_data_value), str(activity.activity_data_unit)
    if activity.spend_amount is not None and activity.spend_currency:
        return float(activity.spend_amount), f"{activity.spend_currency}"
    raise HTTPException(status_code=422, detail="Activity missing activity_data_value/unit or spend_amount/currency")


@app.get("/orgs/{org_id}/compliance/csrd", response_model=ComplianceStatusResponse)
def csrd_compliance(org_id: int, user_id: int = Depends(require_user_id), db: Session = Depends(get_db)):
    require_org_role(org_id, user_id=user_id, db=db, allow_roles={"owner", "admin", "analyst", "viewer", "auditor"})

    acts = db.execute(select(Activity).where(Activity.organization_id == org_id)).scalars().all()
    scopes_present = {int(a.scope) for a in acts}

    missing = []
    for req in CSRD_MVP_REQUIREMENTS:
        if not (req.required_scopes & scopes_present):
            missing.append(req.code)
            continue
        scoped = [a for a in acts if int(a.scope) in req.required_scopes]
        if not scoped:
            missing.append(req.code)
            continue
        for a in scoped:
            for f in req.required_fields:
                if getattr(a, f, None) is None:
                    missing.append(req.code)
                    break
            if req.code in missing:
                break

    total = len(CSRD_MVP_REQUIREMENTS)
    complete = total - len(set(missing))
    percent = int(round((complete / total) * 100)) if total else 100
    return ComplianceStatusResponse(framework="CSRD", percent_complete=percent, missing_requirements=sorted(set(missing)))


@app.get("/orgs/{org_id}/export/json")
def export_org_json(org_id: int, user_id: int = Depends(require_user_id), db: Session = Depends(get_db)):
    require_org_role(org_id, user_id=user_id, db=db, allow_roles={"owner", "admin", "analyst", "viewer", "auditor"})

    org = db.scalar(select(Organization).where(Organization.id == org_id))
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    acts = db.execute(select(Activity).where(Activity.organization_id == org_id).order_by(Activity.created_at.asc())).scalars().all()
    calcs = db.execute(select(Calculation).where(Calculation.organization_id == org_id).order_by(Calculation.created_at.asc())).scalars().all()
    trails = (
        db.execute(
            select(AuditTrail)
            .join(Calculation, AuditTrail.calculation_id == Calculation.id)
            .where(Calculation.organization_id == org_id)
            .order_by(AuditTrail.created_at.asc())
        )
        .scalars()
        .all()
    )

    def _maybe_json(v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return v
        return v

    return {
        "organization": {
            "id": org.id,
            "name": org.name,
            "country": org.country,
            "industry": org.industry,
            "baseline_year": org.baseline_year,
            "consolidation_method": org.consolidation_method,
        },
        "activities": [
            {
                "id": a.id,
                "scope": a.scope,
                "category": a.category,
                "activity_data_value": a.activity_data_value,
                "activity_data_unit": a.activity_data_unit,
                "spend_amount": float(a.spend_amount) if a.spend_amount is not None else None,
                "spend_currency": a.spend_currency,
                "data_quality_level": a.data_quality_level,
                "confidence_score": a.confidence_score,
                "input_metadata": _maybe_json(a.input_metadata),
                "created_at": a.created_at.isoformat(),
            }
            for a in acts
        ],
        "calculations": [
            {
                "id": c.id,
                "activity_id": c.activity_id,
                "factor_id": c.factor_id,
                "formula_used": c.formula_used,
                "factor_snapshot": _maybe_json(c.factor_snapshot),
                "result_value": c.result_value,
                "result_unit": c.result_unit,
                "created_at": c.created_at.isoformat(),
            }
            for c in calcs
        ],
        "audit_trails": [
            {
                "id": t.id,
                "calculation_id": t.calculation_id,
                "full_trace": _maybe_json(t.full_trace),
                "created_at": t.created_at.isoformat(),
            }
            for t in trails
        ],
    }


@app.get("/orgs/{org_id}/export/csv")
def export_org_csv(org_id: int, user_id: int = Depends(require_user_id), db: Session = Depends(get_db)):
    require_org_role(org_id, user_id=user_id, db=db, allow_roles={"owner", "admin", "analyst", "viewer", "auditor"})

    acts = db.execute(select(Activity).where(Activity.organization_id == org_id).order_by(Activity.created_at.asc())).scalars().all()

    lines = [
        "activity_id,scope,category,activity_data_value,activity_data_unit,spend_amount,spend_currency,data_quality_level,confidence_score,created_at"
    ]
    for a in acts:
        category_csv = a.category.replace('"', '""')
        lines.append(
            ",".join(
                [
                    str(a.id),
                    str(a.scope),
                    f"\"{category_csv}\"",
                    "" if a.activity_data_value is None else str(a.activity_data_value),
                    "" if a.activity_data_unit is None else str(a.activity_data_unit),
                    "" if a.spend_amount is None else str(float(a.spend_amount)),
                    "" if a.spend_currency is None else a.spend_currency,
                    a.data_quality_level,
                    str(a.confidence_score),
                    a.created_at.isoformat(),
                ]
            )
        )

    return {"filename": f"org_{org_id}_activities.csv", "content": "\n".join(lines)}


@app.post("/orgs/{org_id}/activities/{activity_id}/calculate", response_model=CalculationResponse)
def calculate_emissions_for_activity(
    org_id: int,
    activity_id: int,
    user_id: int = Depends(require_user_id),
    db: Session = Depends(get_db),
):
    require_org_role(org_id, user_id=user_id, db=db, allow_roles={"owner", "admin", "analyst", "auditor", "viewer"})

    activity = db.scalar(select(Activity).where(Activity.id == activity_id, Activity.organization_id == org_id))
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    # Determine region/year with fallbacks from org + activity metadata.
    org = db.scalar(select(Organization).where(Organization.id == org_id))
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    meta = activity.input_metadata
    if isinstance(meta, str):
        try:
            meta = json.loads(meta)
        except Exception:
            meta = {}
    meta = meta or {}

    region = str(meta.get("region") or org.country or "GLOBAL").upper()
    year = int(meta.get("year") or dt.datetime.now(dt.UTC).year)

    ef = resolve_emission_factor(db=db, category=activity.category, region=region, year=year)

    A_value, A_unit = _normalize_activity_value(activity)
    E_value = float(A_value) * float(ef.factor_value)
    result_unit = "kgCO2e"

    factor_snapshot = {
        "factor_id": ef.id,
        "source": ef.source,
        "version": ef.version,
        "year": ef.year,
        "region": ef.region,
        "category": ef.category,
        "unit": ef.unit,
        "factor_value": float(ef.factor_value),
        "methodology_reference": ef.methodology_reference,
    }
    full_trace = {
        "formula_used": "E = A × EF",
        "raw_input": {
            "activity_id": activity.id,
            "scope": activity.scope,
            "category_raw": (meta.get("raw_category") if isinstance(meta, dict) else None),
            "category": activity.category,
            "activity_data_value": activity.activity_data_value,
            "activity_data_unit": activity.activity_data_unit,
            "spend_amount": float(activity.spend_amount) if activity.spend_amount is not None else None,
            "spend_currency": activity.spend_currency,
            "input_metadata": meta,
        },
        "normalized_activity": {"A_value": float(A_value), "A_unit": A_unit},
        "factor": factor_snapshot,
        "result": {"E_value": float(E_value), "E_unit": result_unit},
        "performed_by": user_id,
        "timestamp": dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "data_quality": {"level": activity.data_quality_level, "confidence_score": int(activity.confidence_score)},
    }

    calc = Calculation(
        organization_id=org_id,
        activity_id=activity.id,
        factor_id=ef.id,
        factor_snapshot=(json.dumps(factor_snapshot) if DATABASE_URL.startswith("sqlite") else factor_snapshot),
        formula_used="E = A × EF",
        result_value=float(E_value),
        result_unit=result_unit,
        performed_by=user_id,
    )
    db.add(calc)
    db.flush()
    db.add(
        AuditTrail(
            calculation_id=calc.id,
            full_trace=(json.dumps(full_trace) if DATABASE_URL.startswith("sqlite") else full_trace),
        )
    )
    db.commit()

    return CalculationResponse(
        calculation_id=calc.id,
        activity_id=activity.id,
        factor_id=ef.id,
        result_value=float(E_value),
        result_unit=result_unit,
        data_quality_level=activity.data_quality_level,
        confidence_score=int(activity.confidence_score),
    )


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

    # Weight "break": if missing, apply conservative default to avoid understating emissions.
    default_weight_kg = 5.0
    if payload.weight_kg is None:
        weight_kg = float(default_weight_kg)
        weight_defaulted = True
    else:
        weight_kg = float(payload.weight_kg)
        weight_defaulted = False

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

    # Geocoding pillar: capture coordinates when possible (ZIP lookup for auditability).
    origin_lat = payload.origin_lat
    origin_lon = payload.origin_lon
    destination_lat = payload.destination_lat
    destination_lon = payload.destination_lon
    if (origin_lat is None or origin_lon is None) and payload.origin_zip:
        o = coords_for_zip(payload.origin_zip)
        if o:
            origin_lat, origin_lon = float(o[0]), float(o[1])
    if (destination_lat is None or destination_lon is None) and payload.destination_zip:
        d = coords_for_zip(payload.destination_zip)
        if d:
            destination_lat, destination_lon = float(d[0]), float(d[1])

    activity_tkm = (float(weight_kg) / 1000.0) * float(distance_km)

    v = (payload.vehicle_type or "truck").lower().strip()

    co2_ext = estimate_shipping_co2_kg(weight_kg=weight_kg, distance_km=distance_km, vehicle_type=payload.vehicle_type)
    if co2_ext is None:
        base_co2_kg, fallback_ef = fallback_co2_kg(
            weight_kg=weight_kg, distance_km=distance_km, vehicle_type=v,
        )
        source = "fallback"
    else:
        base_co2_kg = float(co2_ext)
        fallback_ef = None
        source = "carbon_interface"

    inferred_air = bool(float(distance_km) > 1000.0) or v in {"plane", "air"}
    radiative_forcing_multiplier = 1.9 if inferred_air else 1.0
    uncertainty_multiplier = 1.1 if float(distance_km) > 1000.0 else 1.0
    co2_kg = float(base_co2_kg) * float(radiative_forcing_multiplier) * float(uncertainty_multiplier)

    emission_factor_source = "DEFRA_2024_v1.2" if source == "fallback" else "CARBON_INTERFACE_live"
    emission_factor_used: float | None = None
    if source == "fallback":
        emission_factor_used = fallback_ef
    else:
        try:
            emission_factor_used = float(base_co2_kg) / float(activity_tkm) if float(activity_tkm) > 0 else None
        except Exception:
            emission_factor_used = None

    # --- Fee logic (Tasa 1 + Tasa 2) ---
    CARBON_PRICE_EUR_PER_TONNE = 25.0
    tasa_1_compensacion = round(co2_kg * (CARBON_PRICE_EUR_PER_TONNE / 1000.0), 4)

    # Tasa 2: scaled fixed fee for the merchant [0.50€ – 1.50€]
    # based on normalized weight/distance contribution.
    weight_factor = min(float(weight_kg) / 10.0, 1.0)
    distance_factor = min(float(distance_km) / 2000.0, 1.0)
    tasa_2_devolucion = round(0.50 + 1.00 * (0.5 * weight_factor + 0.5 * distance_factor), 2)

    total_tasa_cliente = round(tasa_1_compensacion + tasa_2_devolucion, 2)

    transport_mode = "truck_heavy"
    if v in {"train", "rail"}:
        transport_mode = "rail"
    elif v in {"ship", "sea", "ocean"}:
        transport_mode = "sea"
    elif inferred_air:
        transport_mode = "air"

    source_metadata = json.dumps(
        {
            "provider": "Carbon Interface" if source == "carbon_interface" else "DEFRA",
            "method": source,
            "emission_factor_source": emission_factor_source,
            "weight_defaulted": weight_defaulted,
            "weight_default_kg": default_weight_kg if weight_defaulted else None,
            "radiative_forcing_multiplier": radiative_forcing_multiplier,
            "uncertainty_multiplier": uncertainty_multiplier,
            "uncertainty_reason": "logistics_uncertainty_international" if uncertainty_multiplier > 1.0 else None,
        },
        separators=(",", ":"),
        ensure_ascii=False,
    )

    transaction_id = f"ECO-{uuid.uuid4().hex[:10].upper()}"
    timestamp = dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    audit_status = "verified"
    audit_log = {
        "transaction_id": transaction_id,
        "timestamp": timestamp,
        "input_data": {
            "origin": payload.origin_zip,
            "destination": payload.destination_zip,
            "weight_kg": float(weight_kg),
        },
        "calculation_logic": {
            "distance_km": float(distance_km),
            "transport_mode": transport_mode,
            "emission_factor_source": emission_factor_source,
            "emission_factor_value": float(emission_factor_used) if emission_factor_used is not None else None,
            "activity_tkm": float(activity_tkm),
            "radiative_forcing_multiplier": float(radiative_forcing_multiplier),
            "uncertainty_multiplier": float(uncertainty_multiplier),
            "formula": "E=A×EF",
            "weight_defaulted": bool(weight_defaulted),
        },
        "result_co2_kg": float(co2_kg),
        "audit_status": audit_status,
    }

    log = Log(
        store_id=store.id,
        transaction_id=transaction_id,
        origin_zip=payload.origin_zip,
        destination_zip=payload.destination_zip,
        origin_lat=origin_lat,
        origin_lon=origin_lon,
        destination_lat=destination_lat,
        destination_lon=destination_lon,
        weight_kg=weight_kg,
        distance_km=distance_km,
        activity_tkm=activity_tkm,
        vehicle_type=(payload.vehicle_type or "truck"),
        co2_kg=float(co2_kg),
        co2_source=source,
        emission_factor_used=emission_factor_used,
        emission_factor_source=emission_factor_source,
        source_metadata=source_metadata,
        radiative_forcing_multiplier=radiative_forcing_multiplier,
        uncertainty_multiplier=uncertainty_multiplier,
        audit_status=audit_status,
        audit_log=json.dumps(audit_log, separators=(",", ":"), ensure_ascii=False),
        is_offset_purchased=bool(payload.is_offset_purchased),
    )
    db.add(log)

    txn = Transaction(
        store_id=store.id,
        order_id=transaction_id,
        carbon_kg=float(co2_kg),
        tasa_1_compensacion=tasa_1_compensacion,
        tasa_2_devolucion=tasa_2_devolucion,
        status="confirmed" if bool(payload.is_offset_purchased) else "pending",
    )
    db.add(txn)
    db.commit()

    return CalculateResponse(
        co2_kg=float(co2_kg),
        distance_km=float(distance_km),
        source=source,
        tasa_1_eur=tasa_1_compensacion,
        tasa_2_eur=tasa_2_devolucion,
        total_tasa_cliente=total_tasa_cliente,
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

