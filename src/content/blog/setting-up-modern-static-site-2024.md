---
title: "Setting Up a Modern Static Site in 2024"
date: 2024-10-15
excerpt: "Why I chose Astro for my personal website, and how static site generators have evolved to become the perfect choice for content-focused sites."
tags: ["web-development", "astro", "static-sites"]
---

Building a personal website in 2024 is easier than ever, but the number of options can be overwhelming. After evaluating several frameworks, I landed on Astro for my site. Here's why.

## The Static Site Renaissance

Static site generators aren't new—Jekyll and Hugo have been around for over a decade. But modern frameworks like Astro represent a significant evolution in how we think about static sites.

The key insight: **most content sites don't need JavaScript**. Yet traditional React or Vue frameworks ship megabytes of JS even for simple blogs. Astro flips this model by defaulting to zero JavaScript, only adding interactivity where needed.

## Why Astro?

After years of building complex React applications, I wanted something simple for my personal site. Here's what sold me on Astro:

### 1. Performance by Default

Astro ships zero JavaScript by default. For a blog, this means instant page loads and perfect Lighthouse scores without any optimization work. Pages are pre-rendered at build time and served as static HTML.

### 2. Content Collections

Astro's content collections provide type-safe frontmatter and automatic validation. No more typos in blog post metadata breaking your build:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
  }),
});
```

### 3. Markdown & MDX Support

Writing in Markdown is a joy. MDX support means I can embed interactive components when needed, but most posts are just pure Markdown.

### 4. Bring Your Own Framework

Need React for an interactive component? Astro's component islands let you use React, Vue, Svelte, or whatever you want—but only ship JS for those specific components.

## The Setup

Getting started took less than 30 minutes:

1. `npm create astro@latest`
2. Add Tailwind CSS integration
3. Configure content collections
4. Write posts in Markdown
5. Deploy to Vercel

The DX (developer experience) is phenomenal. Hot reload is instant, the build is fast, and deployment just works.

## Lessons Learned

**Start simple.** I could have built this in Next.js or added a headless CMS. But simple Markdown files in git are easier to maintain, version control is built-in, and I can write posts in my favorite editor.

**Optimize for writing, not engineering.** The best blog is one you actually write on. Removing friction in the publishing process matters more than having the perfect tech stack.

**Static sites scale infinitely.** Deployed to a CDN, this site can handle any amount of traffic. No database, no servers, no scaling concerns.

## What's Next?

I'm planning to add:
- RSS feed for subscribers
- Newsletter integration
- Better code highlighting for technical posts
- Analytics to see what resonates

But the core is done, and I'm excited to start writing more.

---

If you're building a personal site or blog in 2024, seriously consider Astro. The performance, DX, and simplicity are hard to beat.
