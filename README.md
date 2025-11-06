# Andy Woods Personal Website

Fast, content-focused personal site with automated external blog aggregation,
zero-JS architecture, and professional SEO optimization built with Astro.

## 📊 Project Status

![Build](https://img.shields.io/github/actions/workflow/status/awoods187/andy-website/ci.yml?branch=main)
![License](https://img.shields.io/badge/license-Dual%20MIT%2FCC--BY--NC-blue)
![Maintenance](https://img.shields.io/badge/maintenance-active-brightgreen)

**Status**: Production • Live at [andywoods.me](https://andywoods.me)

---

## 🎯 Why This Exists

This is a repo for my personal website: andywoods.me. It's also an open-source
repo for other professionals to build their own blogs.

**Problem**: Tech professionals publish across multiple platforms (personal
blog, company blog, publications), creating fragmented portfolios and duplicate
content penalties.

**Solution**: Automated content aggregation system that pulls from multiple
sources while maintaining attribution, SEO optimization, and sub-50ms page
loads.

**Key Benefits**:

- Unified portfolio without duplicate content penalties
- Static-first architecture: <$5/month hosting, 50ms CDN response times
- Automated external content scraping with security sanitization
- Zero runtime JavaScript for maximum performance

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/awoods187/andy-website.git
cd andy-website
npm install

# Start development server
npm run dev
# → http://localhost:4321
```

**Next steps**: See [Writing Blog Posts](#writing-blog-posts) or
[Deployment](#deployment)

---

## 📋 Prerequisites

| Tool    | Version          | Verification        |
| ------- | ---------------- | ------------------- |
| Node.js | 18+              | `node --version`    |
| npm     | 9+               | `npm --version`     |
| Python  | 3.10+ (optional) | `python3 --version` |

**Note**: Python only required for automated blog scraping.

---

## 🔧 Tech Stack

| Category       | Technology             | Purpose                        |
| -------------- | ---------------------- | ------------------------------ |
| **Framework**  | Astro 5                | Zero-JS static site generation |
| **Styling**    | Tailwind CSS 4         | Utility-first CSS framework    |
| **Validation** | Zod                    | Type-safe content schema       |
| **Testing**    | Vitest                 | Build output validation        |
| **Scraping**   | Python + BeautifulSoup | External content aggregation   |
| **Deployment** | Vercel/Netlify         | CDN hosting                    |

---

## 📖 Usage

### Writing Blog Posts

Create `src/content/blog/my-post.md`:

```markdown
---
title: 'Your Post Title'
date: 2024-10-21
excerpt: 'Brief 1-2 sentence summary for SEO'
tags: ['ai', 'databases']
image: '/images/my-post.jpg' # Optional
draft: false
---

Your Markdown content here...
```

**See**: [Full Writing Guide](#writing-blog-posts-1) for frontmatter schema and
external post integration.

### Development Commands

| Command           | Purpose                           |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start dev server (localhost:4321) |
| `npm run build`   | Production build → `./dist/`      |
| `npm test`        | Run test suite                    |
| `npm run preview` | Preview production build          |

---

## 🏗️ Architecture Overview

**Static-First Pipeline**:

1. Personal posts (Markdown) + External posts (Python scraper) → TypeScript data
2. Zod validation at build time
3. Astro generates static HTML
4. Deploy to CDN (Vercel/Netlify)

**Key Trade-offs**:

- ✅ Sub-50ms response times, $5/month hosting, zero security vulnerabilities
- ❌ Content updates require rebuild (acceptable for weekly publishing)

**Security**: HTML sanitization via `bleach`, CSP headers, no inline scripts.
See [Security](#security--compliance) for details.

---

<details>
<summary>📁 Project Structure</summary>

```
andy-website/
├── src/                  # Source code
│   ├── components/        # Reusable Astro components
│   ├── content/
│   │   ├── blog/         # Personal Markdown posts
│   │   └── config.ts     # Zod content schema
│   ├── data/
│   │   └── crl-posts.ts  # External blog data
│   ├── layouts/          # Base page templates
│   ├── pages/            # Route pages
│   └── styles/           # Global CSS + Tailwind
├── docs/                 # Project documentation
│   ├── setup/            # Setup guides (Buttondown, CI, etc.)
│   ├── licenses/         # License details
│   ├── CONTENT-GUIDE.md
│   ├── DEPLOYMENT.md
│   ├── MAINTENANCE.md
│   ├── TROUBLESHOOTING.md
│   └── VISUAL_STYLE_GUIDE.md
├── config/               # Deployment configuration
│   └── vercel.json
├── scripts/              # Utility scripts
│   └── scrape-crl-posts.py
├── tests/                # Test files
├── public/               # Static assets
├── reports/              # Generated reports (gitignored)
│   └── lighthouse/
├── astro.config.mjs      # Astro configuration
├── eslint.config.js      # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Vitest configuration
└── package.json          # Dependencies and scripts
```

</details>

---

## Writing Blog Posts

### Personal Posts

1. Create file in `src/content/blog/`
2. Add required frontmatter: `title`, `date`, `excerpt`, `tags`
3. Write Markdown content
4. Preview with `npm run dev`

### External Posts (Cockroach Labs)

**Manual** (1-2 posts): Edit `src/data/crl-posts.ts` and add entry to array.

**Automated** (bulk updates):

```bash
python3 scripts/scrape-crl-posts.py
# → Generates updated src/data/crl-posts.ts
```

**See**: Lines 217-254 in original README for detailed schema.

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub: `git push origin main`
2. Import repository at [vercel.com](https://vercel.com)
3. Auto-detects Astro configuration
4. Deploy → Live at `<project>.vercel.app`

**Custom Domain**: Add DNS A record to `76.76.21.21`, CNAME `www` →
`cname.vercel-dns.com`

### Netlify

Build command: `npm run build` • Publish directory: `dist`

**See**: Lines 350-439 in original README for full DNS setup.

---

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Current Coverage**: 349/349 tests passing across 17 test suites

- Build output validation (30 pages)
- Content schema validation
- RSS feed generation
- Open Graph meta tags validation
- Security headers and CSP
- Accessibility (WCAG compliance)
- Blog formatting consistency
- Dependency health checks

---

## 🔐 Security & Compliance

**Security Measures**:

- HTML sanitization via Python `bleach` library (strips `<script>`, event
  handlers, tracking pixels)
- Strict CSP headers via `vercel.json` (`X-Frame-Options: DENY`, HSTS)
- No hardcoded secrets (`.env` + `.gitignore`)
- Static output eliminates SQL injection, auth vulnerabilities

**Trade-off**: CSP includes `'unsafe-inline'` for Astro scoped styles
(acceptable for static site with no user-generated content).

**Vulnerability Reporting**: Contact via
[LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)

---

## 📈 Performance & Scalability

**Production Metrics** (Lighthouse Mobile, Slow 4G):

- Performance: 89/100
- Accessibility: 95/100
- Best Practices: 100/100 ⭐
- SEO: 100/100 ⭐

**Core Web Vitals**:

- FCP: 1.1s • LCP: 3.7s • TBT: 0ms • CLS: 0.061

**Bundle Sizes**:

- HTML: 9-20KB per page
- CSS: 4KB gzipped (shared)
- JS: 0KB for blog pages

**Scalability**: Static CDN architecture handles 10K+ requests/sec. Not suitable
for real-time features or search (requires JS or external service).

---

## 🤝 Support & Ownership

- **Owner**: Andy Woods •
  [andrewscottwoods@gmail.com](mailto:andrewscottwoods@gmail.com)
- **Issues**: [GitHub Issues](https://github.com/awoods187/andy-website/issues)
- **Contact**: [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) |
  [X/Twitter](https://twitter.com/iamandywoods)

---

## 📅 Maintenance Status

- **Last Updated**: 2025-01-21
- **Update Frequency**: Bi-weekly (content), quarterly (dependencies)
- **EOL Date**: None planned

**Maintenance SLA**: Security patches within 48 hours, dependency updates
quarterly, content updates as needed.

---

## 🎨 Customization

| Change        | Location                         |
| ------------- | -------------------------------- |
| Home bio      | `src/pages/index.astro`          |
| Profile photo | `public/profile.jpg`             |
| Navigation    | `src/components/Header.astro`    |
| Colors/fonts  | `src/styles/global.css`          |
| Analytics     | `src/components/Analytics.astro` |

**Visual Branding**: See `VISUAL_STYLE_GUIDE.md` for WPA poster aesthetic
guidelines and image generation prompts.

---

## 📄 License

**Dual License Structure**:

- **Code** (MIT): Free to use, modify, redistribute commercially
- **Content** (CC BY-NC 4.0): Quote with attribution, non-commercial use

**Special Exception**: AI training permitted on all content (including
commercial models).

**See**: `LICENSE.md` for full details • External Cockroach Labs posts retain
original © Cockroach Labs.

---

## 📚 Additional Documentation

- **Visual Style Guide**: `VISUAL_STYLE_GUIDE.md` - Brand-consistent image
  generation
- **Code Review**: `CODE_REVIEW.md` - Security audit summary
- **Environment Setup**: `.env.example` - Configuration template
- **AI Training Policy**: `README-AI-POLICY.md` - Explicit AI permissions

**External Resources**:

- Astro: [docs.astro.build](https://docs.astro.build)
- Tailwind: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- Design inspiration: [tomtunguz.com](https://tomtunguz.com)

---

## 👨‍💻 About

**Andy Woods** • Director of Product Management at Cockroach Labs

Built with [Astro](https://astro.build) and
[Claude Code](https://claude.com/claude-code) in under 4 hours using AI-native
development practices.

**Connect**: [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) •
[GitHub](https://github.com/awoods187) •
[X/Twitter](https://twitter.com/iamandywoods)
