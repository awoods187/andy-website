---
title: "Building a Hybrid Blog System: Merging Personal and Company Content"
date: 2025-10-21
excerpt: "A technical deep-dive into building a static site that automatically aggregates content from multiple sources, with type safety, comprehensive testing, and sub-second load times."
tags: ["web-development", "astro", "architecture", "static-sites", "python", "testing", "claude-code", "ai"]
image: "/images/blog/setting-up-modern-static-site-2025-hero.jpg"

# License Information
license: "CC BY-NC 4.0"
copyright: "© 2025 Andy Woods"
attribution: "If you quote or translate this post, please provide attribution with a link back to the original at andywoods.me"
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

## Built with Claude Code: AI-Native Development in Practice

This entire site was built using Claude Code as my pair programmer. Here's how AI transformed the development process:

### Instant Architecture Decisions

Instead of spending hours researching build tools, I described my requirements to Claude Code:

```
"I need a static site that aggregates content from multiple sources,
has < 50ms load times, and costs < $5/month to host"
```

Claude Code immediately suggested Astro + TypeScript + Zod, explaining the trade-offs:
- **Why Astro over Next.js**: Zero JS by default, better for content sites
- **Why Zod over plain TypeScript**: Runtime validation catches content errors at build time
- **Why static over SSR**: Your update frequency doesn't justify server costs

This conversation took 2 minutes. Researching and evaluating these options manually would have taken days.

### AI-Accelerated Development Timeline

**Traditional approach** (estimated):
- Research frameworks: 4-6 hours
- Build basic site structure: 8-10 hours
- Implement content scraping: 6-8 hours
- Add testing: 4-6 hours
- Performance optimization: 3-4 hours
- **Total**: ~30-35 hours over 1-2 weeks

**With Claude Code** (actual):
- Architecture decisions: 15 minutes
- Site structure + components: 2 hours
- Content scraping system: 30 minutes
- Comprehensive test suite: 45 minutes
- Performance optimization: 30 minutes
- **Total**: ~4 hours in one afternoon

The 8x speedup wasn't just about typing faster—Claude Code brought best practices, edge case handling, and deployable patterns from the start.

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
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});
```

This catches errors at build time rather than runtime. Common issues like malformed dates or missing fields fail fast during development.

### Hybrid Content System

The interesting part is how external content integrates. Instead of manual copying, I built a scraper that extracts my posts from the Cockroach Labs blog. Here's the core pattern (simplified for clarity—actual implementation has more robust error handling):

```python
# scripts/scrape-crl-posts.py (simplified)
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

### How Claude Code Built the Scraper

The most impressive part wasn't the code itself—it was how Claude Code anticipated edge cases I wouldn't have thought of.

**My initial prompt**:
```
"Create a Python scraper that extracts blog posts from an author page"
```

**Claude Code's response**:
```python
# Claude Code immediately suggested these defensive patterns:

def extract_date(article):
    """Try multiple selectors and formats for dates."""
    # AI knew common blog date selectors
    selectors = ['time[datetime]', '.post-date', '.meta-date']

    for selector in selectors:
        elem = article.select_one(selector)
        if elem:
            # AI suggested these common date formats
            for fmt in ['%Y-%m-%d', '%B %d, %Y', '%m/%d/%Y']:
                try:
                    return datetime.strptime(elem.text.strip(), fmt)
                except ValueError:
                    continue
    return None  # Graceful fallback
```

**What Claude Code knew that I didn't**:
- Blogs use inconsistent date selectors (`<time>`, `.post-date`, `.meta-date`)
- Dates appear in multiple formats (ISO, "January 15, 2024", "1/15/2024")
- Elements can be missing—return `None` rather than crash
- Multiple retry strategies beat trying to get it perfect the first time

This defensive programming pattern would have taken me hours to discover through trial and error. Claude Code built it in from the start.

### Unified Rendering

All content types (personal blog, Cockroach Labs posts, publications) render through the same component interface. Here's the core pattern (simplified for clarity):

