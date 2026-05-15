from __future__ import annotations

from datetime import datetime, timezone

from app.models import SignalItem
from app.ranking.scoring import score_item
from app.ranking.severity import severity_from_score, summarize_signal_dict
from app.ranking.topics import tag_item
from app.ranking.trends import detect_trends


def item(title: str, source: str = "arxiv") -> SignalItem:
    return SignalItem(source=source, title=title, url=f"https://example.test/{title}", published_at=datetime.now(timezone.utc))


def test_topic_tagging_marks_alignment_and_benchmarks() -> None:
    signal = tag_item(item("New alignment benchmark for agent safety evals"))
    assert "alignment" in signal.topics
    assert "benchmarks" in signal.topics


def test_importance_scoring_prefers_primary_release_sources() -> None:
    arxiv = score_item(tag_item(item("Reasoning model benchmark paper", "arxiv")))
    openai = score_item(tag_item(item("Reasoning model benchmark release", "openai_blog")))
    assert openai.importance > arxiv.importance


def test_trend_detection_uses_baseline_and_source_diversity() -> None:
    signals = [
        tag_item(item("Sparse mixture agent architecture", "arxiv")),
        tag_item(item("Sparse mixture model release", "huggingface_trending_models")),
        tag_item(item("Sparse mixture inference repo", "github_trending_ai")),
    ]
    trends = detect_trends(signals, {"sparse": 1, "mixture": 1})
    keywords = {trend.keyword: trend for trend in trends}
    assert keywords["sparse"].score > 2.0
    assert len(keywords["sparse"].sources) == 3


def test_severity_and_operational_summary() -> None:
    assert severity_from_score(0.95) == "CRITICAL"
    assert severity_from_score(0.86) == "ALERT"
    assert severity_from_score(0.75) == "WATCH"
    assert severity_from_score(0.4) == "TRACE"
    summary = summarize_signal_dict({"source": "arxiv", "topics": ["benchmarks"]})
    assert "Benchmark activity" in summary
