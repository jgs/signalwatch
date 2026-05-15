from __future__ import annotations

import random
from datetime import UTC, datetime

from app.models import CollectorState, OperationalEvent


SOURCES = [
    "openai_policy_watcher",
    "anthropic_policy_watcher",
    "arxiv_capability_stream",
    "github_agentic_runtime_index",
    "huggingface_model_velocity",
    "alignment_forum_discourse",
    "lesswrong_alignment_discourse",
]

MESSAGES = [
    ("semantic.cluster", "new semantic cluster detected", "semantic engine"),
    ("alignment.alert", "alignment drift increasing", "alignment discourse monitor"),
    ("signal.event", "anthropic policy update indexed", "anthropic_policy_watcher"),
    ("signal.event", "new capability paper classified", "arxiv_capability_stream"),
    ("watcher.reconnect", "collector reconnect successful", "collector mesh"),
    ("source.latency", "telemetry latency elevated", "source latency probe"),
    ("trend.spike", "capability discourse trend spike detected", "trend engine"),
    ("telemetry.update", "collector health matrix refreshed", "telemetry fabric"),
]


class CollectorSimulator:
    def __init__(self) -> None:
        self._reconnects: dict[str, int] = {source: 0 for source in SOURCES}
        self._indexed: dict[str, int] = {source: random.randint(120, 900) for source in SOURCES}
        self._cluster_count = 4

    def collector_states(self) -> list[CollectorState]:
        states: list[CollectorState] = []
        for source in SOURCES:
            latency = random.triangular(80, 920, 180)
            status_roll = random.random()
            status = "online"
            if status_roll > 0.96:
                status = "reconnecting"
                self._reconnects[source] += 1
            elif status_roll > 0.88:
                status = "degraded"

            self._indexed[source] += random.randint(0, 7)
            states.append(
                CollectorState(
                    name=source,
                    status=status,
                    latency_ms=round(latency, 2),
                    reliability=round(random.uniform(0.942, 0.999), 4),
                    last_event_at=datetime.now(UTC),
                    reconnects=self._reconnects[source],
                    indexed=self._indexed[source],
                )
            )
        return states

    def event(self) -> OperationalEvent:
        event_type, message, source = random.choice(MESSAGES)
        latency = round(random.triangular(70, 1200, 220), 2)
        drift = round(random.uniform(0.18, 0.78), 3)
        pressure = round(random.uniform(0.24, 0.91), 3)

        if event_type == "semantic.cluster":
            self._cluster_count += random.choice([0, 0, 1])

        severity = "trace"
        if event_type in {"semantic.cluster", "trend.spike"}:
            severity = "watch" if pressure < 0.7 else "elevated"
        if event_type == "alignment.alert":
            severity = "elevated" if drift < 0.68 else "alert"
        if event_type == "source.latency" and latency > 850:
            severity = "alert"

        return OperationalEvent(
            type=event_type,
            severity=severity,
            source=source,
            message=message,
            payload={
                "latency_ms": latency,
                "drift": drift,
                "pressure": pressure,
                "cluster_count": self._cluster_count,
                "source_overlap": random.randint(2, 6),
                "confidence": round(random.uniform(0.71, 0.97), 3),
            },
        )
