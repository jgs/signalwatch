from __future__ import annotations

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any

import feedparser

from app.models import SignalItem
from app.utils.text import fingerprint, normalize_text


def parse_feed(source: str, payload: str) -> list[SignalItem]:
    parsed = feedparser.parse(payload)
    items: list[SignalItem] = []
    for entry in parsed.entries:
        published = _parse_date(entry.get("published") or entry.get("updated"))
        title = normalize_text(entry.get("title", "Untitled"))
        summary = normalize_text(entry.get("summary", ""))
        url = entry.get("link", "")
        authors = _authors(entry)
        items.append(
            SignalItem(
                source=source,
                title=title,
                url=url,
                summary=summary,
                authors=authors,
                published_at=published,
                raw=dict(entry),
                fingerprint=fingerprint(source, title, url),
            )
        )
    return items


def _parse_date(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    try:
        parsed = parsedate_to_datetime(value)
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except (TypeError, ValueError):
        return datetime.now(timezone.utc)


def _authors(entry: dict[str, Any]) -> list[str]:
    if "authors" in entry:
        return [normalize_text(author.get("name", "")) for author in entry.authors if author.get("name")]
    author = entry.get("author")
    return [normalize_text(author)] if author else []

