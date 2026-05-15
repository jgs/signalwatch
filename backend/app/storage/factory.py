from __future__ import annotations

from typing import Protocol

from app.config import settings
from app.models import SignalItem
from app.storage.postgres import PostgresStore
from app.storage.sqlite import SQLiteStore, parse_db_path


class SignalStore(Protocol):
    def init(self) -> None: ...
    def upsert_items(self, items: list[SignalItem]) -> int: ...
    def list_items(self, limit: int = 100, topic: str | None = None, source: str | None = None) -> list[dict]: ...
    def save_feed(self, name: str, source_filter: str | None, topic_filter: str | None, min_importance: float) -> None: ...
    def list_feeds(self) -> list[dict]: ...


def create_store(database_url: str | None = None) -> SignalStore:
    url = database_url or settings.database_url
    if url.startswith(("postgresql://", "postgres://")):
        return PostgresStore(url)
    return SQLiteStore(parse_db_path(url))

