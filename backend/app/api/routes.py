from __future__ import annotations

from fastapi import APIRouter, Query

from app.safety import ALIGNMENT, JOB_DISPLACEMENT, LAB_DEMOS, RISK_FRAMEWORKS, SOURCES
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


@router.get("/safety/sources")
async def safety_sources() -> list[dict]:
    return [source.model_dump(mode="json") for source in SOURCES]


@router.get("/safety/risk-frameworks")
async def risk_frameworks() -> list[dict]:
    return [risk.model_dump(mode="json") for risk in RISK_FRAMEWORKS]


@router.get("/safety/job-displacement")
async def job_displacement() -> list[dict]:
    return [insight.model_dump(mode="json") for insight in JOB_DISPLACEMENT]


@router.get("/safety/alignment")
async def alignment() -> list[dict]:
    return [concept.model_dump(mode="json") for concept in ALIGNMENT]


@router.get("/labs/cv/status")
async def cv_status() -> dict:
    return {
        "status": "browser_model_available",
        "message": "Backend GPU inference is not required. SIGNALWATCH Labs runs lightweight COCO-SSD inference in the browser when model assets load.",
        "can_run_browser_transforms": True,
    }


@router.get("/labs/demos")
async def labs_demos() -> list[dict]:
    return [demo.model_dump(mode="json") for demo in LAB_DEMOS]
