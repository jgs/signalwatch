from __future__ import annotations

import asyncio
import random
from collections.abc import Awaitable, Callable
from typing import TypeVar

T = TypeVar("T")


async def retry_async(
    fn: Callable[[], Awaitable[T]],
    *,
    attempts: int = 3,
    base_delay: float = 0.5,
    max_delay: float = 8.0,
) -> T:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            return await fn()
        except Exception as exc:  # pragma: no cover - caller decides what is retryable.
            last_error = exc
            if attempt == attempts - 1:
                break
            delay = min(max_delay, base_delay * (2**attempt)) + random.uniform(0, 0.2)
            await asyncio.sleep(delay)
    assert last_error is not None
    raise last_error

