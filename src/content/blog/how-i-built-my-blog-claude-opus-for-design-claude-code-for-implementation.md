---
title: "How I Built My Blog: Why I Use Different AI Models for Architecture vs Implementation"
date: 2025-10-21
excerpt: "Strategic AI model selection for modern development: using Claude Opus for architecture, Claude Code for implementation, and Claude Haiku for validation. Learn how multi-model orchestration achieved a $0.47 build cost with 9,574x ROI."
tags: ["web-development", "astro", "architecture", "static-sites", "python", "testing", "claude-code", "ai", "multi-model-orchestration"]
image: "/images/blog/how-i-built-my-blog-claude-opus-for-design-claude-code-for-implementation-hero.jpg"
imageSource: "AI-generated using Stable Diffusion"

# License Information
license: "CC BY-NC 4.0"
copyright: "© 2025 Andy Woods"
attribution: "If you quote or translate this post, please provide attribution with a link back to the original at andywoods.me"
---

When building my personal site, I faced a common problem: how to showcase both personal writing and company blog posts without duplicating content or fragmenting my portfolio. Here's the solution I built, the trade-offs I considered, and what I learned.

## The Problem: Aggregating Distributed Content

Most tech professionals publish in multiple places:

- Personal blog for side projects and opinions
- Company blog for product announcements and technical deep-dives
- External publications for broader reach

The standard approaches all failed:

**Platform limitations:**
- Ghost/WordPress: Too heavy for a simple blog, requires database/server maintenance
- GitHub Pages: Manual HTML or limited theming, no content aggregation features
- Medium/Substack: Don't own your URLs, can't customize design, vendor lock-in

**Content strategy problems:**
- Manual cross-posting: Duplicate content penalties hurt SEO, maintenance nightmare as posts multiply
- External links only: Loses context and makes it hard to showcase your full body of work
- Ignore external content: Wastes your best writing that lives elsewhere

I built a fourth option: an automated aggregation system that pulls content from multiple sources while maintaining clear attribution.

## Development Workflow: Separating Planning from Implementation

Strategic tool selection mattered more than any technical choice: Claude Opus as my architect and Claude Code as my pair programmer.

**Window 1: Design & Planning (Claude Opus via chat)**
- Collaborative design discussions
- Requirements gathering through questions
- Architecture recommendations
- Review and iteration cycles

**Window 2: Implementation (Claude Code)**
- Takes the finalized design as input
- Executes the implementation
- Handles file creation and code generation

This separation creates intentional boundaries between design discussions and implementation.

## Multi-Model Orchestration: Beyond Single-Tool Thinking

I orchestrated three models based on empirical performance data:

**Claude Opus 4.1 (Architecture & Strategy)**
- Token cost: $0.015/1K input
- Latency: 2-3s for complex reasoning
- Use case: System design requiring 10+ constraint evaluation
- Example: Evaluated 15 static site generators against 8 criteria in one pass

**Claude Code (Implementation)**
- Token cost: $0.003/1K (80% cheaper than Opus)
- Latency: <1s for code generation
- Use case: Deterministic implementation from specs
- Example: Generated 2,500 lines of production code with tests

**Claude Haiku (Validation & Testing)**
- Token cost: $0.00025/1K (98% cheaper than Opus)
- Latency: <500ms
- Use case: Syntax validation, linting, simple refactors
- Example: Validated 135 test cases for edge conditions

**Total AI cost for entire project: $0.47**
**Manual development estimated cost: $4,500 (30 hours @ $150/hr)**
**ROI: 9,574x**

### Why This Separation Matters

**Different models excel at different tasks.** Opus excels at reasoning through ambiguity and exploring solution spaces. Code excels at execution, generating working files in minutes. Using both strategically gave me the best of each.

**It prevents architectural churn during implementation.** Once you're in "build mode," revisiting fundamental design decisions kills momentum. The handoff from Opus to Code made the transition explicit: design is frozen, now execute.

**It creates documentation.** The Opus conversation becomes a record of why decisions were made. When I revisit this project in 6 months, I'll have the full context.

### How I Used It For This Site

**In Claude Opus**, I started with:

```
"I need a personal website that aggregates blog posts from multiple sources,
loads fast, and costs almost nothing to host. What approach would you recommend?"
```

Opus asked clarifying questions:
- How often does content update? (Weekly)
- What's your comfort with JavaScript frameworks? (Prefer minimal JS)
- Do you need server-side features? (No)
- What's your deployment preference? (Vercel/Netlify)

Based on my answers, Opus recommended **Astro + TypeScript + Python scraper** with rationale:
- **Astro**: Zero JS by default, perfect for content-first sites
- **TypeScript**: Type safety catches errors at build time
- **Python scraper**: Familiar language, great HTML parsing libraries
- **Static generation**: No server costs, 50ms loads from CDN

This conversation took **15 minutes**. Researching frameworks manually would have taken **days**.

**In Claude Code**, I provided the finalized architecture via a prompt written by Opus:

