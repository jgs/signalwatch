from __future__ import annotations

import asyncio

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.runner import collect_once
from app.utils.logging import configure_logging, get_logger

logger = get_logger(__name__)


async def scheduled_collection() -> None:
    result = await collect_once()
    logger.info("collection complete: %s", result)


def build_scheduler(interval_minutes: int = 60) -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(scheduled_collection, "interval", minutes=interval_minutes, id="signalwatch-collect")
    return scheduler


def run_forever() -> None:
    configure_logging()
    scheduler = build_scheduler()
    scheduler.start()
    asyncio.get_event_loop().run_forever()

