from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass(slots=True)
class SignalItem:
    source: str
    title: str
    url: str
    summary: str = ""
    authors: list[str] = field(default_factory=list)
    published_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    raw: dict[str, Any] = field(default_factory=dict)
    topics: list[str] = field(default_factory=list)
    importance: float = 0.0
    fingerprint: str = ""


@dataclass(slots=True)
class Trend:
    keyword: str
    score: float
    current_count: int
    baseline_count: float
    sources: list[str] = field(default_factory=list)
    velocity: float = 0.0
    acceleration: float = 0.0
    confidence: float = 0.0
    semantic_drift: float = 0.0


@dataclass(slots=True)
class Alert:
    title: str
    body: str
    level: str = "info"
    url: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class TrendCluster:
    name: str
    score: float
    confidence: float
    velocity: float
    pressure: int
    acceleration: float = 0.0
    source_pressure: float = 0.0
    semantic_drift: float = 0.0
    source_overlap: int = 0
    sources: list[str] = field(default_factory=list)
    topics: list[str] = field(default_factory=list)
    keywords: list[str] = field(default_factory=list)
    summary: str = ""


@dataclass(slots=True)
class CollectorHealth:
    source: str
    state: str
    latency_ms: float
    item_count: int
    retry_count: int = 0
    failure_rate: float = 0.0
    message: str = ""
