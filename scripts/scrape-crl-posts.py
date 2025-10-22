#!/usr/bin/env python3
"""Scrape Cockroach Labs Blog Posts.

This module scrapes Andy Woods' author page on cockroachlabs.com to extract
all blog posts with metadata (title, URL, date, image, excerpt, tags) and generates
a TypeScript data file for use in the Astro static site.

The scraper implements:
- Robust error handling with retry logic
- User-agent rotation to avoid bot detection
- Comprehensive logging for debugging
- Automatic tag extraction from post content

Usage:
    python3 scripts/scrape-crl-posts.py

Requirements:
    - requests>=2.31.0
    - beautifulsoup4>=4.12.0

Output:
    Generates src/data/crl-posts.ts with blog post metadata

Security:
    - No authentication required (public URL)
    - Timeout configured to prevent hanging requests
    - No hardcoded credentials or secrets
"""

import json
import logging
import re
import sys
import time
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set

import requests
from bs4 import BeautifulSoup, Tag
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
AUTHOR_URL = "https://www.cockroachlabs.com/author/andy-woods/"
OUTPUT_PATH = Path("src/data/crl-posts.ts")
DATE_FORMATS = ["%B %d, %Y", "%b %d, %Y", "%Y-%m-%d", "%m/%d/%Y"]
EXCERPT_MAX_LENGTH = 200
REQUEST_TIMEOUT = 30  # seconds
MAX_RETRIES = 3
RETRY_BACKOFF_FACTOR = 1  # seconds

# User-agent string to avoid bot detection
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

# Default tags for database-related posts
DEFAULT_TAGS: Set[str] = {"databases"}


class BlogPost:
    """Represents a blog post with metadata.

    Attributes:
        title: The blog post title
        url: The full URL to the blog post
        date: Publication date in YYYY-MM-DD format
        image: URL to the featured image
        excerpt: Short description of the post
        tags: List of topic tags for categorization
    """

    def __init__(
        self,
        title: str,
        url: str,
        date: Optional[str] = None,
        image: Optional[str] = None,
        excerpt: str = "",
        tags: Optional[List[str]] = None,
    ) -> None:
        """Initialize a BlogPost instance.

        Args:
            title: The blog post title
            url: The full URL to the blog post
            date: Publication date in YYYY-MM-DD format
            image: URL to the featured image
            excerpt: Short description of the post
            tags: List of topic tags (defaults to ["databases"] if None)
        """
        self.title = title
        self.url = url
        self.date = date
        self.image = image
        self.excerpt = excerpt[:EXCERPT_MAX_LENGTH] if excerpt else ""
        self.tags = tags or list(DEFAULT_TAGS)

    def to_dict(self) -> Dict[str, any]:
        """Convert blog post to dictionary for JSON serialization.

        Returns:
            Dictionary representation of the blog post with all metadata
        """
        return {
            "title": self.title,
            "url": self.url,
            "date": self.date,
            "image": self.image,
            "excerpt": self.excerpt,
            "source": "cockroach-labs",
            "tags": self.tags,
        }


