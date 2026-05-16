from __future__ import annotations

from datetime import UTC, datetime

from app.telemetry.memory import SignalMemory, signal_memory


def build_operational_timeline(memory: SignalMemory = signal_memory) -> dict:
    now = datetime.now(UTC)
    topics = memory.topic_snapshots()
    drift = memory.ecosystem_drift()
    epochs = [_epoch_from_topic(topic) for topic in topics[:8]]
    return {
        "date": now.date().isoformat(),
        "generated_at": now.isoformat(),
        "briefing": _briefing(now, topics, drift),
        "epochs": epochs,
        "drift": drift,
    }


def _briefing(now: datetime, topics: list[dict], drift: dict) -> dict:
    lines: list[str] = []
    if not topics:
        lines.append("Operational memory is awaiting sufficient real ecosystem activity.")
    else:
        primary = topics[0]
        lines.append(
            f"{_label(primary['topic'])} activity is {primary['maturity']} with "
            f"{primary['observation_count']} real observations in memory."
        )
        for key, label in [
            ("agentic_momentum", "Agentic systems momentum"),
            ("alignment_intensity", "Alignment intensity"),
            ("governance_pressure", "Governance pressure"),
            ("multimodal_saturation", "Multimodal saturation"),
            ("capability_acceleration", "Capability acceleration"),
        ]:
            value = float(drift.get(key, 0.0))
            lines.append(f"{label} {_movement(value)} at {value:.2f} pressure.")

    return {
        "title": f"Operational Summary - {now.date().isoformat()}",
        "lines": lines[:6],
    }


def _epoch_from_topic(snapshot: dict) -> dict:
    acceleration = float(snapshot["acceleration"])
    if snapshot["maturity"] == "persistent activity":
        kind = "STABILITY WINDOW"
    elif acceleration > 0.08:
        kind = "ACTIVITY WAVE"
    elif acceleration < -0.08:
        kind = "PRESSURE DECAY"
    elif snapshot["pressure_accumulation"] >= 0.62:
        kind = "SIGNAL EPOCH"
    else:
        kind = "OBSERVATION WINDOW"

    return {
        "kind": kind,
        "topic": snapshot["topic"],
        "summary": _summary(snapshot),
        "pressure": snapshot["pressure_accumulation"],
        "confidence": snapshot["confidence"],
        "stability": snapshot["stability"],
        "acceleration": snapshot["acceleration"],
        "maturity": snapshot["maturity"],
        "observation_count": snapshot["observation_count"],
        "source_counts": snapshot["source_counts"],
    }


def _summary(snapshot: dict) -> str:
    topic = _label(snapshot["topic"])
    maturity = snapshot["maturity"]
    if maturity == "accelerating":
        return f"{topic} pressure is strengthening across the current memory window."
    if maturity == "decaying":
        return f"{topic} pressure is decaying after prior activity."
    if maturity == "persistent activity":
        return f"{topic} has stabilized into persistent ecosystem activity."
    if maturity == "stabilizing":
        return f"{topic} is stabilizing with continued source overlap."
    return f"{topic} remains a weak signal awaiting additional source confirmation."


def _movement(value: float) -> str:
    if value >= 0.66:
        return "strengthened"
    if value >= 0.42:
        return "remained stable"
    if value > 0:
        return "remained low"
    return "has insufficient signal"


def _label(topic: str) -> str:
    return topic.replace("_", " ").replace("-", " ").title()
