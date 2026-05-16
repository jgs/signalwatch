from datetime import UTC, datetime

from app.models import OperationalEvent
from app.telemetry.memory import SignalMemory
from app.telemetry.timeline import build_operational_timeline


def test_timeline_briefing_uses_memory_topics() -> None:
    memory = SignalMemory()
    memory.ingest(
        [
            OperationalEvent(
                type="capability.signal",
                source="arxiv_capability_stream",
                message="agentic reasoning indexed",
                timestamp=datetime.now(UTC),
                payload={"topics": ["agents", "reasoning"], "pressure": 0.72},
            ),
            OperationalEvent(
                type="safety.research",
                source="alignment_forum_discourse",
                message="agent risk discussion indexed",
                timestamp=datetime.now(UTC),
                payload={"topics": ["agents", "alignment"], "pressure": 0.68},
            ),
        ]
    )

    timeline = build_operational_timeline(memory)

    assert timeline["briefing"]["lines"]
    assert timeline["epochs"]
    assert timeline["epochs"][0]["observation_count"] >= 1
