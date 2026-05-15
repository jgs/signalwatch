from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as operations_router
from app.services import operational_runtime
from app.websocket.manager import hub


DEFAULT_ALLOWED_ORIGINS = {
    "https://jgsops.dev",
    "https://www.jgsops.dev",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
}


def _allowed_origins() -> list[str]:
    configured = ",".join(
        value
        for value in [
            os.getenv("SIGNALWATCH_CORS_ORIGINS", ""),
            os.getenv("SIGNALWATCH_FRONTEND_ORIGIN", ""),
        ]
        if value
    )
    origins = {origin.strip().rstrip("/") for origin in configured.split(",") if origin.strip()}
    return sorted(DEFAULT_ALLOWED_ORIGINS | origins)


def _is_allowed_websocket_origin(origin: str | None) -> bool:
    if origin is None:
        return True
    normalized = origin.rstrip("/")
    if normalized in _allowed_origins():
        return True
    return normalized.startswith("http://localhost:") or normalized.startswith("http://127.0.0.1:")


@asynccontextmanager
async def lifespan(_: FastAPI):
    await operational_runtime.start()
    try:
        yield
    finally:
        await operational_runtime.stop()


app = FastAPI(
    title="SIGNALWATCH Backend",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(operations_router)


@app.websocket("/ws/events")
async def websocket_events(websocket: WebSocket) -> None:
    if not _is_allowed_websocket_origin(websocket.headers.get("origin")):
        await websocket.close(code=1008)
        return

    await hub.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        hub.disconnect(websocket)


@app.websocket("/ws")
async def websocket_legacy(websocket: WebSocket) -> None:
    await websocket_events(websocket)


@app.get("/")
async def root() -> dict[str, str]:
    return {"status": "operational", "service": "signalwatch-backend"}