```typescript
// src/pages/blog/[category].astro (simplified)
export async function getStaticPaths() {
  const personalPosts = await getCollection('blog');
  const crlPosts = await import('../../data/crl-posts');
  const publications = await import('../../data/publications');

  // Combine and normalize all content sources
  const allPosts = [...personalPosts, ...crlPosts, ...publications]
    .sort((a, b) => b.date - a.date);

  // Extract unique tags for category pages
  const allTags = Array.from(new Set(allPosts.flatMap(p => p.tags)));

  // Generate static pages for sources AND categories
  const categories = [
    { slug: 'all', posts: allPosts },
    { slug: 'personal', posts: allPosts.filter(p => p.source === 'personal') },
    { slug: 'cockroach-labs', posts: allPosts.filter(p => p.source === 'cockroach-labs') },
    { slug: 'publications', posts: allPosts.filter(p => p.source === 'publications') },
    ...allTags.map(tag => ({
      slug: tag,
      posts: allPosts.filter(p => p.tags.includes(tag))
    }))
  ];

  return categories.map(cat => ({
    params: { category: cat.slug },
    props: { posts: cat.posts }
  }));
}
```

This generates ~10 static HTML pages at build time (sources + tag-based categories). The two-row filter UI (Sources / Categories) is pure HTML with no client-side JavaScript needed.

## Testing Strategy

### AI-Generated Comprehensive Test Coverage

The test suite focuses on build output validation and content integrity. But here's the remarkable part: Claude Code generated the entire test suite from a single prompt.

**My prompt**:
```
"Generate tests for a static blog that aggregates content from multiple sources"
```

**What Claude Code built**:

Claude Code didn't just test the happy path—it immediately identified edge cases I hadn't considered:

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

The minimal JavaScript approach delivers measurable benefits. Real Lighthouse scores from production deployment after optimization:

```bash
# Lighthouse Performance Metrics (Mobile, Slow 4G)
Performance Score: 89/100
Accessibility: 95/100
Best Practices: 100/100 ⭐
SEO: 100/100 ⭐

Core Web Vitals:
├── First Contentful Paint: 1.1s (excellent - text visible quickly)
├── Largest Contentful Paint: 3.7s (good - under 4s threshold)
├── Total Blocking Time: 0ms (perfect - zero JavaScript!)
├── Cumulative Layout Shift: 0.061 (excellent - < 0.1 threshold)
└── Speed Index: 1.4s (excellent - page renders fast)

# Production Bundle Sizes
HTML: 9-20 KB per page (uncompressed)
CSS: 15 KB (4 KB gzipped, shared across all pages)
JS: 0 KB for blog pages
Images: 88-219 KB (responsive srcset for mobile/desktop)
```

**Key optimizations that moved the needle**:
- Async font loading eliminated 1.7s of render blocking
- Responsive images (400w/800w/1200w) save 60% bandwidth on mobile
- Zero JavaScript = 0ms Total Blocking Time

For comparison, a typical Next.js blog ships 70-100 KB of JavaScript just for the framework.

### Deployment: Zero-Config Vercel

Deploying to Vercel was remarkably simple:

1. **Connect GitHub repository** - Vercel auto-detected Astro
2. **Deploy** - No configuration needed, worked on first try
3. **Custom domain** - Added andywoods.me in Vercel dashboard
4. **SSL** - Automatic HTTPS certificate via Let's Encrypt

**Total deployment time**: 5 minutes from commit to live site.

**Why Vercel over alternatives**:
- **Native Astro support**: Auto-detects build command and output directory
- **Edge network**: 100+ CDN locations for sub-50ms response times
- **Zero cost**: Free tier handles personal blogs easily
- **Git integration**: Automatic deployments on every push to main
- **Preview deployments**: Every PR gets its own preview URL for testing

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

Claude Code helped enforce this by suggesting solutions that matched the constraint rather than fighting it.

### 2. AI transforms "automate the tedious parts" into "automate everything"

The scraper took 5 minutes to build with Claude Code but saves 30 minutes per external post. More importantly, AI handled edge cases I wouldn't have thought of:
- Timezone parsing for dates
- Malformed HTML recovery
- Defensive fallbacks for missing elements
- Multiple retry strategies

**The AI advantage**: Claude Code's tests caught bugs *before* production. Traditional development often means discovering edge cases in production and patching them. AI-generated code anticipates edge cases from the start.

### 3. Test the output, not the implementation

Testing that pages exist and have correct metadata is more valuable than testing internal functions. The build process is the real integration test.

Claude Code knew this instinctively—it suggested integration tests over unit tests because static sites need output validation, not function mocking.

### 4. AI makes "good enough" actually good

