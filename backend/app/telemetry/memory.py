from __future__ import annotations

import math
from collections import Counter, defaultdict, deque
from dataclasses import dataclass, field
from datetime import UTC, datetime

from app.models import OperationalEvent


@dataclass(slots=True)
class TopicMemory:
    topic: str
    observations: deque[tuple[datetime, float, str, str]] = field(default_factory=lambda: deque(maxlen=240))
    last_pressure: float = 0.0
    previous_pressure: float = 0.0


class SignalMemory:
    def __init__(self, half_life_minutes: float = 180.0) -> None:
        self.half_life_minutes = half_life_minutes
        self._topics: dict[str, TopicMemory] = {}

    def ingest(self, events: list[OperationalEvent]) -> None:
        now = datetime.now(UTC)
        for event in events:
            topics = event.payload.get("topics", [])
            if not isinstance(topics, list):
                continue
            pressure = float(event.payload.get("pressure", 0.0))
            for topic in topics:
                topic_name = str(topic)
                memory = self._topics.setdefault(topic_name, TopicMemory(topic=topic_name))
                memory.observations.append((now, pressure, event.source, event.id))

    def annotate(self, event: OperationalEvent) -> OperationalEvent:
        topics = event.payload.get("topics", [])
        topic = str(topics[0]) if isinstance(topics, list) and topics else "ecosystem"
        memory = self._topics.get(topic)
        if not memory:
            return event

        snapshot = self.snapshot(topic)
        event.payload["memory"] = snapshot
        return event

    def snapshot(self, topic: str) -> dict:
        memory = self._topics.setdefault(topic, TopicMemory(topic=topic))
        now = datetime.now(UTC)
        weighted_pressure = 0.0
        total_weight = 0.0
        sources: Counter[str] = Counter()
        event_ids: list[str] = []

        for observed_at, pressure, source, event_id in memory.observations:
            age_minutes = max(0.0, (now - observed_at).total_seconds() / 60)
            weight = 0.5 ** (age_minutes / self.half_life_minutes)
            weighted_pressure += pressure * weight
            total_weight += weight
            sources[source] += 1
            event_ids.append(event_id)

        pressure = weighted_pressure / total_weight if total_weight else 0.0
        acceleration = pressure - memory.last_pressure
        memory.previous_pressure = memory.last_pressure
        memory.last_pressure = pressure
        stability = min(1.0, total_weight / 8)
        confidence = min(0.98, 0.38 + stability * 0.32 + min(0.25, len(sources) * 0.05) + min(0.15, len(memory.observations) * 0.012))
        maturity = _maturity(stability, acceleration)

        return {
            "topic": topic,
            "pressure_accumulation": round(pressure, 3),
            "acceleration": round(acceleration, 3),
            "stability": round(stability, 3),
            "confidence": round(confidence, 3),
            "maturity": maturity,
            "half_life_minutes": self.half_life_minutes,
            "observation_count": len(memory.observations),
            "source_counts": dict(sources),
            "derived_from": event_ids[-12:],
        }

    def ecosystem_drift(self) -> dict:
        snapshots = [self.snapshot(topic) for topic in self._topics]
        topic_index = {snapshot["topic"]: snapshot for snapshot in snapshots}
        return {
            "capability_acceleration": _combined(topic_index, ["capability", "agents", "reasoning", "multimodal"]),
            "alignment_intensity": _combined(topic_index, ["alignment", "safety"]),
            "governance_pressure": _combined(topic_index, ["policy", "governance"]),
            "multimodal_saturation": _combined(topic_index, ["multimodal"]),
            "agentic_momentum": _combined(topic_index, ["agents", "reasoning"]),
        }


def _combined(snapshots: dict[str, dict], topics: list[str]) -> float:
    values = [float(snapshots[topic]["pressure_accumulation"]) for topic in topics if topic in snapshots]
    if not values:
        return 0.0
    return round(sum(values) / len(values), 3)


def _maturity(stability: float, acceleration: float) -> str:
    if stability < 0.25:
        return "weak signal"
    if acceleration > 0.08:
        return "accelerating"
    if stability > 0.72 and abs(acceleration) <= 0.05:
        return "persistent activity"
    if acceleration < -0.08:
        return "decaying"
    return "stabilizing"


signal_memory = SignalMemory()
