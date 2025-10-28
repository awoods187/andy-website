# Project: Andy's Personal Website

**Last Updated:** 2025-10-26

> Inherits from workspace (`~/claude-andyw/.claude/CLAUDE.md`) and global
> (`~/.claude/CLAUDE.md`)

---

## Project-Specific Context

Portfolio and blog website showcasing professional work, technical writing, and
side projects.

---

## Technology Stack

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Analytics**: Privacy-focused (Plausible or similar)
- **CMS**: Git-based (Markdown files)

---

## Key Requirements

### Performance

- Target Lighthouse score: 95+ across all metrics
- Core Web Vitals: All "Good" ratings
- Image optimization: WebP with fallbacks
- Code splitting for optimal bundle size

### SEO

- OpenGraph meta tags for all pages
- Twitter Card support
- Structured data (JSON-LD)
- XML sitemap auto-generated
- robots.txt configured

### Accessibility

- WCAG AA minimum (AAA for text content)
- Tested with VoiceOver and NVDA
- Focus indicators on all interactive elements
- Skip navigation links

### Content

- Blog posts in `/content/blog/`
- Project showcases in `/content/projects/`
- Markdown with frontmatter
- Support for code syntax highlighting
- Support for embedded demos

---

## Development

```bash
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run test       # Run all tests
npm run lint       # Lint and format
```

---

## Deployment

- **Production**: `main` branch → auto-deploy to Vercel
- **Preview**: All PRs get preview deployment
- **Environment**: Set env vars in Vercel dashboard

---

**All workspace and global standards apply. This file contains only
project-unique configurations.**
