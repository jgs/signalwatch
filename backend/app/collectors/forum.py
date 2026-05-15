from __future__ import annotations

from datetime import datetime, timezone

import aiohttp

from app.collectors.base import BaseCollector
from app.collectors.html import SiteHTMLCollector
from app.models import SignalItem
from app.utils.text import fingerprint, normalize_text


RECENT_POSTS_QUERY = """
query RecentPosts($input: PostsInput) {
  posts(input: $input) {
    results {
      title
      pageUrl
      postedAt
      baseScore
      excerpt
      user { displayName }
    }
  }
}
"""


class ForumCollector(BaseCollector):
    def __init__(self, source_name: str, graphql_url: str, tag_slug: str = "ai") -> None:
        super().__init__()
        self.source_name = source_name
        self.graphql_url = graphql_url
        self.tag_slug = tag_slug

    async def collect(self, session: aiohttp.ClientSession) -> list[SignalItem]:
        payload = {
            "query": RECENT_POSTS_QUERY,
            "variables": {
                "input": {
                    "terms": {
                        "view": "new",
                        "limit": 30,
                        "meta": False,
                        "tags": [self.tag_slug],
                    }
                }
            },
        }
        async with session.post(self.graphql_url, json=payload) as response:
            response.raise_for_status()
            data = await response.json()
        posts = data.get("data", {}).get("posts", {}).get("results", [])
        items: list[SignalItem] = []
        for post in posts:
            title = normalize_text(post.get("title", "Untitled"))
            url = post.get("pageUrl", "")
            items.append(
                SignalItem(
                    source=self.source_name,
                    title=title,
                    url=url,
                    summary=normalize_text(post.get("excerpt", "")),
                    authors=[post.get("user", {}).get("displayName", "")],
                    published_at=_iso_date(post.get("postedAt")),
                    raw=post,
                    fingerprint=fingerprint(self.source_name, title, url),
                )
            )
        return items


def _iso_date(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


class AlignmentForumCollector(SiteHTMLCollector):
    def __init__(self) -> None:
        super().__init__(
            "alignment_forum",
            "https://www.greaterwrong.com/tag/ai-alignment",
            link_prefixes=(
                "/posts/",
                "https://www.greaterwrong.com/posts/",
                "https://www.alignmentforum.org/posts/",
            ),
        )


class LessWrongAICollector(SiteHTMLCollector):
    def __init__(self) -> None:
        super().__init__(
            "lesswrong_ai",
            "https://www.lesswrong.com/tag/ai",
            link_prefixes=("/posts/", "https://www.lesswrong.com/posts/"),
        )
