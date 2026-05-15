from __future__ import annotations

import hashlib
import re
from collections import Counter

STOPWORDS = {
    "about",
    "after",
    "ago",
    "again",
    "against",
    "also",
    "and",
    "are",
    "because",
    "been",
    "being",
    "between",
    "can",
    "for",
    "from",
    "have",
    "how",
    "into",
    "more",
    "new",
    "our",
    "over",
    "that",
    "the",
    "their",
    "this",
    "through",
    "updated",
    "using",
    "with",
    "without",
}


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def fingerprint(*parts: str) -> str:
    body = "|".join(normalize_text(part).lower() for part in parts)
    return hashlib.sha256(body.encode("utf-8")).hexdigest()[:24]


def keywords(text: str, *, limit: int = 18) -> list[tuple[str, int]]:
    tokens = re.findall(r"[a-zA-Z][a-zA-Z0-9\-]{2,}", text.lower())
    counts = Counter(token for token in tokens if token not in STOPWORDS)
    return counts.most_common(limit)
