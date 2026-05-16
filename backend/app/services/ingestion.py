from __future__ import annotations

import asyncio
import os
import time
from datetime import UTC, datetime

import aiohttp

from app.collectors.alignment import AlignmentForumMonitor, LessWrongMonitor
from app.collectors.anthropic import AnthropicMonitor, OpenAIMonitor
from app.collectors.arxiv import ArxivAICollector
from app.models import CollectorState, OperationalEvent, SignalItem
from app.normalization import normalize_signal_item
from app.telemetry import telemetry_state


class EcosystemIngestionService:
    def __init__(self) -> None:
        self.collectors = [
            ArxivAICollector(),
            AnthropicMonitor(),
            OpenAIMonitor(),
            AlignmentForumMonitor(),
            LessWrongMonitor(),
        ]
        self._seen: set[str] = set()
        self._reconnects: dict[str, int] = {}

    @property
    def enabled(self) -> bool:
        return os.getenv("SIGNALWATCH_REAL_INGESTION_ENABLED", "true").lower() not in {"0", "false", "no"}

    @property
    def poll_interval_seconds(self) -> float:
        return float(os.getenv("SIGNALWATCH_INGESTION_INTERVAL_SECONDS", "300"))

    async def collect_once(self) -> list[OperationalEvent]:
        if not self.enabled:
            return []

        timeout = aiohttp.ClientTimeout(total=float(os.getenv("SIGNALWATCH_INGESTION_TIMEOUT_SECONDS", "24")))
        events: list[OperationalEvent] = []
        async with aiohttp.ClientSession(timeout=timeout, headers={"User-Agent": "signalwatch/0.2 operational-ingestion"}) as session:
            results = await asyncio.gather(
                *(self._collect_source(collector, session) for collector in self.collectors),
                return_exceptions=True,
            )

        for result in results:
            if isinstance(result, Exception):
                continue
            events.extend(result)

        return events

    async def _collect_source(self, collector, session: aiohttp.ClientSession) -> list[OperationalEvent]:
        source = collector.source_name
        started = time.perf_counter()
        try:
            items = await collector.collect(session)
            latency_ms = (time.perf_counter() - started) * 1000
            await telemetry_state.update_collector(
                CollectorState(
                    name=source,
                    status="online",
                    latency_ms=round(latency_ms, 2),
                    reliability=0.992,
                    last_event_at=datetime.now(UTC),
                    reconnects=self._reconnects.get(source, 0),
                    indexed=len(items),
                )
            )
            return self._events_from_items(items, latency_ms)
        except Exception as exc:
            self._reconnects[source] = self._reconnects.get(source, 0) + 1
            await telemetry_state.update_collector(
                CollectorState(
                    name=source,
                    status="degraded",
                    latency_ms=0,
                    reliability=0.74,
                    last_event_at=datetime.now(UTC),
                    reconnects=self._reconnects[source],
                    indexed=0,
                )
            )
            return [
                OperationalEvent(
                    type="collector.health",
                    severity="watch",
                    source=source,
                    message=f"{source} ingestion degraded",
                    payload={
                        "name": source,
                        "status": "degraded",
                        "reconnects": self._reconnects[source],
                        "error": type(exc).__name__,
                    },
                )
            ]

    def _events_from_items(self, items: list[SignalItem], latency_ms: float) -> list[OperationalEvent]:
        events: list[OperationalEvent] = []
        for item in items:
            if not item.fingerprint or item.fingerprint in self._seen:
                continue
            self._seen.add(item.fingerprint)
            event = normalize_signal_item(item)
            event.payload["collector_latency_ms"] = round(latency_ms, 2)
            events.append(event)
            derived = self._derived_events(event)
            events.extend(derived)
            if len(events) >= 18:
                break
        return events

    def _derived_events(self, event: OperationalEvent) -> list[OperationalEvent]:
        pressure = float(event.payload.get("pressure", 0.0))
        topics = event.payload.get("topics", [])
        topic = str(topics[0]) if isinstance(topics, list) and topics else "ecosystem"
        derived: list[OperationalEvent] = []

        if event.type in {"capability.signal", "safety.research"} and pressure >= 0.62:
            derived.append(
                OperationalEvent(
                    type="semantic.cluster",
                    severity="watch" if pressure < 0.78 else "elevated",
                    source="semantic ingestion layer",
                    message=f"new {topic} semantic cluster detected",
                    payload={
                        "topics": topics,
                        "pressure": pressure,
                        "confidence": event.payload.get("confidence", 0.82),
                        "source_overlap": 2,
                        "cluster_count": 1,
                        "origin_signal": event.id,
                    },
                )
            )

        if pressure >= 0.74:
            derived.append(
                OperationalEvent(
                    type="trend.spike",
                    severity="elevated",
                    source="ecosystem velocity monitor",
                    message=f"{topic} research velocity increasing",
                    payload={
                        "topics": topics,
                        "pressure": pressure,
                        "confidence": event.payload.get("confidence", 0.84),
                        "origin_signal": event.id,
                    },
                )
            )

        return derived


ecosystem_ingestion = EcosystemIngestionService()
