from __future__ import annotations

from collections import Counter
from hashlib import sha1

from app.models import SignalItem, TrendCluster
from app.utils.text import keywords


CLUSTER_RULES: dict[str, tuple[str, ...]] = {
    "AGENTIC BENCHMARKING": ("agent", "agents", "benchmark", "eval", "swe-bench", "agentic"),
    "OPEN-WEIGHT MODELS": ("open", "weights", "model", "models", "huggingface", "release"),
    "ALIGNMENT DISCOURSE": ("alignment", "safety", "jailbreak", "attack", "eval", "risk"),
    "MULTIMODAL AGENTS": ("multimodal", "visual", "video", "agent", "memory", "vlm"),
    "REASONING SCALING": ("reasoning", "scaling", "test-time", "inference", "chain", "search"),
    "INFERENCE OPTIMIZATION": ("inference", "serving", "latency", "quantization", "gpu", "optimization"),
}


def detect_clusters(items: list[SignalItem], *, limit: int = 8) -> list[TrendCluster]:
    clusters: list[TrendCluster] = []
    for name, markers in CLUSTER_RULES.items():
        matched = [_item for _item in items if _matches(_item, markers)]
        if not matched:
            continue
        sources = sorted({item.source for item in matched})
        topics = Counter(topic for item in matched for topic in item.topics)
        words = Counter()
        for item in matched:
            words.update(dict(keywords(f"{item.title} {item.summary}", limit=10)))
        pressure = len(matched)
        source_overlap = len(sources)
        source_pressure = round(source_overlap / 8, 3)
        confidence = min(0.99, 0.46 + pressure * 0.045 + source_overlap * 0.08)
        velocity = round(pressure * (1 + source_overlap * 0.18), 2)
        acceleration = round(max(0.0, velocity - pressure) * (1 + confidence * 0.25), 2)
        semantic_drift = round(min(0.96, (len(words) / 42) + source_pressure * 0.28), 3)
        score = round(velocity * confidence, 3)
        clusters.append(
            TrendCluster(
                name=name,
                score=score,
                confidence=round(confidence, 3),
                velocity=velocity,
                acceleration=acceleration,
                pressure=pressure,
                source_pressure=source_pressure,
                semantic_drift=semantic_drift,
                source_overlap=source_overlap,
                sources=sources,
                topics=[topic for topic, _ in topics.most_common(5)],
                keywords=[word for word, _ in words.most_common(6)],
                summary=_summary(name, sources, pressure),
            )
        )
    return sorted(clusters, key=lambda cluster: cluster.score, reverse=True)[:limit]


def relationship_graph(items: list[SignalItem], clusters: list[TrendCluster]) -> dict:
    nodes: list[dict] = []
    edges: list[dict] = []
    seen: set[str] = set()

    for cluster in clusters[:6]:
        cluster_id = f"cluster:{cluster.name}"
        nodes.append({"id": cluster_id, "label": cluster.name, "type": "cluster", "weight": cluster.score})
        seen.add(cluster_id)
        for source in cluster.sources[:4]:
            source_id = f"source:{source}"
            if source_id not in seen:
                nodes.append({"id": source_id, "label": source.replace("_", " "), "type": "source", "weight": 1})
                seen.add(source_id)
            edges.append({"source": cluster_id, "target": source_id, "weight": 0.5 + cluster.confidence})
        for topic in cluster.topics[:4]:
            topic_id = f"topic:{topic}"
            if topic_id not in seen:
                nodes.append({"id": topic_id, "label": topic, "type": "topic", "weight": 1})
                seen.add(topic_id)
            edges.append({"source": topic_id, "target": cluster_id, "weight": cluster.velocity})

    for item in sorted(items, key=lambda signal: signal.importance, reverse=True)[:14]:
        signal_id = f"signal:{item.fingerprint}"
        signal_type = _signal_node_type(item)
        nodes.append({"id": signal_id, "label": item.title[:42], "type": signal_type, "weight": item.importance})
        for topic in item.topics[:2]:
            topic_id = f"topic:{topic}"
            if topic_id in seen:
                edges.append({"source": signal_id, "target": topic_id, "weight": item.importance})
        for lab in _labs_for_item(item)[:2]:
            lab_id = f"lab:{lab}"
            if lab_id not in seen:
                nodes.append({"id": lab_id, "label": lab, "type": "lab", "weight": 0.9})
                seen.add(lab_id)
            edges.append({"source": lab_id, "target": signal_id, "weight": item.importance * 0.8})

    return {"nodes": nodes[:42], "edges": edges[:70]}


def _matches(item: SignalItem, markers: tuple[str, ...]) -> bool:
    body = f"{item.title} {item.summary} {' '.join(item.topics)}".lower()
    return any(marker in body for marker in markers)


def _summary(name: str, sources: list[str], pressure: int) -> str:
    source_text = ", ".join(source.replace("_", " ") for source in sources[:3]) or "monitored sources"
    if name == "ALIGNMENT DISCOURSE":
        return f"Alignment discourse pressure increasing across {source_text}; monitor correlation and escalation routes."
    if name == "AGENTIC BENCHMARKING":
        return f"Cross-source increase in benchmark-oriented agent research detected across {source_text}."
    if name == "OPEN-WEIGHT MODELS":
        return f"Open-weight model activity accelerating across {source_text}; release watch pressure elevated."
    if name == "INFERENCE OPTIMIZATION":
        return f"Inference optimization pressure increasing across {source_text}; serving constraints likely active."
    return f"{name.title()} cluster active with {pressure} correlated signals across {source_text}."


def _signal_node_type(item: SignalItem) -> str:
    body = f"{item.title} {item.summary} {' '.join(item.topics)}".lower()
    if "benchmark" in body or "eval" in body or "swe-bench" in body:
        return "benchmark"
    if "model" in body or "weights" in body or "release" in body:
        return "model"
    if item.source in {"arxiv"}:
        return "paper"
    if item.source in {"lesswrong_ai", "alignment_forum"}:
        return "discussion"
    return "signal"


def _labs_for_item(item: SignalItem) -> list[str]:
    body = f"{item.title} {item.summary} {' '.join(item.authors)}".lower()
    labs = []
    for lab in ("OpenAI", "Anthropic", "DeepMind", "Meta", "Mistral", "Google", "HuggingFace"):
        if lab.lower() in body or lab.lower().replace(" ", "") in item.source:
            labs.append(lab)
    if not labs and item.source in {"openai_blog", "anthropic_blog", "deepmind_updates"}:
        labs.append(item.source.split("_")[0].title())
    if not labs and int(sha1(item.fingerprint.encode("utf-8")).hexdigest(), 16) % 7 == 0:
        labs.append("Frontier Lab")
    return labs
