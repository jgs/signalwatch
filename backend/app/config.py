from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("SIGNALWATCH_DATABASE_URL", "sqlite:///./signalwatch.db")
    frontend_origin: str = os.getenv("SIGNALWATCH_FRONTEND_ORIGIN", "http://localhost:3000")
    discord_webhook_url: str | None = os.getenv("SIGNALWATCH_DISCORD_WEBHOOK_URL")
    request_timeout_seconds: int = int(os.getenv("SIGNALWATCH_REQUEST_TIMEOUT", "20"))
    rate_limit_per_host: float = float(os.getenv("SIGNALWATCH_RATE_LIMIT_PER_HOST", "1.0"))
    importance_alert_threshold: float = float(os.getenv("SIGNALWATCH_ALERT_THRESHOLD", "0.72"))
    user_agent: str = os.getenv(
        "SIGNALWATCH_USER_AGENT",
        "signalwatch/0.1 (+https://github.com/open-source/signalwatch)",
    )


settings = Settings()
