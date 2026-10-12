#!/usr/bin/env python3
"""Scrape DualEntry Blog Posts.

This module scrapes Andy Woods' author page on dualentry.com to extract
blog posts with metadata (title, URL, date, image, excerpt, tags) and generates
a TypeScript data file for use in the Astro static site.

The scraper implements a hybrid approach:
- Step 1: Try the author page for post discovery
- Step 2: Merge in known post URLs not already discovered
- Step 3: Fetch each post page and extract metadata via OpenGraph meta tags

Usage:
    python3 scripts/scrape-dualentry-posts.py

Requirements:
    - requests>=2.31.0
    - beautifulsoup4>=4.12.0

Output:
    Generates src/data/dualentry-posts.ts with blog post metadata
"""

import json
import logging
import re
import sys
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Configuration constants
AUTHOR_URL = "https://www.dualentry.com/blog-author/andy-woods"
OUTPUT_PATH = Path("src/data/dualentry-posts.ts")
REQUEST_TIMEOUT = 30
MAX_RETRIES = 3
RETRY_BACKOFF_FACTOR = 1
EXCERPT_MAX_LENGTH = 200

# Known post URLs to include even if not found on the author page
KNOWN_POST_URLS: List[str] = [
    "https://www.dualentry.com/blog/built-so-a-finance-team-of-two-can-win",
]

# User-agent string
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

# Default tags for fintech/accounting posts
DEFAULT_TAGS: Set[str] = {"fintech", "accounting"}

# Tag keywords for auto-tagging
TAG_KEYWORDS = {
    "fintech": ["fintech", "financial", "finance"],
    "accounting": ["accounting", "accountant", "bookkeeping", "ledger"],
    "product-management": ["product", "strategy", "roadmap"],
    "ai": ["ai", "machine learning", "automation", "llm"],
    "startup": ["startup", "founding", "early-stage"],
}

DATE_FORMATS = ["%B %d, %Y", "%b %d, %Y", "%Y-%m-%d", "%m/%d/%Y"]


class BlogPost:
    """Represents a blog post with metadata."""

    def __init__(
        self,
        title: str,
        url: str,
        date: Optional[str] = None,
        image: Optional[str] = None,
        excerpt: str = "",
        tags: Optional[List[str]] = None,
    ) -> None:
        self.title = title
        self.url = url
        self.date = date
        self.image = image
        self.excerpt = excerpt[:EXCERPT_MAX_LENGTH] if excerpt else ""
        self.tags = tags or sorted(list(DEFAULT_TAGS))

    def to_dict(self) -> Dict:
        return {
            "title": self.title,
            "url": self.url,
            "date": self.date,
            "image": self.image,
            "excerpt": self.excerpt,
            "source": "dualentry",
            "tags": self.tags,
        }


def create_session() -> requests.Session:
    """Create a requests session with retry logic."""
    session = requests.Session()
    retry_strategy = Retry(
        total=MAX_RETRIES,
        backoff_factor=RETRY_BACKOFF_FACTOR,
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["GET", "HEAD"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    })
    return session


def parse_date(date_str: str) -> Optional[str]:
    """Parse a date string into YYYY-MM-DD format."""
    date_str = date_str.strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    logger.warning(f"Could not parse date: '{date_str}'")
    return None


def extract_tags(title: str, excerpt: str) -> List[str]:
    """Extract relevant tags from post content using keyword matching."""
    tags = set(DEFAULT_TAGS)
    combined_text = f"{title} {excerpt}".lower()

    for tag, keywords in TAG_KEYWORDS.items():
        if any(keyword in combined_text for keyword in keywords):
            tags.add(tag)

    return sorted(list(tags))


