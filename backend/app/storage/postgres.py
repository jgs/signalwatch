from __future__ import annotations

import json

from app.models import SignalItem


class PostgresStore:
    def __init__(self, database_url: str) -> None:
        self.database_url = database_url

    def init(self) -> None:
        import psycopg

        with psycopg.connect(self.database_url) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS signals (
                    fingerprint TEXT PRIMARY KEY,
                    source TEXT NOT NULL,
                    title TEXT NOT NULL,
                    url TEXT NOT NULL,
                    summary TEXT,
                    authors JSONB,
                    topics JSONB,
                    importance DOUBLE PRECISION,
                    published_at TIMESTAMPTZ,
                    raw JSONB,
                    inserted_at TIMESTAMPTZ DEFAULT now()
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS feeds (
                    name TEXT PRIMARY KEY,
                    source_filter TEXT,
                    topic_filter TEXT,
                    min_importance DOUBLE PRECISION DEFAULT 0.0
                )
                """
            )

    def upsert_items(self, items: list[SignalItem]) -> int:
        import psycopg

        inserted = 0
        with psycopg.connect(self.database_url) as conn:
            for item in items:
                cursor = conn.execute(
                    """
                    INSERT INTO signals
                    (fingerprint, source, title, url, summary, authors, topics, importance, published_at, raw)
                    VALUES (%s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s, %s, %s::jsonb)
                    ON CONFLICT (fingerprint) DO NOTHING
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
                        item.published_at,
                        json.dumps(item.raw, default=str),
                    ),
                )
                inserted += cursor.rowcount
        return inserted

    def list_items(self, limit: int = 100, topic: str | None = None, source: str | None = None) -> list[dict]:
        import psycopg
        from psycopg.rows import dict_row

        clauses: list[str] = []
        params: list[str | int] = []
        if topic:
            clauses.append("topics ? %s")
            params.append(topic)
        if source:
            clauses.append("source = %s")
            params.append(source)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        params.append(limit)
        with psycopg.connect(self.database_url, row_factory=dict_row) as conn:
            rows = conn.execute(
                f"""
                SELECT fingerprint, source, title, url, summary, authors, topics, importance, published_at
                FROM signals
                {where}
                ORDER BY importance DESC, published_at DESC
                LIMIT %s
                """,
                params,
            ).fetchall()
        return [dict(row) for row in rows]

    def save_feed(self, name: str, source_filter: str | None, topic_filter: str | None, min_importance: float) -> None:
        import psycopg

        with psycopg.connect(self.database_url) as conn:
            conn.execute(
                """
                INSERT INTO feeds (name, source_filter, topic_filter, min_importance)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT(name) DO UPDATE SET
                    source_filter=excluded.source_filter,
                    topic_filter=excluded.topic_filter,
                    min_importance=excluded.min_importance
                """,
                (name, source_filter, topic_filter, min_importance),
            )

    def list_feeds(self) -> list[dict]:
        import psycopg
        from psycopg.rows import dict_row

        with psycopg.connect(self.database_url, row_factory=dict_row) as conn:
            rows = conn.execute("SELECT name, source_filter, topic_filter, min_importance FROM feeds").fetchall()
        return [dict(row) for row in rows]

