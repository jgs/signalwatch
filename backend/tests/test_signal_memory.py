from datetime import UTC, datetime

from app.models import OperationalEvent
from app.telemetry.memory import SignalMemory


def test_signal_memory_accumulates_confidence_and_provenance() -> None:
    memory = SignalMemory()
    events = [
        OperationalEvent(
            type="capability.signal",
            source="arxiv_capability_stream",
            message="agentic systems paper indexed",
            timestamp=datetime.now(UTC),
            payload={"topics": ["agents"], "pressure": 0.72},
        ),
        OperationalEvent(
            type="safety.research",
            source="alignment_forum_discourse",
            message="agent risk discussion indexed",
            timestamp=datetime.now(UTC),
            payload={"topics": ["agents", "alignment"], "pressure": 0.68},
        ),
    ]

    memory.ingest(events)
    snapshot = memory.snapshot("agents")

    assert snapshot["observation_count"] == 2
    assert snapshot["confidence"] > 0.45
    assert snapshot["source_counts"]["arxiv_capability_stream"] == 1
    assert snapshot["derived_from"]
