from __future__ import annotations

from app.collectors.html import SiteHTMLCollector
from app.collectors.rss import RSSCollector


class AnthropicMonitor(SiteHTMLCollector):
    def __init__(self) -> None:
        super().__init__(
            "anthropic_policy_watcher",
            "https://www.anthropic.com/news",
            link_prefixes=("/news/", "https://www.anthropic.com/news/"),
            limit=18,
        )


class OpenAIMonitor(RSSCollector):
    def __init__(self) -> None:
        super().__init__("openai_policy_watcher", "https://openai.com/news/rss.xml", max_items=18)
