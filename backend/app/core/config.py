from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Architecture Platform API"
    API_V1_PREFIX: str = "/api/v1"

    # Security
    SECRET_KEY: str = "change-me-in-production-please-use-a-long-random-string"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    ALGORITHM: str = "HS256"

    # Database
    DATABASE_URL: str = "postgresql://arch:arch@db:5432/arch_platform"

    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Media
    MEDIA_ROOT: str = "media"
    MEDIA_URL: str = "/media"
    MAX_UPLOAD_MB: int = 200

    # Email notifications (optional — no-ops cleanly when unset)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "no-reply@studio.com"
    SMTP_TLS: bool = True
    NOTIFY_EMAIL: str = ""  # where form submissions are sent (defaults to studio email)

    # Default seed admin
    FIRST_ADMIN_EMAIL: str = "admin@studio.com"
    FIRST_ADMIN_PASSWORD: str = "admin1234"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
