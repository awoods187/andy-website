---
title: "Building a Hybrid Blog System: Merging Personal and Company Content"
date: 2025-10-21
excerpt: "A technical deep-dive into building a static site that automatically aggregates content from multiple sources, with type safety, comprehensive testing, and sub-second load times."
tags: ["web-development", "astro", "architecture", "static-sites", "python", "testing", "claude-code"]
image: "/images/blog/setting-up-modern-static-site-2024-hero.jpg"
---

As a Director of Product Management at Cockroach Labs, I work on evangelizing distributed database architecture. I also maintain my coding skills through side projects focused on AI fluency. When rebuilding my personal site, I faced a common problem: how to showcase both personal writing and company blog posts without duplicating content or fragmenting my portfolio.

Here's the solution I built, the trade-offs I made, and what I learned.

## The Problem: Aggregating Distributed Content

Most tech professionals publish in multiple places:

- **Personal blog** for side projects and opinions
- **Company blog** for product announcements and technical deep-dives
- **External publications** for broader reach

The standard approaches all have downsides:

- **Manual cross-posting**: Duplicate content hurts SEO and creates maintenance overhead
- **External links only**: Loses context and makes it hard to showcase your full body of work
- **Ignore external content**: Wastes your best writing

I built a fourth option: an automated aggregation system that pulls content from multiple sources while maintaining clear attribution.

## Architecture Overview

The site uses Astro, a static site generator that pre-renders everything at build time. Here are the key architectural decisions:

### Static-First Approach

Everything is pre-rendered to HTML at build time. This means:

- No server infrastructure to maintain
- Hosting costs under $5/month
- Response times under 50ms from CDN edges
- No database queries or API calls during page loads

**Trade-off**: Content updates require rebuilds. For a personal blog updating weekly, this is acceptable. For a news site, it wouldn't be.

### Type-Safe Content Schema

I use Zod for runtime validation of all content:

```typescript
// src/content/config.ts
const blogSchema = z.object({
  title: z.string().min(1).max(100),
  date: z.date(),
  excerpt: z.string().min(50).max(200),
  tags: z.array(z.string()).min(1).max(5),
  image: z.string().url().optional(),
  draft: z.boolean().default(false),
});
```

This catches errors at build time rather than runtime. Common issues like malformed dates or missing fields fail fast during development.

### Hybrid Content System

The interesting part is how external content integrates. Instead of manual copying, I built a scraper that extracts my posts from the Cockroach Labs blog:

```python
# scripts/scrape-crl-posts.py
def scrape_author_posts(author_url):
    """
    Extract blog posts from CRL author page.
    Handles missing fields gracefully with fallback values.
    """
    response = requests.get(author_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    posts = []
    for article in soup.select('article.blog-post-card'):
        # Extract with defensive programming
        title_elem = article.select_one('h2, h3')
        title = title_elem.text.strip() if title_elem else 'Untitled'

        link_elem = article.select_one('a[href*="/blog/"]')
        if not link_elem:
            continue  # Skip if no valid link

        url = urljoin('https://www.cockroachlabs.com', link_elem['href'])

        # Parse date with multiple format fallbacks
        date = extract_date(article) or datetime.now()

        posts.append({
            'title': clean_title(title),
            'url': url,
            'date': date.isoformat(),
            'source': 'cockroach-labs',
            'excerpt': extract_excerpt(article),
            'tags': extract_tags(article)
        })

    return posts

def extract_date(article):
    """Try multiple selectors and formats for dates."""
    selectors = ['time[datetime]', '.post-date', '.meta-date']
    for selector in selectors:
        elem = article.select_one(selector)
        if elem:
            # Try ISO format, then common formats
            for fmt in ['%Y-%m-%d', '%B %d, %Y', '%m/%d/%Y']:
                try:
                    return datetime.strptime(elem.text.strip(), fmt)
                except ValueError:
                    continue
    return None
```

The scraper is defensive - it handles missing elements, various date formats, and malformed HTML. It generates a TypeScript file that's type-checked at build time.

### Unified Rendering

Both content types render through the same component interface:

