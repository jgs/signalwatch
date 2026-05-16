from __future__ import annotations

import asyncio
import contextlib
import os

from app.collectors.simulator import CollectorSimulator
from app.models import OperationalEvent
from app.services.ingestion import ecosystem_ingestion
from app.telemetry import telemetry_state
from app.telemetry.memory import signal_memory
from app.websocket.manager import hub


class OperationalRuntime:
    def __init__(self) -> None:
        self.simulator = CollectorSimulator()
        self._tasks: set[asyncio.Task[None]] = set()
        self._running = False

    async def start(self) -> None:
        if self._running:
            return
        self._running = True
        self._tasks = {
            asyncio.create_task(self._collector_loop(), name="signalwatch:collector-loop"),
            asyncio.create_task(self._heartbeat_loop(), name="signalwatch:heartbeat-loop"),
            asyncio.create_task(self._ingestion_loop(), name="signalwatch:ecosystem-ingestion"),
        }

    async def stop(self) -> None:
        self._running = False
        for task in self._tasks:
            task.cancel()
        for task in self._tasks:
            with contextlib.suppress(asyncio.CancelledError):
                await task
        self._tasks.clear()

    async def emit(self, event: OperationalEvent) -> None:
        await telemetry_state.record(event)
        await hub.broadcast(event)

    async def _collector_loop(self) -> None:
        while self._running:
            for collector in self.simulator.collector_states():
                await telemetry_state.update_collector(collector)
                if collector.status in {"degraded", "reconnecting"}:
                    await self.emit(
                        OperationalEvent(
                            type="collector.health",
                            severity="elevated" if collector.status == "degraded" else "watch",
                            source=collector.name,
                            message=f"{collector.name} collector {collector.status}",
                            payload=collector.model_dump(mode="json"),
                        )
                    )
            await asyncio.sleep(6.0)

    async def _heartbeat_loop(self) -> None:
        while self._running:
            snapshot = await telemetry_state.telemetry(active_clients=hub.client_count)
            payload = snapshot.model_dump(mode="json")
            payload["ecosystem_drift"] = signal_memory.ecosystem_drift()
            await self.emit(
                OperationalEvent(
                    type="system.heartbeat",
                    severity="trace",
                    source="signalwatch-runtime",
                    message="operational heartbeat",
                    payload=payload,
                )
            )
            await asyncio.sleep(10.0)

    async def _ingestion_loop(self) -> None:
        await asyncio.sleep(float(os.getenv("SIGNALWATCH_INGESTION_INITIAL_DELAY_SECONDS", "5")))
        while self._running:
            events = await ecosystem_ingestion.collect_once()
            for event in events:
                await self.emit(event)
                await asyncio.sleep(0.35)
            await asyncio.sleep(ecosystem_ingestion.poll_interval_seconds)


operational_runtime = OperationalRuntime()
