from __future__ import annotations

import asyncio
from datetime import UTC, datetime
from typing import Any

from fastapi import WebSocket

from app.models import OperationalEvent


class WebSocketHub:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()
        self.history: list[dict[str, Any]] = []
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self.connections.add(websocket)
            history = self.history[-50:]
        await websocket.send_json({"type": "snapshot", "timestamp": datetime.now(UTC).isoformat(), "events": history})

    def disconnect(self, websocket: WebSocket) -> None:
        self.connections.discard(websocket)

    async def broadcast(self, event: OperationalEvent) -> None:
        frame = event.model_dump(mode="json")
        async with self._lock:
            self.history.append(frame)
            self.history = self.history[-250:]
            connections = list(self.connections)

        stale: list[WebSocket] = []
        for connection in connections:
            try:
                await connection.send_json(frame)
            except Exception:
                stale.append(connection)

        for connection in stale:
            self.disconnect(connection)

    async def publish(self, event_type: str, payload: dict[str, Any]) -> None:
        event = {
            "type": event_type,
            "timestamp": datetime.now(UTC).isoformat(),
            "payload": payload,
        }
        self.history.append(event)
        self.history = self.history[-100:]
        stale: list[WebSocket] = []
        for connection in self.connections:
            try:
                await connection.send_json(event)
            except RuntimeError:
                stale.append(connection)
        for connection in stale:
            self.disconnect(connection)

    @property
    def client_count(self) -> int:
        return len(self.connections)


hub = WebSocketHub()
