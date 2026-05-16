from __future__ import annotations

from app.collectors.rss import RSSCollector


class AlignmentForumMonitor(RSSCollector):
    def __init__(self) -> None:
        super().__init__("alignment_forum_discourse", "https://www.alignmentforum.org/feed.xml", max_items=24)


class LessWrongMonitor(RSSCollector):
    def __init__(self) -> None:
        super().__init__("lesswrong_alignment_discourse", "https://www.lesswrong.com/feed.xml", max_items=24)
