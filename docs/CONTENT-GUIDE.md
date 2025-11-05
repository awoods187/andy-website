# Content Writing Guide

Comprehensive guide for writing, formatting, and publishing blog posts on
andy-website.

---

## Quick Reference

**Personal Post**: Create Markdown file in `src/content/blog/` **External
Post**: Add to `src/data/crl-posts.ts` or run scraper

---

## Writing Personal Blog Posts

### Step-by-Step

1. **Create Markdown file**

   ```bash
   touch src/content/blog/my-new-post.md
   ```

2. **Add frontmatter**

   ```markdown
   ---
   title: 'Your Post Title'
   date: 2024-10-21
   excerpt: 'Compelling 1-2 sentence summary for SEO and listings'
   tags: ['ai', 'databases', 'product-management']
   image: '/images/blog/my-post.jpg'
   imageSource: 'AI-generated using Stable Diffusion'
   license: 'CC BY-NC 4.0'
   copyright: '© 2025 Andy Woods'
   attribution:
     'If you quote or translate this post, please provide attribution with a
     link back to the original at andywoods.me'
   draft: false
   ---
   ```

3. **Write content** using Markdown
4. **Preview**: Dev server auto-reloads at `localhost:4321`
5. **Publish**: Set `draft: false` and deploy

---

## Frontmatter Schema

### Required Fields

| Field     | Type     | Format             | Description                               |
| --------- | -------- | ------------------ | ----------------------------------------- |
| `title`   | string   | Plain text         | Post title (used in `<h1>` and meta tags) |
| `date`    | Date     | YYYY-MM-DD         | Publication date                          |
| `excerpt` | string   | 1-2 sentences      | Brief summary for SEO and listings        |
| `tags`    | string[] | `["tag1", "tag2"]` | Array of lowercase, hyphenated tags       |

### Optional Fields

| Field         | Type    | Default                    | Description                             |
| ------------- | ------- | -------------------------- | --------------------------------------- |
| `image`       | string  | `/images/default-post.svg` | Featured image (relative to `/public/`) |
| `imageSource` | string  | -                          | Attribution for image source            |
| `license`     | string  | `CC BY-NC 4.0`             | Content license                         |
| `copyright`   | string  | `© 2025 Andy Woods`       | Copyright notice                        |
| `attribution` | string  | -                          | Attribution instructions                |
| `draft`       | boolean | `false`                    | If `true`, post hidden in production    |

---

## Markdown Formatting

### Headings

```markdown
## Main Section (H2)

### Subsection (H3)

#### Detail (H4)
```

**Best practices**:

- Start with H2 (H1 is auto-generated from `title`)
- Use hierarchical structure (H2 → H3 → H4)
- Keep headings concise (5-8 words max)

### Code Blocks

````markdown
```typescript
// Specify language for syntax highlighting
const greeting: string = 'Hello, world!';
console.log(greeting);
```
````

**Supported languages**: `typescript`, `javascript`, `python`, `bash`, `sql`,
`json`, `yaml`, `markdown`

### Links

```markdown
[Link text](https://example.com) [Internal link](/blog/other-post)
```

### Images

```markdown
![Alt text](/images/screenshot.png)
```

**Image optimization**:

- Use WebP format when possible
- Compress images (<200KB for blog posts)
- Use descriptive alt text for accessibility
- Store in `/public/images/blog/`

### Lists

```markdown
**Unordered**:

- Item one
- Item two
  - Nested item

**Ordered**:

1. First step
2. Second step
3. Third step
```

### Blockquotes

```markdown
> This is a blockquote spanning multiple lines.
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

---

## Tags

### Tag Guidelines

- **Lowercase**: `ai`, `databases`, `product-management`
- **Hyphenated**: Use hyphens for multi-word tags
- **Specific**: Prefer `distributed-systems` over `systems`
- **Limit**: 3-7 tags per post (optimal for SEO)

### Common Tags

- Technical: `ai`, `databases`, `distributed-systems`, `python`, `typescript`,
  `web-development`
- Product: `product-management`, `strategy`, `pricing`, `go-to-market`
- Process: `architecture`, `testing`, `deployment`, `ci-cd`

---

## SEO Optimization

### Title Best Practices

- **Length**: 50-60 characters (truncates in search results)
- **Format**: `How to [action] [benefit]` or
  `Why [concept] matters for [audience]`
- **Keywords**: Include primary keyword in first 3 words
- **Unique**: Differentiate from existing content

### Excerpt Best Practices

- **Length**: 120-160 characters (search snippet length)
- **Hook**: Lead with compelling value proposition
- **Keywords**: Include 1-2 primary keywords naturally
- **CTA**: End with reason to read ("Learn how...", "Discover...")

### URL Slugs

Auto-generated from title, following pattern:

```
/blog/how-to-build-blog-astro-claude-code
```

**Manual override** (if needed): Rename Markdown file to desired slug

---

## Adding External Blog Posts

### Manual Entry (1-2 posts)

Edit `src/data/crl-posts.ts`:

```typescript
{
  title: 'Your Blog Post Title',
  url: 'https://www.cockroachlabs.com/blog/your-post-slug',
  date: '2024-10-21',
  image: 'https://images.ctfassets.net/.../image.png',
  excerpt: 'Brief summary of the post content (1-2 sentences).',
  source: 'cockroach-labs',
  tags: ['databases', 'distributed-systems'],
}
```

### Automated Scraping (Bulk updates)

```bash
# Install Python dependencies (first time only)
pip install -r requirements.txt