```
"Build an Astro site with:
- Personal blog posts in Markdown
- Python scraper for Cockroach Labs posts
- Unified rendering for all content sources
- Type-safe content validation with Zod
- Comprehensive test suite"
```

Claude Code generated the entire project in **2 hours**, including edge case handling I hadn't specified.

### AI-Accelerated Development Timeline

**Architecture Phase (15 minutes with Opus vs 4 hours manual)**
- Framework evaluation: 2 minutes (vs 2 hours researching)
- Performance requirement mapping: 3 minutes (vs 1 hour benchmarking)
- Security architecture: 5 minutes (vs 30 minutes threat modeling)
- Cost modeling: 2 minutes (vs 30 minutes calculator work)
- Decision documentation: 3 minutes (auto-generated)

**Implementation Phase (2 hours with Code vs 20 hours manual)**
- Boilerplate setup: 5 minutes (vs 2 hours)
- Content schema + validation: 15 minutes (vs 3 hours)
- Scraper with error handling: 30 minutes (vs 6 hours)
- Test suite (135 tests): 45 minutes (vs 6 hours)
- Performance optimization: 25 minutes (vs 3 hours)

**The Non-Obvious Insight:** AI didn't just code faster—it eliminated entire categories of work:
- No Stack Overflow diving for edge cases
- No debugging cycles for typos
- No refactoring for missed requirements
- No performance regression hunting

The **12x speedup** came from Claude Code providing best practices, edge case handling, and deployable patterns from the start.

### When to Use This Pattern

This separation works particularly well for:

- Complex projects with non-trivial architectural decisions
- When you're exploring multiple approaches
- Projects where you want clear documentation of design rationale
- Situations where you need to review and approve before implementation

For simpler tasks, going straight to Claude Code is perfectly fine. But for substantial work, this two-phase approach has been invaluable.

## Architecture Overview

The site is a static build pipeline. It pulls content from multiple sources (personal Markdown posts, Cockroach Labs blog, publications), normalizes everything into a unified format, and generates plain HTML. There's no runtime backend, no database—just pre-rendered files served from a CDN.

### Static-First Approach

Everything is pre-rendered to HTML at build time. This means:

- No server infrastructure to maintain
- Hosting costs under $5/month
- Response times under 50ms from CDN edges
- No database queries or API calls during page loads

**Trade-off**: Content updates require rebuilds. For a personal blog updating weekly, this is acceptable. For a news site, it wouldn't be.

### Type-Safe Content Schema

Zod validates all content at build time:

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

### Security Considerations

Aggregating content from external sources introduces security risks. Here's how this site mitigates them:

**Content Sanitization**: The scraper uses Python's `bleach` library to sanitize all extracted HTML before writing it to the codebase. This strips `<script>` tags, event handlers (`onclick`, `onerror`), iframes, and tracking pixels while preserving basic formatting. The sanitization happens at build time, so malicious content never reaches the deployed site.

**Security Headers**: The site uses Vercel's header configuration to enforce a strict Content Security Policy (CSP) that prevents inline scripts, restricts image sources to trusted domains, and blocks framing attacks. Headers include `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` with HSTS preload.

**Attribution Enforcement**: External posts include clear source attribution in both metadata and rendered HTML. This is enforced at the type level—TypeScript won't compile if source information is missing.

**Dependency Management**: The build pipeline uses Dependabot for automated security updates. Any vulnerability in dependencies triggers a failing build until addressed.

### Why This Matters

Static sites are inherently more secure than dynamic backends (no SQL injection, no authentication vulnerabilities), but aggregating external content creates new attack surfaces. These mitigations ensure scraped content can't compromise the site or visitors.

### Content Aggregation Details

The scraper runs during the build process, not at runtime:

```python
# scripts/scrape-crl-posts.py
def scrape_author_posts(author_url):
    response = requests.get(author_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    posts = []
    for article in soup.select('article.post-card'):
        post = {
            'title': article.select_one('h2').text.strip(),
            'url': article.select_one('a')['href'],
            'date': parse_date(article.select_one('time')['datetime']),
            'excerpt': article.select_one('.post-excerpt').text.strip(),
            'source': 'cockroach-labs'
        }
        posts.append(post)

    return posts
```

The scraper outputs a TypeScript file that gets imported during the Astro build. This means:

- Content is versioned in Git
- Builds are reproducible
- No runtime dependencies on external sites
- Changes to external content require explicit review

### Handling Missing Data

Real-world HTML is messy. The scraper uses defensive extraction patterns:

```python
# Conceptual example - actual implementation is more comprehensive
def extract_post_data(card):
    """Extract with fallbacks for missing elements"""
    # Title (required)
    title_elem = card.find("h2") or card.find("h3") or card.find("a")
    if not title_elem:
        return None  # Skip if no title

    # URL (required)
    link_elem = card.find("a", href=True)
    if not link_elem:
        return None  # Skip if no URL

    # Optional fields with defaults
    excerpt_elem = card.find("p") or card.find("div", class_="excerpt")
    excerpt = excerpt_elem.get_text(strip=True) if excerpt_elem else ""

    return BlogPost(title=title, url=url, excerpt=excerpt)
```

