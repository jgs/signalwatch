from __future__ import annotations

import asyncio
import statistics
import time
from collections import deque
from datetime import UTC, datetime

from app.models import CollectorState, OperationalEvent, TelemetrySnapshot


class TelemetryState:
    def __init__(self) -> None:
        self.started_at = time.monotonic()
        self._events: deque[OperationalEvent] = deque(maxlen=200)
        self._signals: deque[OperationalEvent] = deque(maxlen=80)
        self._latencies: deque[float] = deque(maxlen=120)
        self._collectors: dict[str, CollectorState] = {}
        self._cluster_count = 4
        self._trend_pressure = 0.38
        self._alignment_drift = 0.21
        self._lock = asyncio.Lock()

    async def record(self, event: OperationalEvent) -> None:
        async with self._lock:
            self._events.appendleft(event)
            if event.type in {
                "signal.event",
                "model.release",
                "policy.update",
                "safety.research",
                "capability.signal",
                "semantic.cluster",
                "trend.spike",
                "alignment.alert",
            }:
                self._signals.appendleft(event)

            latency = event.payload.get("latency_ms")
            if isinstance(latency, int | float):
                self._latencies.append(float(latency))

            if event.type == "semantic.cluster":
                self._cluster_count = max(self._cluster_count, int(event.payload.get("cluster_count", self._cluster_count)))
            if event.type == "trend.spike":
                self._trend_pressure = min(1.0, max(0.0, float(event.payload.get("pressure", self._trend_pressure))))
            if event.type == "alignment.alert":
                self._alignment_drift = min(1.0, max(0.0, float(event.payload.get("drift", self._alignment_drift))))

    async def update_collector(self, collector: CollectorState) -> None:
        async with self._lock:
            self._collectors[collector.name] = collector
            self._latencies.append(collector.latency_ms)

    async def telemetry(self, active_clients: int) -> TelemetrySnapshot:
        async with self._lock:
            latencies = list(self._latencies) or [0.0]
            collectors = list(self._collectors.values())
            reliability = (
                sum(collector.reliability for collector in collectors) / len(collectors)
                if collectors
                else 1.0
            )
            degraded = any(collector.status in {"degraded", "offline"} for collector in collectors)
            p50 = statistics.median(latencies)
            p95 = sorted(latencies)[min(len(latencies) - 1, int(len(latencies) * 0.95))]
            uptime = time.monotonic() - self.started_at

            return TelemetrySnapshot(
                status="degraded" if degraded else "operational",
                uptime_seconds=round(uptime, 2),
                active_clients=active_clients,
                events_emitted=len(self._events),
                signal_velocity=round(len(self._signals) / max(uptime / 60, 1), 2),
                latency_p50_ms=round(p50, 2),
                latency_p95_ms=round(p95, 2),
                collector_reliability=round(reliability, 4),
                semantic_cluster_count=self._cluster_count,
                trend_pressure=round(self._trend_pressure, 3),
                alignment_drift=round(self._alignment_drift, 3),
                heartbeat=datetime.now(UTC).isoformat(),
            )

    async def signals(self, limit: int = 50) -> list[OperationalEvent]:
        async with self._lock:
            return list(self._signals)[:limit]

    async def collectors(self) -> list[CollectorState]:
        async with self._lock:
            return list(self._collectors.values())

    async def events(self, limit: int = 100) -> list[OperationalEvent]:
        async with self._lock:
            return list(self._events)[:limit]


telemetry_state = TelemetryState()
