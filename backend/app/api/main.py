from __future__ import annotations

import asyncio
from itertools import cycle

from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings
from app.ranking.severity import decorate_signal, severity_from_score, summarize_trend
from app.runner import collect_once
from app.storage.factory import create_store
from app.websocket.manager import hub

app = FastAPI(title="signalwatch", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
store = create_store()
store.init()
latest_operational_state: dict = {
    "collector_health": [],
    "clusters": [],
    "graph": {"nodes": [], "edges": []},
    "telemetry": {},
}
_pulse_sources = cycle(
    [
        "arxiv",
        "alignment_forum",
        "lesswrong_ai",
        "openai_blog",
        "anthropic_blog",
        "github_trending_ai",
        "huggingface_trending_models",
    ]
)
_pulse_events = cycle(
    [
        ("collector.synced", "collector", "TRACE", "{source} collector heartbeat acknowledged"),
        ("websocket.activity", "system", "TRACE", "websocket bus emitted operational telemetry frame"),
        ("source.sync", "collector", "TRACE", "{source} source sync completed"),
        ("source.latency", "collector", "WATCH", "{source} source latency sample updated"),
    ]
)


class FeedRequest(BaseModel):
    name: str
    source_filter: str | None = None
    topic_filter: str | None = None
    min_importance: float = 0.0


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "signalwatch", "websocket_clients": hub.client_count}


@app.get("/signals")
def signals(
    limit: int = Query(100, le=500),
    topic: str | None = None,
    source: str | None = None,
) -> list[dict]:
    return [decorate_signal(signal) for signal in store.list_items(limit=limit, topic=topic, source=source)]


@app.post("/collect")
async def collect() -> dict:
    global latest_operational_state
    result = await collect_once(store)
    latest_operational_state = {
        "collector_health": result.get("collector_health", []),
        "clusters": result.get("clusters", []),
        "graph": result.get("graph", {"nodes": [], "edges": []}),
        "telemetry": _telemetry_from_result(result),
    }
    recent = [decorate_signal(signal) for signal in store.list_items(limit=12)]
    for health in latest_operational_state["collector_health"]:
        state = health.get("state", "HEALTHY")
        await hub.publish(
            "collector.synced" if state == "HEALTHY" else "collector.degraded",
            {
                "category": "collector",
                "severity": _severity_from_health(state),
                "source": health.get("source"),
                "message": health.get("message"),
                "health": health,
                "websocket_clients": hub.client_count,
            },
        )
    await hub.publish(
        "collection.completed",
        {
            "category": "collector",
            "severity": "TRACE",
            "source": "collector mesh",
            "message": f"{result['inserted']} new signals inserted; {result['deduped']} artifacts normalized",
            "result": result,
            "signals": recent,
            "telemetry": latest_operational_state["telemetry"],
            "websocket_clients": hub.client_count,
        },
    )
    for signal in recent[:8]:
        await hub.publish(
            "normalization.completed",
            {
                "category": "normalization",
                "severity": "TRACE",
                "source": signal["source"],
                "message": f"{signal['source']} artifact normalized and deduplicated",
                "signal": signal,
            },
        )
        await hub.publish(
            "signal.scored",
            {
                "category": "signal",
                "severity": signal["severity"],
                "source": signal["source"],
                "message": signal["briefing"],
                "signal": signal,
            },
        )
    for trend in result.get("trends", [])[:5]:
        score = float(trend.get("score", 0.0))
        await hub.publish(
            "source.overlap",
            trend
            | {
                "category": "derived",
                "severity": severity_from_score(min(1.0, score / 100)),
                "message": summarize_trend(trend),
                "derived_reason": "computed from real source frequency and topic overlap",
            },
        )
    await hub.publish(
        "relationship.graph.updated",
        {
            "category": "graph",
            "severity": "TRACE",
            "source": "relationship graph",
            "message": f"{len(latest_operational_state['graph'].get('nodes', []))} nodes linked across signal graph",
            "graph": latest_operational_state["graph"],
        },
    )
    return result


@app.get("/activity")
def activity() -> list[dict]:
    return hub.history[-50:]


@app.get("/collector-health")
def collector_health() -> list[dict]:
    return latest_operational_state["collector_health"]


@app.get("/clusters")
def clusters() -> list[dict]:
    return latest_operational_state["clusters"]


@app.get("/graph")
def graph() -> dict:
    return latest_operational_state["graph"]


@app.get("/feeds")
def feeds() -> list[dict]:
    return store.list_feeds()


@app.post("/feeds")
def save_feed(feed: FeedRequest) -> dict:
    store.save_feed(feed.name, feed.source_filter, feed.topic_filter, feed.min_importance)
    return {"status": "saved", "feed": feed.name}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await hub.connect(websocket)
    pulse = asyncio.create_task(_operational_pulse())
    await hub.publish(
        "client.connected",
        {
            "category": "system",
            "severity": "TRACE",
            "source": "websocket",
            "message": f"client attached; {hub.client_count} realtime clients active",
            "websocket_clients": hub.client_count,
        },
    )
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        hub.disconnect(websocket)
    finally:
        pulse.cancel()
        try:
            await pulse
        except asyncio.CancelledError:
            pass


def _severity_from_health(state: str) -> str:
    if state == "OFFLINE":
        return "CRITICAL"
    if state in {"DEGRADED", "DELAYED"}:
        return "ALERT"
    return "TRACE"


async def _operational_pulse() -> None:
    while hub.client_count > 0:
        await asyncio.sleep(3.8)
        event_type, category, severity, template = next(_pulse_events)
        source = next(_pulse_sources)
        clusters = latest_operational_state.get("clusters", [])
        health = latest_operational_state.get("collector_health", [])
        payload = {
            "category": category,
            "severity": severity,
            "source": source if category != "system" else "websocket",
            "message": template.format(source=source.replace("_", " ")),
            "websocket_clients": hub.client_count,
            "telemetry": _rolling_telemetry(health, clusters),
        }
        await hub.publish(event_type, payload)


def _telemetry_from_result(result: dict) -> dict:
    health = result.get("collector_health", [])
    clusters = result.get("clusters", [])
    return _rolling_telemetry(health, clusters) | {
        "collected": result.get("collected", 0),
        "deduped": result.get("deduped", 0),
        "inserted": result.get("inserted", 0),
        "retry_count": sum(int(entry.get("retry_count", 0)) for entry in health),
        "active_trend_count": len(result.get("trends", [])),
        "semantic_cluster_count": len(clusters),
    }


def _rolling_telemetry(health: list[dict], clusters: list[dict]) -> dict:
    latency_values = [float(entry.get("latency_ms", 0)) for entry in health] or [0.0]
    failure_values = [float(entry.get("failure_rate", 0)) for entry in health] or [0.0]
    item_count = sum(int(entry.get("item_count", 0)) for entry in health)
    degraded = sum(1 for entry in health if entry.get("state") != "HEALTHY")
    return {
        "collector_uptime": round(max(0.0, 1 - degraded / max(1, len(health))), 3),
        "collector_latency_p50": round(sorted(latency_values)[len(latency_values) // 2], 2),
        "source_reliability": round(max(0.0, 1 - sum(failure_values) / max(1, len(failure_values))), 3),
        "signal_velocity": round(max(0.1, item_count / 12), 2),
        "normalization_pressure": round(min(1.0, item_count / 140), 3),
        "semantic_cluster_count": len(clusters),
        "active_trend_count": len(clusters),
    }
