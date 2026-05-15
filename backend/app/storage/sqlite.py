from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path

from app.models import SignalItem


class SQLiteStore:
    def __init__(self, path: str | Path = "signalwatch.db") -> None:
        self.path = Path(path)

    def init(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS signals (
                    fingerprint TEXT PRIMARY KEY,
                    source TEXT NOT NULL,
                    title TEXT NOT NULL,
                    url TEXT NOT NULL,
                    summary TEXT,
                    authors TEXT,
                    topics TEXT,
                    importance REAL,
                    published_at TEXT,
                    raw TEXT,
                    inserted_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS feeds (
                    name TEXT PRIMARY KEY,
                    source_filter TEXT,
                    topic_filter TEXT,
                    min_importance REAL DEFAULT 0.0
                )
                """
            )

    def upsert_items(self, items: list[SignalItem]) -> int:
        inserted = 0
        with self._connect() as conn:
            for item in items:
                cursor = conn.execute(
                    """
                    INSERT OR IGNORE INTO signals
                    (fingerprint, source, title, url, summary, authors, topics, importance, published_at, raw)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        item.fingerprint,
                        item.source,
                        item.title,
                        item.url,
                        item.summary,
                        json.dumps(item.authors),
                        json.dumps(item.topics),
                        item.importance,
                        item.published_at.isoformat(),
                        json.dumps(item.raw, default=str),
                    ),
                )
                inserted += cursor.rowcount
        return inserted

    def list_items(self, limit: int = 100, topic: str | None = None, source: str | None = None) -> list[dict]:
        clauses: list[str] = []
        params: list[str | int] = []
        if topic:
            clauses.append("topics LIKE ?")
            params.append(f'%"{topic}"%')
        if source:
            clauses.append("source = ?")
            params.append(source)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        params.append(limit)
        with self._connect() as conn:
            rows = conn.execute(
                f"""
                SELECT fingerprint, source, title, url, summary, authors, topics, importance, published_at
                FROM signals
                {where}
                ORDER BY importance DESC, published_at DESC
                LIMIT ?
                """,
                params,
            ).fetchall()
        return [dict(row) | {"authors": json.loads(row["authors"]), "topics": json.loads(row["topics"])} for row in rows]

    def save_feed(self, name: str, source_filter: str | None, topic_filter: str | None, min_importance: float) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO feeds (name, source_filter, topic_filter, min_importance)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(name) DO UPDATE SET
                    source_filter=excluded.source_filter,
                    topic_filter=excluded.topic_filter,
                    min_importance=excluded.min_importance
                """,
                (name, source_filter, topic_filter, min_importance),
            )

    def list_feeds(self) -> list[dict]:
        with self._connect() as conn:
            rows = conn.execute("SELECT name, source_filter, topic_filter, min_importance FROM feeds").fetchall()
        return [dict(row) for row in rows]

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        return conn


def parse_db_path(database_url: str) -> str:
    if database_url.startswith("sqlite:///"):
        return database_url.removeprefix("sqlite:///")
    return database_url

