from __future__ import annotations

from abc import ABC, abstractmethod
from urllib.parse import urlparse

import aiohttp

from app.config import settings
from app.models import SignalItem
from app.utils.rate_limit import HostRateLimiter
from app.utils.retry import retry_async


class BaseCollector(ABC):
    source_name: str

    def __init__(self, rate_limiter: HostRateLimiter | None = None) -> None:
        self.rate_limiter = rate_limiter or HostRateLimiter(settings.rate_limit_per_host)

    @abstractmethod
    async def collect(self, session: aiohttp.ClientSession) -> list[SignalItem]:
        """Collect and normalize source updates."""

    async def fetch_text(self, session: aiohttp.ClientSession, url: str) -> str:
        async def _fetch() -> str:
            host = urlparse(url).netloc
            await self.rate_limiter.wait(host)
            async with session.get(url, timeout=settings.request_timeout_seconds) as response:
                response.raise_for_status()
                return await response.text()

        return await retry_async(_fetch)

