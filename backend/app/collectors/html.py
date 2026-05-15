from __future__ import annotations

from datetime import datetime, timezone
from urllib.parse import urljoin

import aiohttp
from bs4 import BeautifulSoup

from app.collectors.base import BaseCollector
from app.models import SignalItem
from app.utils.text import fingerprint, normalize_text


class SiteHTMLCollector(BaseCollector):
    def __init__(
        self,
        source_name: str,
        url: str,
        *,
        link_prefixes: tuple[str, ...],
        limit: int = 30,
    ) -> None:
        super().__init__()
        self.source_name = source_name
        self.url = url
        self.link_prefixes = link_prefixes
        self.limit = limit

    async def collect(self, session: aiohttp.ClientSession) -> list[SignalItem]:
        html = await self.fetch_text(session, self.url)
        soup = BeautifulSoup(html, "html.parser")
        items: list[SignalItem] = []
        seen: set[str] = set()
        for link in soup.select("a[href]"):
            href = link.get("href", "")
            if not any(href.startswith(prefix) for prefix in self.link_prefixes):
                continue
            absolute_url = urljoin(self.url, href)
            if absolute_url in seen:
                continue
            title = normalize_text(link.get_text(" "))
            if len(title) < 12:
                continue
            seen.add(absolute_url)
            items.append(
                SignalItem(
                    source=self.source_name,
                    title=title,
                    url=absolute_url,
                    published_at=datetime.now(timezone.utc),
                    fingerprint=fingerprint(self.source_name, title, absolute_url),
                )
            )
            if len(items) >= self.limit:
                break
        return items

