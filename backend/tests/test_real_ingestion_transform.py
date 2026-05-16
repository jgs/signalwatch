from datetime import UTC, datetime

from app.models import SignalItem
from app.normalization import normalize_signal_item


def test_real_item_becomes_operational_signal() -> None:
    item = SignalItem(
        source="arxiv_capability_stream",
        title="Multimodal Agents for Long-Horizon Reasoning",
        url="https://arxiv.org/abs/0000.00000",
        summary="A benchmark for autonomous agent reasoning, multimodal tool use, and long-horizon planning.",
        authors=["Researcher One", "Researcher Two"],
        published_at=datetime.now(UTC),
        fingerprint="test-signal",
    )

    event = normalize_signal_item(item)

    assert event.type == "capability.signal"
    assert event.message != item.title
    assert event.payload["title"] == item.title
    assert "agents" in event.payload["topics"] or "reasoning" in event.payload["topics"]
    assert event.payload["pressure"] > 0.5