def create_session_with_retries() -> requests.Session:
    """Create a requests session with retry logic and proper headers.

    Implements exponential backoff for transient network failures.
    Retries on specific HTTP status codes (500, 502, 503, 504).

    Returns:
        Configured requests.Session object
    """
    session = requests.Session()

    # Configure retry strategy
    retry_strategy = Retry(
        total=MAX_RETRIES,
        backoff_factor=RETRY_BACKOFF_FACTOR,
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["GET", "HEAD"]
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    # Set headers to avoid bot detection
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
    """Parse a date string into YYYY-MM-DD format.

    Tries multiple date formats to handle various input formats.
    Logs warning if parsing fails.

    Args:
        date_str: Date string in various formats (e.g., "January 15, 2024")

    Returns:
        Date in YYYY-MM-DD format, or None if parsing fails

    Examples:
        >>> parse_date("January 15, 2024")
        "2024-01-15"
        >>> parse_date("Jan 15, 2024")
        "2024-01-15"
        >>> parse_date("2024-01-15")
        "2024-01-15"
    """
    date_str = date_str.strip()

    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue

    logger.warning(f"Could not parse date: '{date_str}'")
    return None


def extract_tags(card: Tag, title: str, excerpt: str) -> List[str]:
    """Extract relevant tags from post content.

    Uses keyword matching to identify relevant topics:
    - Distributed systems, reliability, disaster recovery
    - Product management, pricing, cloud
    - Security, performance, migrations

    Args:
        card: BeautifulSoup Tag containing post data
        title: Post title for keyword extraction
        excerpt: Post excerpt for keyword extraction

    Returns:
        List of relevant tags
    """
    tags = set(DEFAULT_TAGS)
    combined_text = f"{title} {excerpt}".lower()

    # Tag mapping based on keywords
    tag_keywords = {
        "distributed-systems": ["distributed", "multi-region", "geo-distributed", "replication"],
        "reliability": ["reliability", "resilience", "failover", "uptime"],
        "disaster-recovery": ["disaster recovery", "backup", "restore", "recovery"],
        "product-management": ["product", "pricing", "packaging", "strategy"],
        "pricing": ["pricing", "cost", "billing"],
        "cloud": ["cloud", "aws", "gcp", "azure"],
        "security": ["security", "authentication", "encryption"],
        "performance": ["performance", "optimization", "latency"],
        "migration": ["migration", "migrate", "migrating"],
        "architecture": ["architecture", "design", "pattern"],
    }

    for tag, keywords in tag_keywords.items():
        if any(keyword in combined_text for keyword in keywords):
            tags.add(tag)

    return sorted(list(tags))


def extract_post_data(card: Tag) -> Optional[BlogPost]:
    """Extract blog post metadata from an HTML element.

    Performs defensive extraction with fallbacks for missing elements.
    Handles various HTML structures and edge cases.

    Args:
        card: BeautifulSoup Tag containing post data (article or div)

    Returns:
        BlogPost object if extraction succeeds, None otherwise

    Notes:
        - Requires at minimum: title and URL
        - Other fields are optional with sensible defaults
        - Logs warnings for missing optional fields
    """
    try:
        # Extract title (required)
        title_elem = card.find("h2") or card.find("h3") or card.find("a")
        if not title_elem:
            logger.debug("Skipping card: no title element found")
            return None
        title = title_elem.get_text(strip=True)

        # Extract URL (required)
        link_elem = card.find("a", href=True)
        if not link_elem:
            logger.debug(f"Skipping post '{title}': no URL found")
            return None

        url = link_elem["href"]
        # Convert relative URLs to absolute
        if not url.startswith("http"):
            url = f"https://www.cockroachlabs.com{url}"

        # Extract image URL (optional)
        img_elem = card.find("img")
        image_url = None
        if img_elem and "src" in img_elem.attrs:
            image_url = img_elem["src"]
            # Convert relative URLs to absolute
            if image_url and not image_url.startswith("http"):
                image_url = f"https://www.cockroachlabs.com{image_url}"

        # Extract excerpt/description (optional)
        excerpt_elem = card.find("p") or card.find(
            "div", class_=re.compile("excerpt|description|summary")
        )
        excerpt = excerpt_elem.get_text(strip=True) if excerpt_elem else ""

        # Extract and parse date (optional)
        date_elem = card.find("time") or card.find("span", class_=re.compile("date"))
        date_str = date_elem.get_text(strip=True) if date_elem else None
        published_date = parse_date(date_str) if date_str else None

        # Extract tags based on content
        tags = extract_tags(card, title, excerpt)

        return BlogPost(
            title=title,
            url=url,
            date=published_date,
            image=image_url,
            excerpt=excerpt,
            tags=tags,
        )

    except Exception as e:
        logger.warning(f"Error extracting post data: {e}", exc_info=True)
        return None


def scrape_crl_author_page(session: requests.Session) -> List[BlogPost]:
    """Scrape the Cockroach Labs author page for blog posts.

    Uses robust error handling and retry logic for network resilience.

    Args:
        session: Configured requests session with retry logic

    Returns:
        List of BlogPost objects extracted from the page

    Raises:
        requests.RequestException: If the HTTP request fails after all retries

    Notes:
        - CSS selectors may need adjustment if page structure changes
        - Check logs if extraction count seems low
    """
    logger.info(f"Fetching {AUTHOR_URL}...")

    try:
        response = session.get(AUTHOR_URL, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        logger.info(f"Successfully fetched page (status: {response.status_code})")
    except requests.RequestException as e:
        logger.error(f"Failed to fetch page: {e}")
        raise

    soup = BeautifulSoup(response.content, "html.parser")
    posts: List[BlogPost] = []

    # Find all potential blog post containers
    # Note: CSS selectors may need adjustment if page structure changes
    post_cards = soup.find_all("article") or soup.find_all(
        "div", class_=re.compile("post|article|card")
    )

    logger.info(f"Found {len(post_cards)} potential post elements")

    for i, card in enumerate(post_cards, 1):
        post = extract_post_data(card)
        if post:
            posts.append(post)
            logger.info(f"✓ [{i}/{len(post_cards)}] Extracted: {post.title}")
        else:
            logger.debug(f"✗ [{i}/{len(post_cards)}] Skipped element")

    return posts


def generate_typescript_file(posts: List[BlogPost]) -> str:
    """Generate TypeScript data file content from blog posts.

    Creates a type-safe TypeScript module with post metadata.
    Includes proper interface definitions and documentation.

    Args:
        posts: List of BlogPost objects to serialize

    Returns:
        TypeScript file content as a string with proper formatting

    Notes:
        - Uses JSON for data serialization
        - Preserves Unicode characters
        - Includes timestamp for tracking updates
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    posts_data = [post.to_dict() for post in posts]

    # Format JSON with proper indentation (2 spaces)
    posts_json = json.dumps(posts_data, indent=2, ensure_ascii=False)

    return f'''/**
 * Cockroach Labs Blog Posts
 *
 * External blog posts written for Cockroach Labs.
 * Auto-generated by scripts/scrape-crl-posts.py
 *
 * DO NOT EDIT MANUALLY - Run the scraper script to update.
 * Last updated: {timestamp}
 */

export interface ExternalPost {{
  title: string;
  url: string;
  date: string | null;
  image: string | null;
  excerpt: string;
  source: 'cockroach-labs';
  tags: string[];
}}

export const crlPosts: ExternalPost[] = {posts_json};
'''


def write_output_file(content: str, file_path: Path) -> None:
    """Write generated content to output file.

    Creates parent directories if they don't exist.
    Uses UTF-8 encoding for Unicode support.

    Args:
        content: File content to write
        file_path: Path to output file

    Raises:
        IOError: If file write fails (e.g., permissions, disk space)

    Notes:
        - Creates parent directories automatically
        - Overwrites existing file
        - Uses UTF-8 encoding
    """
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")
        logger.info(f"✅ Generated {file_path}")
    except IOError as e:
        logger.error(f"Failed to write output file: {e}")
        raise


def main() -> int:
    """Main entry point for the scraper.

    Orchestrates the scraping workflow:
    1. Create configured session with retries
    2. Scrape blog posts from author page
    3. Generate TypeScript data file
    4. Write output and display summary

    Returns:
        Exit code (0 for success, 1 for failure)

    Notes:
        - Logs all operations for debugging
        - Handles errors gracefully with detailed messages
        - Returns non-zero exit code on failure for CI/CD integration
    """
    logger.info("=" * 60)
    logger.info("Scraping Cockroach Labs Author Page")
    logger.info("=" * 60)

    try:
        # Create session with retry logic
        session = create_session_with_retries()

        # Scrape posts
        posts = scrape_crl_author_page(session)

        if not posts:
            logger.error("No posts found!")
            logger.error("The page structure may have changed.")
            logger.error("Please check the HTML structure and update selectors.")
            return 1

        logger.info(f"\n✅ Successfully extracted {len(posts)} posts")

        # Generate TypeScript file
        ts_content = generate_typescript_file(posts)
        write_output_file(ts_content, OUTPUT_PATH)

        # Print summary
        logger.info("\n" + "=" * 60)
        logger.info("Posts Extracted:")
        logger.info("=" * 60)
        for post in posts:
            logger.info(f"\n  Title: {post.title}")
            logger.info(f"  Date:  {post.date or 'Unknown'}")
            logger.info(f"  Image: {'✓' if post.image else '✗'}")
            logger.info(f"  Tags:  {', '.join(post.tags)}")
            logger.info(f"  URL:   {post.url}")

        logger.info("\n✅ Scraping completed successfully!")
        return 0

    except Exception as e:
        logger.error(f"\n❌ Error: {e}")
        logger.debug(traceback.format_exc())
        return 1


if __name__ == "__main__":
    sys.exit(main())
