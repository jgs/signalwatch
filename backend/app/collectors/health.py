from __future__ import annotations

from app.models import CollectorHealth


def classify_health(source: str, latency_ms: float, item_count: int, error: str | None = None) -> CollectorHealth:
    if error:
        return CollectorHealth(
            source=source,
            state="OFFLINE",
            latency_ms=round(latency_ms, 2),
            item_count=0,
            retry_count=1,
            failure_rate=1.0,
            message=f"{source} collector failed: {error[:96]}",
        )
    if latency_ms > 8500:
        state = "DELAYED"
        message = f"{source} source latency increased"
    elif item_count == 0:
        state = "DEGRADED"
        message = f"{source} collector returned no artifacts"
    elif latency_ms > 4500:
        state = "DEGRADED"
        message = f"{source} collector latency elevated"
    else:
        state = "HEALTHY"
        message = f"{source} collector synced"

    return CollectorHealth(
        source=source,
        state=state,
        latency_ms=round(latency_ms, 2),
        item_count=item_count,
        retry_count=0,
        failure_rate=0.0,
        message=message,
    )
