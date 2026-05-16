from __future__ import annotations

import re

from app.models import EventKind, OperationalEvent, Severity, SignalItem
from app.signals.classifier import classify_signal


def normalize_signal_item(item: SignalItem) -> OperationalEvent:
    classification = classify_signal(item)
    return OperationalEvent(
        type=classification.event_type,
        severity=classification.severity,
        source=item.source,
        message=_operational_message(classification.event_type, classification.primary_topic),
        timestamp=item.published_at,
        payload={
            "signal_id": item.fingerprint,
            "source": item.source,
            "title": item.title,
            "summary_vector": _compact_summary(item.summary),
            "authors": item.authors[:4],
            "categories": _categories(item),
            "topics": classification.topics,
            "confidence": classification.confidence,
            "pressure": classification.pressure,
            "drift": classification.drift,
            "latency_ms": classification.latency_ms,
            "url": item.url,
        },
    )


def _operational_message(event_type: EventKind, topic: str) -> str:
    messages = {
        "model.release": "model release signal indexed",
        "policy.update": "policy update indexed",
        "safety.research": "safety research signal classified",
        "capability.signal": f"{topic} capability signal indexed",
        "semantic.cluster": f"new {topic} semantic cluster detected",
        "alignment.alert": "alignment discourse divergence increasing",
        "trend.spike": f"{topic} research velocity increasing",
        "signal.event": f"{topic} ecosystem signal indexed",
    }
    return messages.get(event_type, f"{topic} operational signal indexed")


def _compact_summary(summary: str) -> str:
    text = re.sub(r"\s+", " ", summary).strip()
    return text[:420]


def _categories(item: SignalItem) -> list[str]:
    raw_tags = item.raw.get("tags") if isinstance(item.raw, dict) else None
    if not isinstance(raw_tags, list):
        return item.topics
    categories: list[str] = []
    for tag in raw_tags:
        term = tag.get("term") if isinstance(tag, dict) else getattr(tag, "term", None)
        if term:
            categories.append(str(term))
    return categories[:8]
