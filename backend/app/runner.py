from __future__ import annotations

import asyncio
import time
from dataclasses import asdict

import aiohttp

from app.alerts.discord import alert_from_item, alert_from_trend, send_discord_alert
from app.collectors.health import classify_health
from app.collectors.registry import default_collectors
from app.config import settings
from app.ranking.clusters import detect_clusters, relationship_graph
from app.ranking.scoring import score_item
from app.ranking.topics import tag_item
from app.ranking.trends import detect_trends
from app.storage.factory import SignalStore, create_store
from app.utils.logging import get_logger

logger = get_logger(__name__)


async def collect_once(store: SignalStore | None = None) -> dict:
    store = store or create_store()
    store.init()
    headers = {"User-Agent": settings.user_agent}
    collectors = default_collectors()
    async with aiohttp.ClientSession(headers=headers) as session:
        results = await asyncio.gather(
            *(_collect_with_health(collector, session) for collector in collectors),
            return_exceptions=True,
        )
    items = []
    errors = []
    health = []
    for result in results:
        if isinstance(result, Exception):
            logger.warning("collector failed: %s", result)
            errors.append(str(result))
            continue
        collected_items, collector_health, error = result
        health.append(collector_health)
        if error:
            logger.warning("collector failed: %s", error)
            errors.append(error)
            continue
        items.extend(score_item(tag_item(item)) for item in collected_items)

    deduped = list({item.fingerprint: item for item in items}.values())
    inserted = store.upsert_items(deduped)
    trends = detect_trends(deduped)
    clusters = detect_clusters(deduped)
    graph = relationship_graph(deduped, clusters)
    alerts_sent = 0
    if settings.discord_webhook_url:
        high_signal_items = [item for item in deduped if item.importance >= settings.importance_alert_threshold]
        alerts = [alert_from_item(item) for item in high_signal_items[:5]]
        alerts.extend(alert_from_trend(trend) for trend in trends[:3] if trend.score >= 2.5)
        for alert in alerts:
            await send_discord_alert(settings.discord_webhook_url, alert)
            alerts_sent += 1
    return {
        "collected": len(items),
        "deduped": len(deduped),
        "inserted": inserted,
        "alerts_sent": alerts_sent,
        "errors": errors,
        "trends": [asdict(trend) for trend in trends],
        "clusters": [asdict(cluster) for cluster in clusters],
        "graph": graph,
        "collector_health": [asdict(entry) for entry in health],
    }


async def _collect_with_health(collector, session: aiohttp.ClientSession):
    started = time.perf_counter()
    source = getattr(collector, "source_name", collector.__class__.__name__)
    try:
        items = await collector.collect(session)
        latency_ms = (time.perf_counter() - started) * 1000
        return items, classify_health(source, latency_ms, len(items)), None
    except Exception as exc:  # pragma: no cover - network behavior varies by source.
        latency_ms = (time.perf_counter() - started) * 1000
        return [], classify_health(source, latency_ms, 0, str(exc)), str(exc)


if __name__ == "__main__":
    print(asyncio.run(collect_once()))
