from __future__ import annotations

from app.models import SignalItem
from app.storage.sqlite import SQLiteStore


def test_sqlite_store_deduplicates_by_fingerprint(tmp_path) -> None:
    store = SQLiteStore(tmp_path / "signalwatch.db")
    store.init()
    signal = SignalItem(source="arxiv", title="Test", url="https://example.test", fingerprint="abc", topics=["research"])
    assert store.upsert_items([signal, signal]) == 1
    assert len(store.list_items()) == 1

