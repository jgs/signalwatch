from __future__ import annotations

from datetime import datetime, timezone

import aiohttp
from bs4 import BeautifulSoup

from app.collectors.base import BaseCollector
from app.models import SignalItem
from app.utils.text import fingerprint, normalize_text


class HuggingFaceTrendingModelsCollector(BaseCollector):
    source_name = "huggingface_trending_models"
    url = "https://huggingface.co/models?sort=trending"

    async def collect(self, session: aiohttp.ClientSession) -> list[SignalItem]:
        html = await self.fetch_text(session, self.url)
        soup = BeautifulSoup(html, "html.parser")
        items: list[SignalItem] = []
        for link in soup.select("a[href^='/'][href*='/']")[:80]:
            path = link.get("href", "").strip("/")
            if path.count("/") != 1 or any(path.startswith(prefix) for prefix in ("docs/", "spaces/")):
                continue
            title = normalize_text(path)
            summary = normalize_text(link.get_text(" "))
            items.append(
                SignalItem(
                    source=self.source_name,
                    title=title,
                    url=f"https://huggingface.co/{path}",
                    summary=summary,
                    published_at=datetime.now(timezone.utc),
                    fingerprint=fingerprint(self.source_name, title, path),
                )
            )
        return list({item.fingerprint: item for item in items}.values())[:30]

