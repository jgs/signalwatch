from __future__ import annotations

import hashlib
from dataclasses import dataclass

from app.models import EventKind, Severity, SignalItem


@dataclass(frozen=True, slots=True)
class SignalClassification:
    event_type: EventKind
    severity: Severity
    primary_topic: str
    topics: list[str]
    confidence: float
    pressure: float
    drift: float
    latency_ms: float


KEYWORDS: dict[str, tuple[str, ...]] = {
    "alignment": ("alignment", "safety", "risk", "eval", "interpretability", "governance", "superalignment"),
    "agents": ("agent", "tool use", "autonomous", "planning", "workflow", "computer use"),
    "reasoning": ("reasoning", "chain-of-thought", "inference", "planning", "deliberation", "verification"),
    "multimodal": ("multimodal", "vision-language", "video", "audio", "image", "vlm"),
    "robotics": ("robot", "robotics", "embodied", "manipulation", "control"),
    "models": ("model", "release", "claude", "gpt", "o3", "o4", "api", "frontier"),
    "policy": ("policy", "system card", "preparedness", "responsible", "deployment", "terms"),
}


def classify_signal(item: SignalItem) -> SignalClassification:
    text = f"{item.title} {item.summary}".lower()
    topics = [topic for topic, terms in KEYWORDS.items() if any(term in text for term in terms)]
    if not topics:
        topics = ["capability"]

    primary = topics[0]
    event_type = _event_type(item.source, topics, text)
    pressure = _score_pressure(text, topics)
    drift = _score_drift(text, topics)
    confidence = min(0.97, 0.62 + len(topics) * 0.07 + pressure * 0.18)
    severity = _severity(event_type, pressure, drift)
    latency_ms = 120 + (_stable_unit(item.fingerprint or item.title) * 820)

    return SignalClassification(
        event_type=event_type,
        severity=severity,
        primary_topic=primary,
        topics=topics,
        confidence=round(confidence, 3),
        pressure=round(pressure, 3),
        drift=round(drift, 3),
        latency_ms=round(latency_ms, 2),
    )


def _event_type(source: str, topics: list[str], text: str) -> EventKind:
    if source in {"openai_policy_watcher", "anthropic_policy_watcher"}:
        if "policy" in topics or any(term in text for term in ("policy", "system card", "preparedness", "responsible")):
            return "policy.update"
        if "safety" in text or "alignment" in topics:
            return "safety.research"
        if "release" in text or "model" in topics:
            return "model.release"
        return "capability.signal"
    if source in {"alignment_forum_discourse", "lesswrong_alignment_discourse"}:
        return "alignment.alert" if "alignment" in topics else "signal.event"
    if "alignment" in topics and "safety" in text:
        return "safety.research"
    if any(topic in topics for topic in ("agents", "reasoning", "multimodal", "robotics")):
        return "capability.signal"
    return "signal.event"


def _score_pressure(text: str, topics: list[str]) -> float:
    base = 0.34 + min(0.28, len(topics) * 0.06)
    high_pressure_terms = ("frontier", "state-of-the-art", "agent", "reasoning", "multimodal", "benchmark", "scaling")
    return min(0.96, base + sum(0.055 for term in high_pressure_terms if term in text))


def _score_drift(text: str, topics: list[str]) -> float:
    base = 0.18 + (0.16 if "alignment" in topics else 0.0)
    drift_terms = ("risk", "governance", "deception", "misalignment", "autonomous", "eval", "safety")
    return min(0.91, base + sum(0.06 for term in drift_terms if term in text))


def _severity(event_type: EventKind, pressure: float, drift: float) -> Severity:
    if event_type == "alignment.alert" and drift >= 0.62:
        return "alert"
    if pressure >= 0.78 or drift >= 0.56:
        return "elevated"
    if pressure >= 0.58 or event_type in {"policy.update", "model.release", "safety.research"}:
        return "watch"
    return "trace"


def _stable_unit(value: str) -> float:
    digest = hashlib.sha256(value.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) / 0xFFFFFFFF
