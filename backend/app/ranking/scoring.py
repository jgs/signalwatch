from __future__ import annotations

from datetime import datetime, timezone

from app.models import SignalItem

SOURCE_WEIGHT = {
    "openai_blog": 0.96,
    "anthropic_blog": 0.94,
    "deepmind_updates": 0.92,
    "arxiv": 0.70,
    "alignment_forum": 0.82,
    "lesswrong_ai": 0.72,
    "github_trending_ai": 0.75,
    "huggingface_trending_models": 0.80,
}

HIGH_SIGNAL_TERMS = (
    "release",
    "frontier",
    "safety",
    "alignment",
    "benchmark",
    "state-of-the-art",
    "agent",
    "multimodal",
    "open weights",
    "reasoning",
    "eval",
)


def score_item(item: SignalItem) -> SignalItem:
    body = f"{item.title} {item.summary}".lower()
    source_score = SOURCE_WEIGHT.get(item.source, 0.5)
    term_score = min(0.22, 0.035 * sum(1 for term in HIGH_SIGNAL_TERMS if term in body))
    recency_score = _recency_score(item)
    topic_bonus = 0.06 if {"alignment", "models", "agents"} & set(item.topics) else 0.0
    item.importance = round(min(1.0, source_score * 0.58 + term_score + recency_score + topic_bonus), 3)
    return item


def _recency_score(item: SignalItem) -> float:
    now = datetime.now(timezone.utc)
    published = item.published_at if item.published_at.tzinfo else item.published_at.replace(tzinfo=timezone.utc)
    age_hours = max(0.0, (now - published).total_seconds() / 3600)
    if age_hours < 24:
        return 0.14
    if age_hours < 72:
        return 0.08
    return 0.02

