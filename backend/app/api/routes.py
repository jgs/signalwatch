from __future__ import annotations

from fastapi import APIRouter, Query

from app.telemetry import telemetry_state
from app.telemetry.timeline import build_operational_timeline
from app.websocket.manager import hub

router = APIRouter(prefix="/api", tags=["operations"])


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "operational", "service": "signalwatch-backend"}


@router.get("/telemetry")
async def telemetry() -> dict:
    snapshot = await telemetry_state.telemetry(active_clients=hub.client_count)
    return snapshot.model_dump(mode="json")


@router.get("/signals")
async def signals(limit: int = Query(default=50, ge=1, le=200)) -> list[dict]:
    events = await telemetry_state.signals(limit=limit)
    return [event.model_dump(mode="json") for event in events]


@router.get("/collectors")
async def collectors() -> list[dict]:
    states = await telemetry_state.collectors()
    return [collector.model_dump(mode="json") for collector in states]


@router.get("/timeline")
async def timeline() -> dict:
    return build_operational_timeline()
