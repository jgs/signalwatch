from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import WebSocket


class WebSocketHub:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()
        self.history: list[dict[str, Any]] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.add(websocket)
        await websocket.send_json({"type": "snapshot", "events": self.history[-25:]})

    def disconnect(self, websocket: WebSocket) -> None:
        self.connections.discard(websocket)

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
