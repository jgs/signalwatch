from __future__ import annotations

import re

from app.models import EventKind, OperationalEvent, SignalItem
from app.signals.classifier import classify_signal
from app.utils.text import concise_text, normalize_text


def normalize_signal_item(item: SignalItem) -> OperationalEvent:
    classification = classify_signal(item)
    return OperationalEvent(
        type=classification.event_type,
        severity=classification.severity,
        source=item.source,
        message=_operational_message(classification.event_type, item.source),
        timestamp=item.published_at,
        payload={
            "signal_id": item.fingerprint,
            "source": item.source,
            "source_name": item.source,
            "source_title": normalize_text(item.title),
            "source_url": item.url,
            "source_type": _source_type(classification.event_type, item),
            "published_at": item.published_at.isoformat(),
            "fetched_at": item.raw.get("fetched_at") if isinstance(item.raw, dict) else None,
            "title": normalize_text(item.title),
            "summary_vector": _compact_summary(item.summary),
            "authors": item.authors[:4],
            "categories": _categories(item),
            "tags": classification.topics[:6],
            "topics": classification.topics,
            "confidence": classification.confidence,
            "pressure": classification.pressure,
            "drift": classification.drift,
            "latency_ms": classification.latency_ms,
            "url": item.url,
            "evidence_links": [{"title": item.title, "url": item.url, "source": item.source}],
        },
    )


def _operational_message(event_type: EventKind, source: str) -> str:
    messages = {
        "model.release": f"{source} release item indexed",
        "policy.update": f"{source} policy item indexed",
        "safety.research": f"{source} safety item indexed",
        "capability.signal": f"{source} research item indexed",
        "semantic.cluster": f"{source} source-overlap item derived",
        "alignment.alert": f"{source} alignment item indexed",
        "trend.spike": f"{source} source-frequency item derived",
        "signal.event": f"{source} ecosystem item indexed",
    }
    return messages.get(event_type, f"{source} source item indexed")


def _compact_summary(summary: str) -> str:
    text = concise_text(summary, max_chars=320, max_sentences=2)
    return re.sub(r"\s+", " ", text).strip()


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


def _source_type(event_type: EventKind, item: SignalItem) -> str:
    if event_type == "model.release":
        return "release"
    if event_type == "policy.update":
        return "policy"
    if event_type == "safety.research":
        return "safety"
    if event_type == "capability.signal":
        return "research"
    if event_type == "alignment.alert":
        return "alignment-discourse"
    if item.source.startswith("arxiv"):
        return "paper"
    if "forum" in item.source or "lesswrong" in item.source:
        return "discussion"
    return "source-item"