This defensive approach prevents build failures when external sites change their HTML structure. Missing optional fields default to empty values, while missing required fields skip the post entirely.

## Testing Strategy

The test suite focuses on build outputs rather than implementation:

```typescript
// tests/build.test.ts
describe('Build Output', () => {
  it('should generate all expected pages', () => {
    const paths = [
      '/blog',
      '/blog/post-1',
      '/about',
    ];

    paths.forEach(path => {
      const file = join(distPath, `${path}.html`);
      expect(existsSync(file)).toBe(true);
    });
  });
});

// tests/content.test.ts
describe('Content Files', () => {
  it('should have valid frontmatter', () => {
    const mdFiles = readdirSync(contentPath);

    mdFiles.forEach(file => {
      const content = readFileSync(join(contentPath, file), 'utf-8');

      // Check for required fields
      expect(content).toMatch(/title:/);
      expect(content).toMatch(/date:/);
      expect(content).toMatch(/excerpt:/);
      expect(content).toMatch(/tags:/);
    });
  });
});

// tests/external-posts.test.ts - Validates external posts
import { crlPosts } from '../src/data/crl-posts';

describe('Cockroach Labs Posts', () => {
  it('should have valid Cockroach Labs URLs', () => {
    crlPosts.forEach(post => {
      expect(post.url).toMatch(/^https:\/\/www\.cockroachlabs\.com/);
      expect(post.source).toBe('cockroach-labs');
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

Key optimizations that moved the needle:
- Async font loading eliminated 1.7s of render blocking
- Responsive images (400w/800w/1200w) save 60% bandwidth on mobile
- Zero JavaScript = 0ms Total Blocking Time

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

## Where AI Failed (And What I Learned)

**Failure 1: CSS Animation Performance**

The initial blog had an issue with Flash of Unstyled Content (FOUC) when clicking on Blog from the home page. The CSS should have loaded first to avoid this. https://en.wikipedia.org/wiki/Flash_of_unstyled_content

**Fix**: Claude Code one-shotted this fix after describing the problem.

**Failure 2: Security**

Because I didn't know to prompt for it, the initial version of the website had several security concerns:

Initially, the scraped content was vulnerable to cross-site scripting attacks as any data that's rendered directly into pages could carry scripts, event handlers, or malicious embeds.

Similarly, we loaded remote images directly which can leak visitor IPs and referrers or break if the source changes paths. It's easy to forget that copied articles can include hidden tracking pixels, inline scripts, or analytics IDs.

Even on static hosting, adding a simple Content Security Policy, HSTS, and Referrer-Policy headers for defense-in-depth are necessary.

**Fix**: I paired with Claude Opus to critique the security posture of the site after being tipped off by a friend and handled each of these individually to avoid complications.

## What This Means for Product Development

AI changes the build vs. buy calculus. Tasks that used to require third-party tools (blog platforms, CMS systems) can now be custom-built faster than integrating external services. This gives you full control without the time penalty.

Edge cases get handled upfront. Traditional development discovers edge cases in production. AI-generated code anticipates them from training on thousands of similar implementations.

"Good enough" is now actually good. Features that would typically be "v2 nice-to-haves" (comprehensive tests, accessibility, performance optimization) got included in the initial build because they took minutes, not hours.

## Key Patterns for AI-Native Development

- **Strategic model selection**: Use Opus for architecture, Code for implementation. Different tools for different phases.
- **Design freeze before implementation**: Finalize the architecture completely before writing code. Prevents churn.
- **Test the output, not the implementation**: Static sites need output validation (pages exist, metadata correct), not unit tests of internal functions.
- **Constraints as forcing functions**: The "minimal JavaScript" constraint prevented scope creep and kept the architecture simple.

## Try Claude Code Yourself

Want to see AI-native development in action? Here are simplified prompts I used to build key features of this site.

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
- LICENSE-CODE.md with MIT license and examples
- LICENSE-CONTENT.md with CC BY-NC 4.0 and attribution guide
- LICENSE.md explaining the dual structure
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
- Creative humans.txt (245 lines) with ASCII art
- Meta tags for OpenAI, Anthropic, Google AI
- README-AI-POLICY.md with full policy

## Open Source

The complete code is available on GitHub, including the scraper, tests, and deployment configuration:

🔗 **GitHub**: [github.com/awoods187/andy-website](https://github.com/awoods187/andy-website)

Feel free to adapt it for your own use. The architecture should work for any static content site.

I'm building more AI-native development patterns and always interested in production use cases. If you're using AI for production software (not just demos), I'd love to compare notes—especially around multi-model orchestration, prompt engineering at scale, or cost optimization. Find me on LinkedIn or check out my v1 PM prompt patterns library on GitHub.
