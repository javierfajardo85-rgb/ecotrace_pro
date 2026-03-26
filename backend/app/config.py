from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite:///./ecotrace.db"
    carbon_interface_api_key: str | None = None

    jwt_secret: str = "change-me-in-dev"
    jwt_alg: str = "HS256"

    cors_allow_origins: list[str] = ["*"]

    rate_limit_window_seconds: int = 60
    rate_limit_max_requests: int = 120


settings = Settings()

