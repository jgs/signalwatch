from datetime import UTC, datetime

from app.models import SignalItem
from app.normalization import normalize_signal_item
from app.services.ingestion import EcosystemIngestionService


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


def test_signal_summary_is_clean_and_concise() -> None:
    item = SignalItem(
        source="alignment_forum_discourse",
        title="<b>Alignment Eval Update</b>",
        url="https://www.alignmentforum.org/posts/test",
        summary="<p>Alignment evaluation update with <a href='https://example.com'>inline links</a>.</p><p>Alignment evaluation update with inline links.</p><script>noise()</script>",
        published_at=datetime.now(UTC),
        fingerprint="clean-summary",
    )

    event = normalize_signal_item(item)

    assert "<" not in event.payload["title"]
    assert "<" not in event.payload["summary_vector"]
    assert "script" not in event.payload["summary_vector"].lower()
    assert len(event.payload["summary_vector"]) <= 340


def test_aggregate_signal_requires_real_event_window() -> None:
    service = EcosystemIngestionService()
    first = normalize_signal_item(
        SignalItem(
            source="arxiv_capability_stream",
            title="Agentic Reasoning for Long-Horizon Tool Use",
            url="https://arxiv.org/abs/0000.00001",
            summary="Autonomous agent reasoning and planning benchmark.",
            published_at=datetime.now(UTC),
            fingerprint="aggregate-one",
        )
    )
    second = normalize_signal_item(
        SignalItem(
            source="alignment_forum_discourse",
            title="Reasoning Evals for Agentic Systems",
            url="https://www.alignmentforum.org/posts/test",
            summary="Discussion of agent risk, reasoning evals, and governance.",
            published_at=datetime.now(UTC),
            fingerprint="aggregate-two",
        )
    )

    assert service.derived_aggregate_events([first]) == []
    derived = service.derived_aggregate_events([first, second])

    assert derived
    assert all(event.payload.get("derived_from") for event in derived)
    assert all(event.payload.get("provenance") for event in derived)
    assert any(event.type in {"semantic.cluster", "trend.spike", "alignment.alert"} for event in derived)
