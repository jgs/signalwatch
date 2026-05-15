from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timezone

from bs4 import BeautifulSoup

from app.models import SignalItem
from app.utils.text import fingerprint, normalize_text


async def collect_rendered_links(
    *,
    source_name: str,
    url: str,
    link_selector: str,
    title_parser: Callable[[str], bool] | None = None,
    limit: int = 30,
) -> list[SignalItem]:
    """Optional Playwright collector helper for sources that need rendered HTML."""
    from playwright.async_api import async_playwright

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page()
        await page.goto(url, wait_until="networkidle")
        html = await page.content()
        await browser.close()

    soup = BeautifulSoup(html, "html.parser")
    items: list[SignalItem] = []
    for link in soup.select(link_selector):
        title = normalize_text(link.get_text(" "))
        href = link.get("href", "")
        if not title or not href:
            continue
        if title_parser and not title_parser(title):
            continue
        absolute_url = href if href.startswith("http") else f"{url.rstrip('/')}/{href.lstrip('/')}"
        items.append(
            SignalItem(
                source=source_name,
                title=title,
                url=absolute_url,
                published_at=datetime.now(timezone.utc),
                fingerprint=fingerprint(source_name, title, absolute_url),
            )
        )
        if len(items) >= limit:
            break
    return items

