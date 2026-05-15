from __future__ import annotations

import aiohttp

from app.collectors.base import BaseCollector
from app.models import SignalItem
from app.parsers.feed import parse_feed


class RSSCollector(BaseCollector):
    def __init__(self, source_name: str, feed_url: str, *, max_items: int = 50) -> None:
        super().__init__()
        self.source_name = source_name
        self.feed_url = feed_url
        self.max_items = max_items

    async def collect(self, session: aiohttp.ClientSession) -> list[SignalItem]:
        payload = await self.fetch_text(session, self.feed_url)
        return parse_feed(self.source_name, payload)[: self.max_items]
