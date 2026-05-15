from __future__ import annotations

from app.models import SignalItem, Trend

Severity = str


def severity_from_score(score: float) -> Severity:
    if score >= 0.92:
        return "CRITICAL"
    if score >= 0.84:
        return "ALERT"
    if score >= 0.72:
        return "WATCH"
    return "TRACE"


def summarize_signal_dict(signal: dict) -> str:
    topics = signal.get("topics") or ["general"]
    source = str(signal.get("source", "source")).replace("_", " ")
    primary = topics[0] if topics else "general"
    if "alignment" in topics:
        return f"Alignment-relevant signal surfaced from {source}; monitor for discourse acceleration."
    if "benchmarks" in topics:
        return f"Benchmark activity detected in {source}; possible evaluation cluster forming."
    if "models" in topics:
        return f"Model ecosystem movement detected in {source}; route to release watch."
    if "infrastructure" in topics:
        return f"Infrastructure signal normalized from {source}; track serving and systems implications."
    return f"{primary.title()} signal normalized from {source}; maintain low-latency watch."


def summarize_signal(item: SignalItem) -> str:
    return summarize_signal_dict(
        {
            "source": item.source,
            "topics": item.topics,
            "importance": item.importance,
            "title": item.title,
        }
    )


def summarize_trend(trend: Trend | dict) -> str:
    keyword = trend.keyword if isinstance(trend, Trend) else str(trend.get("keyword", "unknown"))
    sources = trend.sources if isinstance(trend, Trend) else trend.get("sources", [])
    acceleration = trend.acceleration if isinstance(trend, Trend) else float(trend.get("acceleration", 0.0) or 0.0)
    source_text = ", ".join(sources[:3]) if sources else "monitored sources"
    if acceleration >= 2.5:
        return f"{keyword.title()} acceleration detected across {source_text}; source overlap above baseline."
    return f"Emerging trend detected around {keyword}; corroborated across {source_text}."


def decorate_signal(signal: dict) -> dict:
    importance = float(signal.get("importance") or 0.0)
    return signal | {
        "severity": severity_from_score(importance),
        "briefing": summarize_signal_dict(signal),
    }
