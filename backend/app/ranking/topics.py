from __future__ import annotations

from app.models import SignalItem

TOPIC_RULES: dict[str, tuple[str, ...]] = {
    "alignment": ("alignment", "safety", "eval", "elicitation", "interpretability", "jailbreak"),
    "agents": ("agent", "tool use", "computer use", "browser", "workflow", "autonomous"),
    "models": ("model", "llm", "transformer", "mixture", "moe", "multimodal", "frontier"),
    "benchmarks": ("benchmark", "swe-bench", "mmlu", "gpqa", "arena", "eval"),
    "infrastructure": ("serving", "inference", "latency", "gpu", "cluster", "observability", "tracing"),
    "research": ("paper", "arxiv", "training", "preprint", "method", "dataset"),
    "open-source": ("github", "open source", "apache", "mit license", "weights", "huggingface"),
}


def tag_item(item: SignalItem) -> SignalItem:
    body = f"{item.title} {item.summary}".lower()
    item.topics = [topic for topic, markers in TOPIC_RULES.items() if any(marker in body for marker in markers)]
    if not item.topics:
        item.topics = ["general"]
    return item

