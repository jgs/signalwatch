from __future__ import annotations

import asyncio
import os
import time
from collections import Counter, defaultdict
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
        if os.getenv("PYTEST_CURRENT_TEST"):
            return os.getenv("SIGNALWATCH_REAL_INGESTION_ENABLED", "false").lower() in {"1", "true", "yes"}
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

        events.extend(self.derived_aggregate_events(events))
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
            if len(events) >= 18:
                break
        return events

    def derived_aggregate_events(self, events: list[OperationalEvent]) -> list[OperationalEvent]:
        ecosystem_events = [
            event
            for event in events
            if event.type in {"signal.event", "model.release", "policy.update", "safety.research", "capability.signal", "alignment.alert"}
        ]
        if len(ecosystem_events) < 2:
            return []

        topic_counts: Counter[str] = Counter()
        topic_sources: dict[str, set[str]] = defaultdict(set)
        topic_pressure: dict[str, list[float]] = defaultdict(list)
        for event in ecosystem_events:
            topics = event.payload.get("topics", [])
            if not isinstance(topics, list):
                continue
            for topic in topics:
                topic_name = str(topic)
                topic_counts[topic_name] += 1
                topic_sources[topic_name].add(event.source)
                topic_pressure[topic_name].append(float(event.payload.get("pressure", 0.0)))

        derived: list[OperationalEvent] = []
        for topic, count in topic_counts.most_common(5):
            sources = topic_sources[topic]
            avg_pressure = sum(topic_pressure[topic]) / max(1, len(topic_pressure[topic]))
            confidence = min(0.97, 0.48 + count * 0.1 + len(sources) * 0.08 + avg_pressure * 0.18)

            if count >= 2:
                event_type = "alignment.alert" if topic in {"alignment", "policy"} else "semantic.cluster"
                message = _aggregate_message(topic, event_type, count, len(sources))
                derived.append(
                    OperationalEvent(
                        type=event_type,
                        severity="elevated" if confidence >= 0.78 else "watch",
                        source="semantic aggregation layer",
                        message=message,
                        payload={
                            "topics": [topic],
                            "pressure": round(avg_pressure, 3),
                            "confidence": round(confidence, 3),
                            "source_overlap": len(sources),
                            "cluster_count": count,
                            "derived_from": [event.id for event in ecosystem_events if topic in event.payload.get("topics", [])][:8],
                        },
                    )
                )

            if count >= 3 or len(sources) >= 2:
                derived.append(
                    OperationalEvent(
                        type="trend.spike",
                        severity="elevated" if confidence >= 0.82 else "watch",
                        source="ecosystem trend analyzer",
                        message=f"{topic} activity increasing across real source window",
                        payload={
                            "topics": [topic],
                            "pressure": round(avg_pressure, 3),
                            "confidence": round(confidence, 3),
                            "source_overlap": len(sources),
                            "cluster_count": count,
                            "derived_from": [event.id for event in ecosystem_events if topic in event.payload.get("topics", [])][:8],
                        },
                    )
                )

        return derived[:8]


def _aggregate_message(topic: str, event_type: str, count: int, source_count: int) -> str:
    if event_type == "alignment.alert":
        return f"{topic} activity elevated across {source_count} real sources"
    if topic in {"agents", "reasoning"}:
        return f"agentic reasoning activity increasing across {count} real signals"
    if topic == "multimodal":
        return f"multimodal systems cluster formed from {count} real signals"
    if topic == "models":
        return f"model release activity clustered across {source_count} sources"
    return f"{topic} research cluster derived from real ecosystem activity"


ecosystem_ingestion = EcosystemIngestionService()
