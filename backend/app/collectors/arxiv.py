from __future__ import annotations

from urllib.parse import urlencode

from app.collectors.rss import RSSCollector


class ArxivAICollector(RSSCollector):
    def __init__(self) -> None:
        query = urlencode(
            {
                "search_query": (
                    "cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV OR "
                    "cat:cs.RO OR cat:stat.ML OR all:alignment OR all:safety OR "
                    "all:reasoning OR all:agents OR all:multimodal"
                ),
                "start": 0,
                "max_results": 36,
                "sortBy": "submittedDate",
                "sortOrder": "descending",
            }
        )
        super().__init__("arxiv_capability_stream", f"https://export.arxiv.org/api/query?{query}", max_items=36)