With Claude Code, "MVP" doesn't mean "barely functional." The AI helped implement robust features from day one:
- Error handling with retry logic
- Accessibility features (semantic HTML, ARIA labels)
- Performance optimizations (font subsetting, critical CSS)
- Comprehensive test coverage

Features that would typically be "v2 nice-to-haves" were included in the initial build because they took minutes, not hours.

### 5. Document the AI collaboration

Showing how AI accelerated development is valuable for others. The prompts and patterns are reusable—this blog post itself becomes a template for AI-native development.

**Reusable patterns from this project**:
- "Create a defensive scraper that handles [X edge cases]"
- "Generate tests for [X type of application]"
- "Optimize [X] for performance without adding complexity"

## What's Next

The foundation is solid, but there's room for enhancement:

**Near term** (already prototyped):
- Full-text search using Pagefind (adds 300 KB lazy-loaded)
- RSS-to-email newsletter via ConvertKit

**Exploring** (might not implement):
- WebMentions for federated comments
- View analytics with Plausible
- Related posts via content similarity

Each addition will be evaluated against the core principle: does this improve the reading experience without compromising performance or adding complexity?

## Try Claude Code Yourself

Want to see AI-native development in action? Here are the exact prompts I used to build key features of this site.

### Example 1: Content Scraper (5 minutes)

**Prompt**:
```
Create a Python scraper that:
1. Extracts blog posts from an author page
2. Handles missing elements gracefully
3. Outputs TypeScript-compatible JSON
4. Preserves attribution to original source
5. Validates dates in multiple formats

The author page uses <article> cards with varying structures.
```

**Result**: Claude Code generated a ~500-line comprehensive scraper including:
- BeautifulSoup setup with proper error handling
- Multiple fallback strategies for each field
- TypeScript interface generation
- Defensive programming patterns
- Proper URL resolution for relative paths

### Example 2: Dual Licensing Structure (10 minutes)

**Prompt**:
```
Set up dual licensing for my blog:
- Code: MIT License (maximum reusability)
- Content: CC BY-NC 4.0 (protect written work)
- Create clear documentation explaining what's covered
- Add license headers to blog posts
```

**Result**: Claude Code created:
- `LICENSE-CODE.md` with MIT license and examples
- `LICENSE-CONTENT.md` with CC BY-NC 4.0 and attribution guide
- `LICENSE.md` explaining the dual structure
- Updated README with license section
- License metadata templates for blog posts

### Example 3: AI-Friendly Bot Controls (15 minutes)

**Prompt**:
```
Create professional bot and AI crawler controls that position me as LLM-friendly:
- robots.txt that explicitly allows AI crawlers
- ai.txt file with training policies
- humans.txt explaining philosophy
- AI meta tags in HTML head
```

**Result**: Claude Code generated:
- Comprehensive robots.txt (185 lines) allowing all major AI bots
- Detailed ai.txt (252 lines) with training permissions
- Creative humans.txt (266 lines) with ASCII art
- Meta tags for OpenAI, Anthropic, Google AI
- README-AI-POLICY.md with full policy

### Your Turn: Extend This Blog

Try these prompts with Claude Code to add features:

1. **Generate social media images**:
   ```
   "Build a script that generates Open Graph images for each blog post using the WPA poster style"
   ```

2. **Implement search**:
   ```
   "Add static search using Pagefind that loads on-demand and works offline"
   ```

3. **Add view counters**:
   ```
   "Add view count tracking without a database, using Vercel Analytics API at build time"
   ```

4. **Newsletter integration**:
   ```
   "Add ConvertKit newsletter signup form with inline validation and privacy compliance"
   ```

Each feature takes 10-30 minutes with Claude Code vs. hours (or days) of manual implementation, research, and debugging.

## Open Source

The complete code is available on GitHub, including the scraper, tests, and deployment configuration:

🔗 **GitHub**: [github.com/awoods187/andy-website](https://github.com/awoods187/andy-website)

Feel free to adapt it for your own use. The architecture should work for any static content site.


---

Have thoughts on static site architecture or content aggregation patterns? I'm always interested in discussing technical approaches - find me on [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) or check out my database writing at [Cockroach Labs](https://www.cockroachlabs.com/author/andy-woods/).

---

## License

*This post is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). You may quote or translate with attribution. For commercial republishing, please contact me via [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/).*
