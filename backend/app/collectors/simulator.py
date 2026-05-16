from __future__ import annotations

import random
from datetime import UTC, datetime

from app.models import CollectorState


SOURCES = [
    "openai_policy_watcher",
    "anthropic_policy_watcher",
    "arxiv_capability_stream",
    "github_agentic_runtime_index",
    "huggingface_model_velocity",
    "alignment_forum_discourse",
    "lesswrong_alignment_discourse",
]

class CollectorSimulator:
    def __init__(self) -> None:
        self._reconnects: dict[str, int] = {source: 0 for source in SOURCES}
        self._indexed: dict[str, int] = {source: random.randint(120, 900) for source in SOURCES}

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