def discover_posts_from_author_page(session: requests.Session) -> List[str]:
    """Try to discover post URLs from the author page."""
    logger.info(f"Fetching author page: {AUTHOR_URL}")
    urls = []

    try:
        response = session.get(AUTHOR_URL, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # Look for blog post links
        for link in soup.find_all("a", href=True):
            href = link["href"]
            if "/blog/" in href and "/blog-author/" not in href:
                if not href.startswith("http"):
                    href = f"https://www.dualentry.com{href}"
                if href.startswith("https://www.dualentry.com/blog/") and href not in urls:
                    urls.append(href)

        logger.info(f"Found {len(urls)} posts on author page")
    except requests.RequestException as e:
        logger.warning(f"Could not fetch author page: {e}")

    return urls


def extract_post_from_page(session: requests.Session, url: str) -> Optional[BlogPost]:
    """Fetch a post page and extract metadata via OpenGraph meta tags."""
    logger.info(f"Fetching post: {url}")

    try:
        response = session.get(url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.warning(f"Could not fetch {url}: {e}")
        return None

    soup = BeautifulSoup(response.content, "html.parser")

    # Extract metadata from OpenGraph tags
    title = None
    image = None
    excerpt = None

    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        title = og_title["content"]

    og_image = soup.find("meta", property="og:image")
    if og_image and og_image.get("content"):
        image = og_image["content"]

    og_desc = soup.find("meta", property="og:description")
    if og_desc and og_desc.get("content"):
        excerpt = og_desc["content"]

    # Fallback: try standard meta description
    if not excerpt:
        meta_desc = soup.find("meta", attrs={"name": "description"})
        if meta_desc and meta_desc.get("content"):
            excerpt = meta_desc["content"]

    # Fallback: try <title> tag
    if not title:
        title_tag = soup.find("title")
        if title_tag:
            title = title_tag.get_text(strip=True)

    if not title:
        logger.warning(f"Could not extract title from {url}")
        return None

    # Extract date from page content
    date_str = None

    # Try <time> element
    time_elem = soup.find("time")
    if time_elem:
        date_str = time_elem.get("datetime") or time_elem.get_text(strip=True)

    # Try meta article:published_time
    if not date_str:
        pub_time = soup.find("meta", property="article:published_time")
        if pub_time and pub_time.get("content"):
            date_str = pub_time["content"][:10]  # Take YYYY-MM-DD portion

    # Try to find date-like text in the page
    if not date_str:
        date_pattern = re.compile(r'(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}')
        date_match = date_pattern.search(soup.get_text())
        if date_match:
            date_str = date_match.group(0)

    published_date = parse_date(date_str) if date_str else None

    tags = extract_tags(title, excerpt or "")

    return BlogPost(
        title=title,
        url=url,
        date=published_date,
        image=image,
        excerpt=excerpt or "",
        tags=tags,
    )


def generate_typescript_file(posts: List[BlogPost]) -> str:
    """Generate TypeScript data file content from blog posts."""
    timestamp = datetime.now().strftime("%Y-%m-%d")
    posts_data = [post.to_dict() for post in posts]
    posts_json = json.dumps(posts_data, indent=2, ensure_ascii=False)

    return f'''/**
 * DualEntry Blog Posts
 *
 * External blog posts written for DualEntry.
 * Auto-generated by scripts/scrape-dualentry-posts.py
 *
 * DO NOT EDIT MANUALLY - Run the scraper script to update.
 * Last updated: {timestamp}
 */

import type {{ ExternalPost }} from './types';

export const dualentryPosts: ExternalPost[] = {posts_json};
'''


def main() -> int:
    """Main entry point for the scraper."""
    logger.info("=" * 60)
    logger.info("Scraping DualEntry Blog Posts")
    logger.info("=" * 60)

    try:
        session = create_session()

        # Step 1: Try to discover posts from author page
        discovered_urls = discover_posts_from_author_page(session)

        # Step 2: Merge in known URLs not already discovered
        all_urls = list(discovered_urls)
        for url in KNOWN_POST_URLS:
            if url not in all_urls:
                logger.info(f"Adding known post URL: {url}")
                all_urls.append(url)

        if not all_urls:
            logger.warning("No post URLs found. Writing empty data file.")
            content = generate_typescript_file([])
            OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT_PATH.write_text(content, encoding="utf-8")
            logger.info(f"Generated {OUTPUT_PATH}")
            return 0

        # Step 3: Fetch each post and extract metadata
        posts: List[BlogPost] = []
        for url in all_urls:
            post = extract_post_from_page(session, url)
            if post:
                posts.append(post)
                logger.info(f"  Extracted: {post.title}")

        # Sort by date (newest first), putting undated posts last
        posts.sort(key=lambda p: p.date or "0000-00-00", reverse=True)

        # Generate and write output
        content = generate_typescript_file(posts)
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_text(content, encoding="utf-8")

        logger.info(f"\nGenerated {OUTPUT_PATH} with {len(posts)} posts")
        for post in posts:
            logger.info(f"  - {post.title} ({post.date or 'no date'})")

        logger.info("\nScraping completed successfully!")
        return 0

    except Exception as e:
        logger.error(f"Error: {e}")
        logger.debug(traceback.format_exc())
        return 1


if __name__ == "__main__":
    sys.exit(main())