# Run scraper
python3 scripts/scrape-crl-posts.py

# Review changes
git diff src/data/crl-posts.ts

# Commit if accurate
git add src/data/crl-posts.ts
git commit -m "chore: update Cockroach Labs blog posts"
```

**Scraper details**:

- Fetches from `https://www.cockroachlabs.com/author/andy-woods/`
- Extracts: title, URL, date, image, excerpt, tags
- Sanitizes HTML (strips scripts, tracking pixels)
- Validates against schema
- Generates TypeScript-compatible output

---

## Image Generation

### Visual Style

**Brand aesthetic**: Vintage WPA National Parks Poster × Retro-Futurism

**See**: `VISUAL_STYLE_GUIDE.md` for:

- Complete style prompt templates
- Color palette (hex codes)
- Subject templates (AI, databases, cloud, innovation)
- Generation instructions

### Quick Start

1. **Choose subject template** from `VISUAL_STYLE_GUIDE.md`
2. **Generate with AI tool** (Midjourney, DALL-E, Stable Diffusion)
3. **Save as WebP** (optimize to <200KB)
4. **Add to** `/public/images/blog/`
5. **Reference in frontmatter**: `image: "/images/blog/my-post.jpg"`

---

## Newsletter Integration

### Automated Email Notifications

Posts auto-send to email subscribers via:

1. RSS feed updates (`/rss.xml`)
2. Buttondown imports RSS daily
3. New posts → automated email to subscribers

**No manual action required** after initial Buttondown setup.

### RSS Feed

Auto-generated at `/rss.xml` including:

- All personal blog posts
- External Cockroach Labs posts
- Publication links
- Full post content (for feed readers)

---

## Publishing Checklist

Before setting `draft: false`:

- [ ] Title is SEO-optimized (50-60 chars)
- [ ] Excerpt is compelling (120-160 chars)
- [ ] Tags are specific and lowercase
- [ ] Featured image added and optimized
- [ ] Code blocks have language specified
- [ ] Links are valid (no 404s)
- [ ] Images have descriptive alt text
- [ ] Headings follow hierarchy (H2 → H3 → H4)
- [ ] Spell check passed
- [ ] Preview looks good in dev server
- [ ] Build succeeds: `npm run build`

---

## Content Style Guide

### Voice & Tone

- **Professional but approachable**: Avoid jargon, explain technical concepts
  clearly
- **Action-oriented**: Use active voice, imperative verbs
- **Concise**: Respect reader's time, get to the point
- **Authentic**: Share real experiences, lessons learned

### Technical Writing

- **Assume competence**: Don't over-explain basics
- **Code examples**: Runnable, complete, production-quality
- **Specificity**: Concrete examples over abstract theory
- **Balance**: Theory + practical application

### Audience

**Primary**: Product managers, engineering leaders, technical professionals

**Secondary**: AI/ML practitioners, database engineers, startup founders

---

## Common Mistakes

### ❌ Avoid

- Philosophical content without actionable takeaways
- Wall-of-text paragraphs (break into lists, tables)
- Missing code language specification
- Redundant explanations
- Generic titles ("Introduction to X")
- Over-using emojis in body text

### ✅ Do

- Lead with value proposition
- Use visual hierarchy (headings, bullets, tables)
- Specify language in code blocks
- Trust reader intelligence
- Specific, keyword-rich titles
- Professional tone throughout

---

## Maintenance

### Content Updates

When updating existing posts:

1. Edit Markdown file
2. Update `date` if substantial changes
3. Add "Last updated" note at bottom (optional)
4. Rebuild and deploy

### Archive Strategy

No archival needed - static site supports unlimited posts.

**Performance**: 100+ posts will still build in <30 seconds.

---

**Last Updated**: 2025-01-21
