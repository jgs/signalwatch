from __future__ import annotations

import aiohttp

from app.models import Alert, SignalItem, Trend


def alert_from_item(item: SignalItem) -> Alert:
    return Alert(
        title=f"{item.source}: {item.title}",
        body=f"Importance {item.importance:.2f} | topics: {', '.join(item.topics)}",
        level="high" if item.importance >= 0.85 else "medium",
        url=item.url,
        metadata={"source": item.source, "topics": item.topics},
    )


def alert_from_trend(trend: Trend) -> Alert:
    return Alert(
        title=f"Emerging trend: {trend.keyword}",
        body=f"Trend score {trend.score:.2f}; count {trend.current_count}; sources: {', '.join(trend.sources)}",
        level="trend",
        metadata={"keyword": trend.keyword, "sources": trend.sources},
    )


async def send_discord_alert(webhook_url: str, alert: Alert) -> None:
    embed = {
        "title": alert.title,
        "description": alert.body,
        "url": alert.url,
        "color": 39168 if alert.level == "trend" else 8421504,
        "fields": [{"name": key, "value": str(value)[:1024]} for key, value in alert.metadata.items()],
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(webhook_url, json={"embeds": [embed]}) as response:
            response.raise_for_status()

