import json
from typing import Any

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from .core.config import CARBON_PRICE_EUR_PER_TONNE


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite:///./ecotrace.db"
    carbon_interface_api_key: str | None = None

    jwt_secret: str = "change-me-in-dev"
    jwt_alg: str = "HS256"

    cors_allow_origins: list[str] = ["*"]

    rate_limit_window_seconds: int = 60
    rate_limit_max_requests: int = 120

    # --- Carbon engine (tunable; document changes in audit) ---
    carbon_price_eur_per_tonne: float = Field(default=CARBON_PRICE_EUR_PER_TONNE)
    load_factor: float = 0.75
    longhaul_km_threshold: float = 1000.0
    radiative_forcing_air_multiplier: float = 1.9
    uncertainty_longhaul_multiplier: float = 1.1

    returns_logistics_multiplier: float = 2.0
    returns_dilution_factor: float = 0.9

    ecotrace_fee_fixed_eur: float = 0.12
    ecotrace_fee_pct_on_compensation: float = 0.05
    ecotrace_fee_min_eur: float = 0.02

    # Merge into DEFAULT_RETURN_RATES (JSON object, e.g. {"books":0.11})
    ecotrace_return_rates_json: str = ""

    # --- Monthly reconciliation cron (APScheduler + optional HTTP trigger) ---
    reconciliation_scheduler_enabled: bool = False
    reconciliation_cron_day: int = 2  # day of month (1–28)
    reconciliation_cron_hour: int = 3
    reconciliation_cron_minute: int = 0
    # Shared secret for POST /internal/cron/monthly-reconciliation (GitHub Actions, etc.)
    cron_secret: str = ""

    # --- Notificaciones post-reconciliación (email opcional; siempre se registra en log) ---
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    notification_email_from: str | None = None

    @property
    def return_rates_extra(self) -> dict[str, float]:
        raw = (self.ecotrace_return_rates_json or "").strip()
        if not raw:
            return {}
        try:
            data: Any = json.loads(raw)
            if not isinstance(data, dict):
                return {}
            out: dict[str, float] = {}
            for k, v in data.items():
                out[str(k).lower().strip()] = float(v)
            return out
        except (json.JSONDecodeError, TypeError, ValueError):
            return {}


settings = Settings()
