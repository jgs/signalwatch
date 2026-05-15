from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as operations_router
from app.services import operational_runtime
from app.websocket.manager import hub


def _allowed_origins() -> list[str]:
    configured = os.getenv("SIGNALWATCH_CORS_ORIGINS") or os.getenv("SIGNALWATCH_FRONTEND_ORIGIN", "")
    origins = [origin.strip() for origin in configured.split(",") if origin.strip()]
    return origins or ["http://localhost:3000", "http://127.0.0.1:3000"]


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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(operations_router)


@app.websocket("/ws/events")
async def websocket_events(websocket: WebSocket) -> None:
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
