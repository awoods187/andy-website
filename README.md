# Andy Woods Personal Website

A modern, minimal personal website built with Astro, featuring a blog, bio, and clean typography. Inspired by tomtunguz.com's aesthetic.

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Fast, content-focused static site generator
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- **Typography**: Space Grotesk (headings) + Merriweather (body)
- **Deployment**: Vercel or Netlify (free tier)
- **Content**: Markdown with frontmatter

## Project Structure

```
/
├── public/              # Static assets (favicon, images, robots.txt)
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogPostCard.astro
│   │   └── Analytics.astro
│   ├── content/
│   │   ├── blog/        # Blog posts in Markdown
│   │   └── config.ts    # Content collection schema
│   ├── layouts/
│   │   └── BaseLayout.astro  # Main page layout
│   ├── pages/
│   │   ├── index.astro       # Home page
│   │   ├── about.astro       # About page
│   │   ├── archive.astro     # Archive by date
│   │   ├── blog/
│   │   │   ├── index.astro   # Blog listing
│   │   │   ├── [slug].astro  # Individual posts
│   │   │   └── tag/[tag].astro  # Tag archives
│   │   └── rss.xml.ts        # RSS feed
│   └── styles/
│       └── global.css        # Global styles & fonts
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── package.json
```

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

### Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run Astro CLI commands |

## Writing Blog Posts

### Creating a New Post

1. Create a new `.md` file in `src/content/blog/`:
```bash
touch src/content/blog/my-new-post.md
```

2. Add frontmatter at the top:
```markdown
---
title: "Your Post Title"
date: 2024-10-19
excerpt: "A brief summary of your post (1-2 sentences)"
tags: ["tag1", "tag2", "tag3"]
draft: false  # Set to true to hide from production
---

Your content here in Markdown...
```

3. Write your post using Markdown syntax

4. Save and the dev server will hot-reload automatically

### Frontmatter Fields

- `title` (required): Post title
- `date` (required): Publication date (YYYY-MM-DD format)
- `excerpt` (required): Brief summary for listings and SEO
- `tags` (required): Array of tags for categorization
- `draft` (optional): Set to `true` to exclude from production

### Markdown Features

- Standard Markdown syntax
- Code blocks with syntax highlighting
- Images (place in `/public/images/`)
- Links, lists, blockquotes, etc.

## Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "New Project" and import your repository

4. Vercel auto-detects Astro - no configuration needed

5. Click "Deploy"

6. Your site is live at `<project-name>.vercel.app`

### Option 2: Deploy to Netlify

1. Push your code to GitHub

2. Go to [netlify.com](https://netlify.com) and sign in with GitHub

3. Click "Add new site" → "Import an existing project"

4. Select your repository

5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`

6. Click "Deploy site"

7. Your site is live at `<project-name>.netlify.app`

## Custom Domain Setup (andywoods.me)

### Network Solutions DNS Configuration

You have the domain `andywoods.me` through Network Solutions. Here's how to connect it:

#### For Vercel:

1. In Vercel dashboard, go to your project → Settings → Domains

2. Add `andywoods.me` and `www.andywoods.me`

3. Vercel will provide DNS records. Go to Network Solutions:
   - Add an `A` record: `@` → `76.76.21.21`
   - Add a `CNAME` record: `www` → `cname.vercel-dns.com`

4. Wait for DNS propagation (can take 24-48 hours)

#### For Netlify:

1. In Netlify dashboard, go to Site settings → Domain management

2. Add custom domain: `andywoods.me`

3. Netlify will provide DNS records. Go to Network Solutions:
   - Add an `A` record: `@` → `75.2.60.5`
   - Add a `CNAME` record: `www` → `<your-site>.netlify.app`

4. Wait for DNS propagation (can take 24-48 hours)

### SSL Certificate

Both Vercel and Netlify automatically provision free SSL certificates via Let's Encrypt. No action needed.

## Analytics Setup

Analytics is configured but commented out. To enable:

### Option 1: Plausible (Privacy-friendly, GDPR compliant)

1. Sign up at [plausible.io](https://plausible.io)

2. Add your domain (`andywoods.me`)

3. Edit `src/components/Analytics.astro`:
```astro
<!-- Uncomment this line: -->
<script defer data-domain="andywoods.me" src="https://plausible.io/js/script.js"></script>
```

4. Redeploy

### Option 2: Google Analytics

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)

2. Get your measurement ID (format: `G-XXXXXXXXXX`)

3. Edit `src/components/Analytics.astro` and replace `G-XXXXXXXXXX` with your ID

4. Uncomment the Google Analytics script

5. Redeploy

## SEO Features

✅ Semantic HTML structure
✅ OpenGraph tags for social sharing
✅ Twitter Card tags
✅ Sitemap.xml (auto-generated at build)
✅ robots.txt
✅ RSS feed at `/rss.xml`
✅ Canonical URLs
✅ Meta descriptions

## Maintenance

### Updating Dependencies

```bash
npm update
```

### Adding Blog Posts

Just create a new `.md` file in `src/content/blog/` and push to GitHub. CI/CD will automatically rebuild and deploy.

### Changing Styles

- Global styles: `src/styles/global.css`
- Component styles: Individual `.astro` files
- Tailwind config: `tailwind.config.mjs`

### Changing Bio/Content

- Home page bio: `src/pages/index.astro`
- Full bio: `src/pages/about.astro`
- Footer links: `src/components/Footer.astro`
- Header navigation: `src/components/Header.astro`

## Future Enhancements (Not Yet Implemented)

These features are structured to be easily added later:

- [ ] Newsletter signup (ConvertKit, Substack, etc.)
- [ ] Projects/portfolio section
- [ ] Search functionality (Algolia, Pagefind)
- [ ] Comments system (Giscus, Utterances)
- [ ] View counter per post
- [ ] Dark mode toggle
- [ ] Blog post series/collections

## Performance

This site is optimized for performance:

- ⚡ Zero JavaScript by default
- 📦 Minimal CSS bundle via Tailwind
- 🚀 Static HTML files served from CDN
- 🖼️ Optimized fonts via Google Fonts
- 📱 Mobile responsive

Expected Lighthouse scores: 95-100 across all categories.

## Troubleshooting

### Build fails with TypeScript errors

Run `npm run astro check` to see detailed errors. Usually frontmatter schema issues.

### Changes not appearing on deployed site

1. Check build logs in Vercel/Netlify
2. Ensure changes are pushed to the correct branch (usually `main`)
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

### Custom domain not working

1. Check DNS settings in Network Solutions
2. DNS propagation takes 24-48 hours
3. Use [dnschecker.org](https://dnschecker.org) to verify propagation

## Support

For Astro documentation: [docs.astro.build](https://docs.astro.build)

For deployment help:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)

---

Built with ❤️ using [Astro](https://astro.build)
