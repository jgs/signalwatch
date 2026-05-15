from __future__ import annotations

from app.collectors.html import SiteHTMLCollector
from app.collectors.rss import RSSCollector


class OpenAIBlogCollector(RSSCollector):
    def __init__(self) -> None:
        super().__init__("openai_blog", "https://openai.com/news/rss.xml", max_items=50)


class AnthropicBlogCollector(SiteHTMLCollector):
    def __init__(self) -> None:
        super().__init__(
            "anthropic_blog",
            "https://www.anthropic.com/news",
            link_prefixes=("/news/", "https://www.anthropic.com/news/"),
        )


class DeepMindBlogCollector(SiteHTMLCollector):
    def __init__(self) -> None:
        super().__init__(
            "deepmind_updates",
            "https://deepmind.google/discover/blog",
            link_prefixes=("/discover/blog/", "https://deepmind.google/discover/blog/"),
        )
