from __future__ import annotations

from app.collectors.arxiv import ArxivAICollector
from app.collectors.blogs import AnthropicBlogCollector, DeepMindBlogCollector, OpenAIBlogCollector
from app.collectors.forum import AlignmentForumCollector, LessWrongAICollector
from app.collectors.github import GitHubTrendingAICollector
from app.collectors.huggingface import HuggingFaceTrendingModelsCollector


def default_collectors():
    return [
        ArxivAICollector(),
        AlignmentForumCollector(),
        LessWrongAICollector(),
        OpenAIBlogCollector(),
        AnthropicBlogCollector(),
        DeepMindBlogCollector(),
        GitHubTrendingAICollector(),
        HuggingFaceTrendingModelsCollector(),
    ]