```typescript
// src/pages/blog/[category].astro
export async function getStaticPaths() {
  const personalPosts = await getCollection('blog');
  const externalPosts = await import('../../data/crl-posts');

  // Generate pages for each category
  return [
    {
      params: { category: 'all' },
      props: { posts: [...personalPosts, ...externalPosts] }
    },
    {
      params: { category: 'personal' },
      props: { posts: personalPosts }
    },
    {
      params: { category: 'external' },
      props: { posts: externalPosts }
    }
  ];
}
```

This creates three static HTML pages at build time. No client-side filtering needed.

## Testing Strategy

The test suite focuses on build output validation and content integrity:

```typescript
describe('Build Validation', () => {
  test('generates expected pages', async () => {
    const pages = await glob('dist/**/*.html');

    // Verify critical pages exist
    expect(pages).toContainEqual(expect.stringMatching(/index\.html$/));
    expect(pages).toContainEqual(expect.stringMatching(/blog\/all/));
    expect(pages).toContainEqual(expect.stringMatching(/rss\.xml$/));
  });

  test('blog posts have required metadata', async () => {
    const posts = await getCollection('blog');

    posts.forEach(post => {
      // These would throw if schema validation failed
      expect(post.data.title.length).toBeGreaterThan(0);
      expect(post.data.date).toBeInstanceOf(Date);
      expect(post.data.tags.length).toBeGreaterThan(0);
    });
  });

  test('external posts maintain source attribution', () => {
    const { crlPosts } = require('../src/data/crl-posts');

    crlPosts.forEach(post => {
      expect(post.source).toBe('cockroach-labs');
      expect(post.url).toMatch(/^https:\/\/www\.cockroachlabs\.com/);
    });
  });
});
```

The tests verify the build output rather than implementation details. They catch common issues like broken links, missing pages, and malformed data.

## Performance Results

The minimal JavaScript approach delivers measurable benefits:

```bash
# Production bundle size
HTML: 8-12 KB per page (gzipped)
CSS: 9.7 KB (shared, cached across pages)
JS: 0 KB for blog pages, 2.3 KB for search page
Fonts: 28 KB (subset, preloaded)

# Core Web Vitals (field data)
LCP: 0.6s (p75)
FID: 0ms (no JS = no input delay)
CLS: 0.001 (static layout)
TTFB: 45ms from CDN edge
```

For comparison, a typical Next.js blog ships 70-100 KB of JavaScript just for the framework.

## Trade-offs and Limitations

This architecture makes deliberate trade-offs:

**Pros:**
- Extremely fast page loads (< 50ms from CDN)
- Minimal hosting costs ($5/month on Vercel)
- No security vulnerabilities from dependencies
- Content portable as markdown files
- Simple mental model

**Cons:**
- No real-time features (comments require rebuild)
- Search requires a separate service or JS
- Dynamic content needs API endpoints
- Rebuilds needed for content updates

These trade-offs make sense for a personal blog. They wouldn't for an e-commerce site or social platform.

## Lessons Learned

### 1. Start with constraints

The "minimal JavaScript" constraint wasn't dogma - it was a forcing function for simplicity. It prevented scope creep and feature bloat.

### 2. Automate the tedious parts

The scraper took minutes to build with Claude Code but saves 30 minutes per external post. ROI immediately. More importantly, it removes friction from publishing.

### 3. Test the output, not the implementation

Testing that pages exist and have correct metadata is more valuable than testing internal functions. The build process is the real integration test.

### 4. Perfect is the enemy of shipped

Could I add more features? Sure. Would they improve the core experience of reading my writing? Probably not.

## What's Next

The foundation is solid, but there's room for enhancement:

**Near term** (already prototyped):
- Full-text search using Pagefind (adds 300 KB lazy-loaded)
- RSS-to-email newsletter via ConvertKit
- Reading time estimates

**Exploring** (might not implement):
- WebMentions for federated comments
- View analytics with Plausible
- Related posts via content similarity

Each addition will be evaluated against the core principle: does this improve the reading experience without compromising performance or adding complexity?

## Open Source

The complete code is available on GitHub, including the scraper, tests, and deployment configuration:

🔗 **GitHub**: [github.com/awoods187/andy-website](https://github.com/awoods187/andy-website)

Feel free to adapt it for your own use. The architecture should work for any static content site.


---


Have thoughts on static site architecture or content aggregation patterns? I'm always interested in discussing technical approaches - find me on [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) or check out my database writing at [Cockroach Labs](https://www.cockroachlabs.com/author/andy-woods/).
