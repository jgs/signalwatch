from __future__ import annotations

import hashlib
import html
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
    text = html.unescape(value or "")
    text = re.sub(r"(?is)<(script|style).*?>.*?</\1>", " ", text)
    text = re.sub(r"(?is)<br\s*/?>", " ", text)
    text = re.sub(r"(?is)</p\s*>", " ", text)
    text = re.sub(r"(?is)<[^>]+>", " ", text)
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"\[[^\]]{0,80}\]\([^)]*\)", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"([,.;:!?]){2,}", r"\1", text)
    text = re.sub(r"\s+", " ", text)
    text = _dedupe_fragments(text.strip(" \t\r\n-–—|"))
    return text


def concise_text(value: str, *, max_chars: int = 340, max_sentences: int = 2) -> str:
    text = normalize_text(value)
    if not text:
        return ""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    selected: list[str] = []
    for sentence in sentences:
        clean = sentence.strip()
        if not clean:
            continue
        selected.append(clean)
        if len(selected) >= max_sentences or sum(len(item) for item in selected) >= max_chars:
            break
    summary = " ".join(selected) if selected else text
    if len(summary) <= max_chars:
        return summary
    truncated = summary[:max_chars].rsplit(" ", 1)[0].strip(" ,;:")
    return f"{truncated}."


def fingerprint(*parts: str) -> str:
    body = "|".join(normalize_text(part).lower() for part in parts)
    return hashlib.sha256(body.encode("utf-8")).hexdigest()[:24]


def _dedupe_fragments(text: str) -> str:
    parts = [part.strip() for part in re.split(r"(?<=[.!?])\s+", text) if part.strip()]
    if len(parts) < 2:
        return text
    seen: set[str] = set()
    result: list[str] = []
    for part in parts:
        key = re.sub(r"\W+", "", part.lower())[:120]
        if key and key in seen:
            continue
        seen.add(key)
        result.append(part)
    return " ".join(result)


def keywords(text: str, *, limit: int = 18) -> list[tuple[str, int]]:
    tokens = re.findall(r"[a-zA-Z][a-zA-Z0-9\-]{2,}", text.lower())
    counts = Counter(token for token in tokens if token not in STOPWORDS)
    return counts.most_common(limit)
