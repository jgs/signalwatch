from __future__ import annotations

from datetime import datetime, timezone

import aiohttp
from bs4 import BeautifulSoup

from app.collectors.base import BaseCollector
from app.models import SignalItem
from app.utils.text import fingerprint, normalize_text


class GitHubTrendingAICollector(BaseCollector):
    source_name = "github_trending_ai"
    url = "https://github.com/trending/python?since=daily"

    async def collect(self, session: aiohttp.ClientSession) -> list[SignalItem]:
        html = await self.fetch_text(session, self.url)
        soup = BeautifulSoup(html, "html.parser")
        items: list[SignalItem] = []
        for article in soup.select("article.Box-row")[:25]:
            title_node = article.select_one("h2 a")
            if not title_node:
                continue
            repo_path = normalize_text(title_node.get_text(" ")).replace(" ", "")
            url = f"https://github.com{title_node.get('href', '')}"
            description = normalize_text(article.select_one("p").get_text(" ") if article.select_one("p") else "")
            language = normalize_text(article.select_one("[itemprop='programmingLanguage']").get_text() if article.select_one("[itemprop='programmingLanguage']") else "")
            if not _looks_ai(repo_path, description):
                continue
            items.append(
                SignalItem(
                    source=self.source_name,
                    title=repo_path,
                    url=url,
                    summary=description,
                    published_at=datetime.now(timezone.utc),
                    raw={"language": language},
                    fingerprint=fingerprint(self.source_name, repo_path, url),
                )
            )
        return items


def _looks_ai(title: str, description: str) -> bool:
    body = f"{title} {description}".lower()
    markers = ("ai", "llm", "agent", "transformer", "diffusion", "rag", "inference", "model")
    return any(marker in body for marker in markers)

