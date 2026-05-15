from __future__ import annotations

from collections import Counter, defaultdict

from app.models import SignalItem, Trend
from app.utils.text import keywords


def extract_keyword_counts(items: list[SignalItem]) -> Counter[str]:
    counts: Counter[str] = Counter()
    for item in items:
        for word, count in keywords(f"{item.title} {item.summary}", limit=12):
            counts[word] += count
    return counts


def detect_trends(
    current_items: list[SignalItem],
    baseline_counts: dict[str, float] | None = None,
    *,
    limit: int = 20,
) -> list[Trend]:
    baseline_counts = baseline_counts or {}
    current = extract_keyword_counts(current_items)
    sources_by_keyword: dict[str, set[str]] = defaultdict(set)
    for item in current_items:
        item_words = {word for word, _ in keywords(f"{item.title} {item.summary}", limit=12)}
        for word in item_words:
            sources_by_keyword[word].add(item.source)

    trends: list[Trend] = []
    for word, count in current.items():
        baseline = max(0.5, float(baseline_counts.get(word, 0.5)))
        source_count = len(sources_by_keyword[word])
        source_diversity = 1 + (source_count * 0.15)
        score = round((count / baseline) * source_diversity, 3)
        if count >= 2 or score >= 2.0:
            velocity = round(count * source_diversity, 2)
            acceleration = round(max(0.0, (count - baseline) / baseline) * (1 + source_count * 0.08), 2)
            confidence = round(min(0.98, 0.38 + min(score, 8.0) * 0.06 + source_count * 0.07), 3)
            semantic_drift = round(min(1.0, max(0.0, acceleration / 5.5)), 3)
            trends.append(
                Trend(
                    keyword=word,
                    score=score,
                    current_count=count,
                    baseline_count=baseline,
                    sources=sorted(sources_by_keyword[word]),
                    velocity=velocity,
                    acceleration=acceleration,
                    confidence=confidence,
                    semantic_drift=semantic_drift,
                )
            )
    return sorted(trends, key=lambda trend: trend.score, reverse=True)[:limit]
