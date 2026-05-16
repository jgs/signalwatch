from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


Severity = Literal["trace", "watch", "elevated", "alert", "critical"]
EventKind = Literal[
    "signal.event",
    "model.release",
    "policy.update",
    "safety.research",
    "capability.signal",
    "telemetry.update",
    "collector.health",
    "source.latency",
    "semantic.cluster",
    "watcher.reconnect",
    "trend.spike",
    "alignment.alert",
    "system.heartbeat",
]


@dataclass(slots=True)
class SignalItem:
    source: str
    title: str
    url: str
    summary: str = ""
    authors: list[str] = field(default_factory=list)
    published_at: datetime = field(default_factory=lambda: datetime.now(UTC))
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


class OperationalEvent(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    type: EventKind
    severity: Severity = "trace"
    source: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    payload: dict[str, Any] = Field(default_factory=dict)


class CollectorState(BaseModel):
    name: str
    status: Literal["online", "degraded", "reconnecting", "offline"]
    latency_ms: float
    reliability: float
    last_event_at: datetime
    reconnects: int = 0
    indexed: int = 0


class TelemetrySnapshot(BaseModel):
    status: Literal["operational", "degraded"] = "operational"
    uptime_seconds: float
    active_clients: int
    events_emitted: int
    signal_velocity: float
    latency_p50_ms: float
    latency_p95_ms: float
    collector_reliability: float
    semantic_cluster_count: int
    trend_pressure: float
    alignment_drift: float
    heartbeat: str
