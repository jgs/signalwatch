from __future__ import annotations

from urllib.parse import urlencode

from app.collectors.rss import RSSCollector


class ArxivAICollector(RSSCollector):
    def __init__(self) -> None:
        query = urlencode(
            {
                "search_query": "cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV",
                "start": 0,
                "max_results": 50,
                "sortBy": "submittedDate",
                "sortOrder": "descending",
            }
        )
        super().__init__("arxiv", f"https://export.arxiv.org/api/query?{query}")

