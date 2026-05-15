from __future__ import annotations

import asyncio
import time
from collections import defaultdict


class HostRateLimiter:
    def __init__(self, minimum_interval_seconds: float = 1.0) -> None:
        self.minimum_interval_seconds = minimum_interval_seconds
        self._last_seen: dict[str, float] = defaultdict(float)
        self._lock = asyncio.Lock()

    async def wait(self, host: str) -> None:
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_seen[host]
            delay = max(0.0, self.minimum_interval_seconds - elapsed)
            if delay:
                await asyncio.sleep(delay)
            self._last_seen[host] = time.monotonic()

