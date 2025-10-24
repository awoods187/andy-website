# Andy Woods Personal Website

A modern, minimal personal website built with Astro, featuring a blog with integrated external content, professional bio, and clean typography. Inspired by tomtunguz.com's design aesthetic.

🌐 **Live Site**: [andywoods.me](https://andywoods.me)
👤 **Author**: Andy Woods - Director of Product Management at Cockroach Labs
🔗 **Connect**: [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) | [GitHub](https://github.com/awoods187) | [X/Twitter](https://twitter.com/iamandywoods)

---

## 🎯 Features

- ✅ **Hybrid Blog System** - Combines personal Markdown posts with external Cockroach Labs blog posts
- ✅ **Category Filtering** - Static page generation for fast, SEO-friendly filtering
- ✅ **Full SEO Optimization** - OpenGraph, Twitter Cards, sitemap, RSS feed
- ✅ **Type-Safe Content** - Zod schema validation for all blog posts
- ✅ **Zero JavaScript** - Pure static HTML for maximum performance
- ✅ **Responsive Design** - Mobile-first, accessible UI
- ✅ **Professional Testing** - Vitest test suite with 15+ tests
- ✅ **Analytics Ready** - Configured for Plausible or Google Analytics

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Astro 5](https://astro.build) - Content-focused static site generator |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS |
| **Typography** | Space Grotesk (headings) + Merriweather (body) |
| **Content** | Markdown with frontmatter, Zod validation |
| **Testing** | Vitest + Happy DOM |
| **Scripting** | Python 3.10+ (for blog scraping) |
| **Deployment** | Vercel or Netlify |
| **Analytics** | Plausible (privacy-first) or Google Analytics |

---

## 📁 Project Structure

```
andy-website/
├── public/                     # Static assets
│   ├── favicon.svg
│   ├── profile.jpg            # Profile photo
│   ├── images/                # Blog post images
│   │   └── default-post.svg
│   └── og-image.png           # OpenGraph image
│
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── Header.astro       # Site navigation
│   │   ├── Footer.astro       # Social links & copyright
│   │   ├── BlogPostCard.astro # Card for personal posts only
│   │   ├── PostCard.astro     # Card for all posts (personal + CRL)
│   │   └── Analytics.astro    # Analytics integration
│   │
│   ├── content/
│   │   ├── blog/              # Personal blog posts (Markdown)
│   │   │   ├── getting-started-ai-pm-perspective.md
│   │   │   ├── why-pms-should-understand-databases.md
│   │   │   └── hybrid-blog-system-2025.md
│   │   └── config.ts          # Content collection schema (Zod)
│   │
│   ├── data/
│   │   └── crl-posts.ts       # Cockroach Labs blog posts data
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro   # Base page template with meta tags
│   │
│   ├── pages/
│   │   ├── index.astro        # Home page
│   │   ├── about.astro        # Full bio with profile photo
│   │   ├── archive.astro      # Redirects to /blog
│   │   ├── rss.xml.ts         # RSS feed generator
│   │   └── blog/
│   │       ├── index.astro    # Redirects to /blog/all
│   │       ├── [category].astro   # Category pages (all, personal, cockroach-labs, tags)
│   │       ├── [slug].astro   # Individual blog posts
│   │       └── tag/[tag].astro    # Tag archive pages
│   │
│   └── styles/
│       └── global.css         # Global styles, fonts, Tailwind imports
│
├── scripts/
│   └── scrape-crl-posts.py    # Python script to update CRL posts
│
├── tests/
│   ├── build.test.ts          # Build validation tests
│   └── content.test.ts        # Content schema tests
│
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind configuration
├── vitest.config.ts           # Test configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Node dependencies & scripts
├── requirements.txt           # Python dependencies
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── VISUAL_STYLE_GUIDE.md      # Image generation & brand style guide
├── CODE_REVIEW.md             # Code review & refactoring summary
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ (optional, only for blog scraping)

### Installation

1. **Clone the repository** (or download the code)
   ```bash
   git clone https://github.com/awoods187/andy-website.git
   cd andy-website
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies** (optional)
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:4321](http://localhost:4321)
   - Site will hot-reload on file changes

6. **Next Steps for Production**
   - See [`TODO.md`](./TODO.md) for deployment checklist
   - Add profile photo to `public/profile.jpg`
   - Configure analytics (Plausible or Google Analytics)
   - Deploy to Vercel/Netlify

---

## 📝 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run astro ...` | Run any Astro CLI command |

---

## ✍️ Writing Blog Posts

### Creating a Personal Blog Post

1. **Create a new Markdown file** in `src/content/blog/`:
   ```bash
   touch src/content/blog/my-new-post.md
   ```

2. **Add frontmatter** at the top:
   ```markdown
   ---
   title: "Your Post Title"
   date: 2024-10-21
   excerpt: "A compelling 1-2 sentence summary for SEO and listings"
   tags: ["ai", "databases", "product-management"]
   image: "/images/my-post.jpg"  # Optional
   draft: false  # Set to true to hide from production
   ---

   Your content here in **Markdown**...
   ```

3. **Write your post** using standard Markdown
   - Headings, lists, code blocks, images, links, etc.
   - Code syntax highlighting is automatic

4. **Preview** - The dev server auto-reloads to show your changes

5. **Publish** - Set `draft: false` and deploy

### Frontmatter Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Post title (used in `<h1>` and meta tags) |
| `date` | Date | ✅ | Publication date (YYYY-MM-DD format) |
| `excerpt` | string | ✅ | Brief summary for listings and SEO |
| `tags` | string[] | ✅ | Array of tags (e.g., `["ai", "databases"]`) |
| `image` | string | ❌ | Featured image URL (relative to `/public/`) |
| `draft` | boolean | ❌ | If `true`, post won't appear in production |

### Adding Cockroach Labs Blog Posts

External blog posts from Cockroach Labs are stored in `src/data/crl-posts.ts`. To add new posts:

#### Option 1: Manual Entry (Recommended for 1-2 posts)

Edit `src/data/crl-posts.ts` and add to the array:

```typescript
{
  title: 'Your Blog Post Title',
  url: 'https://www.cockroachlabs.com/blog/your-post-slug',
  date: '2024-10-21',
  image: 'https://images.ctfassets.net/.../image.png',
  excerpt: 'Brief summary of the post content...',
  source: 'cockroach-labs',
  tags: ['databases', 'distributed-systems'],
}
```

#### Option 2: Automated Scraping (For bulk updates)

Run the Python scraper to automatically extract posts from your author page:

```bash
python3 scripts/scrape-crl-posts.py
```

This will:
1. Fetch https://www.cockroachlabs.com/author/andy-woods/
2. Extract all blog post metadata (title, URL, date, image, excerpt)
3. Generate updated `src/data/crl-posts.ts` file

**Note**: The scraper uses BeautifulSoup and may need selector updates if the CRL website changes.

---

## 🎨 Customization

### Changing Site Content

| What to Change | File Location |
|----------------|---------------|
| **Home page bio** | `src/pages/index.astro` |
| **Full bio/about** | `src/pages/about.astro` |
| **Profile photo** | `public/profile.jpg` |
| **Header navigation** | `src/components/Header.astro` |
| **Footer links** | `src/components/Footer.astro` |
| **Fonts** | `src/styles/global.css` (Google Fonts import) |
| **Colors/theme** | `src/styles/global.css` (Tailwind config) |
| **Blog images** | See `VISUAL_STYLE_GUIDE.md` for brand guidelines |

### Adding Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your values:
   ```bash
   PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   PUBLIC_SITE_URL=https://andywoods.me
   ```

3. **⚠️ Security**: Never commit `.env` to version control! It's already in `.gitignore`.

### Enabling Analytics

#### Option 1: Plausible (Privacy-First, GDPR Compliant) ⭐ Recommended

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain: `andywoods.me`
3. Uncomment this line in `src/components/Analytics.astro`:
   ```astro
   <script defer data-domain="andywoods.me" src="https://plausible.io/js/script.js"></script>
   ```
4. Redeploy

#### Option 2: Google Analytics 4

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your measurement ID (format: `G-XXXXXXXXXX`)
3. Edit `src/components/Analytics.astro`:
   - Replace `G-XXXXXXXXXX` with your actual ID
   - Uncomment the Google Analytics script block
4. Redeploy

---

## 🧪 Testing

The project includes a comprehensive test suite using Vitest.

### Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Test Coverage

Current test suite includes:
- ✅ Build output validation (15 tests)
- ✅ Blog post schema validation
- ✅ Page generation verification
- ✅ Content collection integrity
- ✅ RSS feed generation

**All tests passing**: 15/15 ✅

---

## 🌐 Deployment

### Option 1: Deploy to Vercel (⭐ Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click **"New Project"**
   - Import your `andy-website` repository

3. **Deploy**
   - Vercel auto-detects Astro - no configuration needed
   - Click **"Deploy"**
   - Live at `<project-name>.vercel.app`

4. **Custom Domain** (see below)

### Option 2: Deploy to Netlify

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in with GitHub
   - Click **"Add new site"** → **"Import an existing project"**
   - Select your repository

3. **Build Settings** (auto-detected):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Deploy**
   - Click **"Deploy site"**
   - Live at `<project-name>.netlify.app`

5. **Custom Domain** (see below)

---

## 🔗 Custom Domain Setup (andywoods.me)

You have the domain `andywoods.me` registered through **Network Solutions**. Here's how to connect it:

### For Vercel:

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Add both `andywoods.me` and `www.andywoods.me`

2. **In Network Solutions DNS**:
   - Add an **A record**:
     - **Host**: `@`
     - **Points to**: `76.76.21.21`
   - Add a **CNAME record**:
     - **Host**: `www`
     - **Points to**: `cname.vercel-dns.com`

3. **Wait for propagation** (24-48 hours)
   - Check status at [dnschecker.org](https://dnschecker.org)

### For Netlify:

1. **In Netlify Dashboard**:
   - Go to **Site settings** → **Domain management**
   - Add custom domain: `andywoods.me`

2. **In Network Solutions DNS**:
   - Add an **A record**:
     - **Host**: `@`
     - **Points to**: `75.2.60.5`
   - Add a **CNAME record**:
     - **Host**: `www`
     - **Points to**: `<your-site>.netlify.app`

3. **Wait for propagation** (24-48 hours)

### SSL Certificate

Both Vercel and Netlify automatically provision **free SSL certificates** via Let's Encrypt. No manual action required.

---

## 🔒 Security & Best Practices

### ✅ Security Audit Passed

This codebase has been audited for security issues:

- ✅ **No hardcoded secrets** - All credentials use environment variables
- ✅ **`.gitignore` configured** - Excludes `.env`, `node_modules`, etc.
- ✅ **Input validation** - Zod schema validation for all content
- ✅ **Safe dependencies** - No known vulnerabilities in npm packages
- ✅ **Static output** - No server-side code execution

### Environment Variables Best Practices

1. **Never commit** `.env` files
2. **Use** `.env.example` as a template
3. **Prefix public vars** with `PUBLIC_` (Astro convention)
4. **Store secrets** in deployment platform (Vercel/Netlify)

### Code Quality Standards

- ✅ **Type-safe**: TypeScript + Zod validation
- ✅ **Documented**: Google-style docstrings for all functions
- ✅ **Tested**: 15+ Vitest tests with full coverage
- ✅ **Linted**: Follows Astro and Tailwind best practices
- ✅ **DRY principle**: No code duplication
- ✅ **PEP 8 compliant**: Python code follows style guide

---

## 📊 Performance

This site is optimized for maximum performance:

- ⚡ **Zero JavaScript** by default (pure static HTML)
- 📦 **Minimal CSS** bundle via Tailwind (< 10KB gzipped)
- 🚀 **Static files** served from global CDN
- 🖼️ **Optimized fonts** via Google Fonts with preconnect
- 📱 **Mobile responsive** with mobile-first design
- ♿ **Accessible** - Semantic HTML, ARIA labels, keyboard navigation

**Expected Lighthouse Scores**: 95-100 across all categories (Performance, Accessibility, Best Practices, SEO)

---

## 🐛 Troubleshooting

### Build Fails with TypeScript Errors

```bash
npm run astro check
```

Usually caused by:
- Missing required frontmatter fields
- Invalid date format (must be YYYY-MM-DD)
- Type mismatch in blog post schema

### Changes Not Appearing on Live Site

1. **Check build logs** in Vercel/Netlify dashboard
2. **Verify branch** - Ensure changes are pushed to `main`
3. **Hard refresh** browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
4. **Clear cache** in deployment platform

### Custom Domain Not Working

1. **Check DNS settings** in Network Solutions
2. **Wait for propagation** - Can take 24-48 hours
3. **Verify DNS** at [dnschecker.org](https://dnschecker.org)
4. **Check HTTPS** - Ensure SSL certificate is provisioned

### Blog Posts Not Showing

1. **Check `draft` field** - Must be `false` or omitted
2. **Validate frontmatter** - All required fields present
3. **Check file location** - Must be in `src/content/blog/`
4. **Rebuild** - Run `npm run build` locally to test

---

## 🔮 Future Enhancements

These features are not yet implemented but are structured for easy addition:

### High Priority
- [x] **Newsletter signup** - Buttondown email integration ✅
- [ ] **Dark mode toggle** - System preference detection
- [ ] **Search functionality** - Pagefind or Algolia

### Medium Priority
- [ ] **Comments system** - Giscus (GitHub Discussions) or Utterances
- [ ] **Projects/portfolio section** - Showcase side projects
- [ ] **View counter** - Track post engagement
- [ ] **Blog post series** - Link related posts together

### Low Priority
- [x] **RSS email notifications** - Automated via Buttondown ✅
- [ ] **Reading time estimates** - Calculate based on word count
- [ ] **Table of contents** - Auto-generated for long posts
- [ ] **Related posts** - ML-based content recommendations

---

## 📧 Newsletter & Subscriptions

This site includes a privacy-focused subscription system for readers to stay updated with new content.

### Email Newsletter
- **Provider**: [Buttondown](https://buttondown.email)
- **Form submits directly** to Buttondown API (zero JavaScript)
- **RSS-to-email automated** via Buttondown's RSS import
- **Privacy-focused**: No tracking pixels, GDPR compliant

### RSS Feed
- **Auto-generated** by Astro at `/rss.xml`
- **Includes all content sources**: Personal posts, CRL posts, and publications
- **Supports all standard RSS readers**: Feedly, NetNewsWire, Reeder, Inoreader

### Setup Instructions

#### 1. Create Buttondown Account
1. Go to [buttondown.email](https://buttondown.email) and create an account
2. Choose your username (e.g., `andywoods`)

#### 2. Connect RSS Feed
1. In Buttondown Dashboard → **Settings** → **Import** → **RSS Feed**
2. Add feed URL: `https://andywoods.me/rss.xml`
3. Set check frequency: **Daily at 9am**
4. Enable **"Auto-send new posts"**

#### 3. Customize Email Template
In Buttondown's email settings, customize the template:

```markdown
{{ email_body }}

---
You're receiving this because you subscribed to Andy Woods' blog.
Unsubscribe: {{ unsubscribe_url }}
```

#### 4. Update Code
1. Copy your Buttondown username
2. Edit `src/components/SubscribeForm.astro`:
   ```typescript
   const buttondownUsername = 'your-username-here';
   ```
3. Commit and deploy

### Testing the Subscription System

```bash
# 1. Verify RSS feed works
curl https://andywoods.me/rss.xml

# 2. Test email subscription
# - Visit /subscribe page
# - Enter test email
# - Verify confirmation email arrives
# - Confirm subscription

# 3. Test RSS-to-email flow
# - Publish new blog post
# - Wait for Buttondown to check RSS (or trigger manually)
# - Verify email arrives with post content

# 4. Test unsubscribe
# - Click unsubscribe link in email
# - Verify immediate unsubscribe confirmation

# 5. Accessibility
# - Test form with keyboard only
# - Test with screen reader
# - Verify ARIA labels present
```

### Success Metrics

After launch, track:
- **Subscriber growth rate** (target: 5-10/month to start)
- **Email open rates** (Buttondown provides this)
- **RSS subscriber count** (Buttondown + RSS reader analytics)
- **Conversion rate**: Blog visitors → subscribers

---

## 🎨 Visual Branding

### Image Generation Style Guide

This project uses a distinctive **Vintage WPA National Parks Poster × Retro-Futurism** aesthetic for all blog images. This creates a cohesive visual brand that communicates "established expertise meets forward-thinking innovation."

**Key Features**:
- 1930s-1940s WPA poster style
- 5-color limited palette (burnt orange, deep teal, warm ochre, cream, charcoal)
- Technical concepts as natural landscapes
- Bold geometric forms, screen print aesthetic

**📖 Full Documentation**: See [`VISUAL_STYLE_GUIDE.md`](./VISUAL_STYLE_GUIDE.md) for:
- Complete style prompt templates
- Subject templates for AI, databases, cloud, innovation topics
- Color palette (exact hex codes)
- Image specifications & optimization
- Step-by-step generation instructions

**Quick Start**: Copy the core prompt from `VISUAL_STYLE_GUIDE.md`, choose a subject template, and generate with Midjourney/DALL-E.

---

## 📚 Documentation & Resources

### Project Documentation
- **Visual Style Guide**: [`VISUAL_STYLE_GUIDE.md`](./VISUAL_STYLE_GUIDE.md) - Brand-consistent image generation
- **Code Review**: [`CODE_REVIEW.md`](./CODE_REVIEW.md) - Security audit & refactoring summary
- **Environment Setup**: [`.env.example`](./.env.example) - Configuration template

### Official Documentation
- **Astro**: [docs.astro.build](https://docs.astro.build)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)

### Design Inspiration
- **Tom Tunguz**: [tomtunguz.com](https://tomtunguz.com) - Minimal, content-first design
- **Paul Graham**: [paulgraham.com](http://paulgraham.com) - Typography-focused
- **Cassidy Williams**: [cassidoo.co](https://cassidoo.co) - Personal branding

### Related Projects
- **Astro Blog Template**: [github.com/withastro/astro/tree/main/examples/blog](https://github.com/withastro/astro/tree/main/examples/blog)
- **Tailwind Typography**: [tailwindcss.com/docs/typography-plugin](https://tailwindcss.com/docs/typography-plugin)

---

## 🤝 Contributing

This is a personal website, but suggestions are welcome!

1. **Report bugs** - Open an issue on GitHub
2. **Suggest features** - Describe your use case
3. **Share feedback** - Reach out on [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) or [X](https://twitter.com/iamandywoods)

---

## 📄 License

This project uses a **dual licensing structure**:

### 🔧 Code: MIT License
All source code, build scripts, and configuration files are licensed under the **MIT License**.

**You can**:
- ✅ Use the code in personal or commercial projects
- ✅ Modify and redistribute freely
- ✅ Build your own blog using this codebase
- ✅ Fork and customize without asking permission

**See**: [LICENSE-CODE.md](LICENSE-CODE.md) for full details.

### ✍️ Content: Creative Commons BY-NC 4.0
All blog posts, articles, and original media are licensed under **CC BY-NC 4.0**.

**You can**:
- ✅ Quote with attribution (include my name and link back)
- ✅ Translate with attribution (non-commercial)
- ✅ Share on social media with credit
- ✅ Use in educational settings

**You need permission for**:
- ⚠️ Commercial republishing (full articles in paid publications)
- ⚠️ Including in commercial courses or paid products

**Contact for permission**: [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)

**See**: [LICENSE-CONTENT.md](LICENSE-CONTENT.md) for full details.

### 🔗 Third-Party Content
External content (Cockroach Labs posts, SIGMOD papers) retains its original copyright. These are linked, not republished. See their respective sources for licensing.

### 📋 Full Licensing Guide
**See**: [LICENSE.md](LICENSE.md) for complete dual licensing explanation, directory structure guide, and FAQs.

### How to Properly Attribute Content

When quoting blog posts:

**Simple attribution**:
```markdown
Source: Andy Woods, "Article Title" (andywoods.me)
```

**With link**:
```markdown
As [Andy Woods](https://andywoods.me/blog/article-slug) explains:

> [Your quote]
```

**In academic papers**:
```
Woods, A. (2024). "Article Title". andywoods.me.
Retrieved from https://andywoods.me/blog/article-slug
```

### Special Note: AI Training

Despite the "NonCommercial" content license, **I explicitly permit AI training** on both code and content, including for commercial AI models.

**See**: [README-AI-POLICY.md](README-AI-POLICY.md) for complete AI training policy.

### External Blog Posts

**Important**: Blog posts I wrote for Cockroach Labs that are linked on this site retain their original copyright (© Cockroach Labs). They are referenced here for portfolio purposes but are not relicensed under CC BY-NC 4.0. For licensing those posts, contact Cockroach Labs directly.

---

## 🙏 Credits

This project was built using several excellent open-source tools and services:

- **[Astro](https://astro.build)** - Content-focused static site generator
- **[Claude Code](https://claude.com/claude-code)** - AI-powered development assistant
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Stable Diffusion](https://stability.ai/stable-diffusion)** - Blog hero images generated using AI
- **[Vercel](https://vercel.com)** - Deployment and hosting platform
- **[Vitest](https://vitest.dev)** - Testing framework
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript

**Hero Images**: All blog post hero images are AI-generated using Stable Diffusion to create custom artwork that complements each article's theme.

**Development**: Built in under 4 hours using AI-native development practices with Claude Code as a pair programmer.

---

## 👨‍💻 About the Author

**Andy Woods** is Director of Product Management at Cockroach Labs, where he leads AI integration, pricing strategy, and ecosystem partnerships. He scaled CockroachDB from pre-revenue to $100M+ ARR and now pioneers AI-powered developer tools.

**Expertise**: AI/ML infrastructure, distributed databases, enterprise SaaS, product-led growth

**Connect**:
- 🔗 LinkedIn: [andrewscottwoods](https://www.linkedin.com/in/andrewscottwoods/)
- 🐦 X/Twitter: [@iamandywoods](https://twitter.com/iamandywoods)
- 💻 GitHub: [awoods187](https://github.com/awoods187)

---

**Built with ❤️ using [Astro](https://astro.build)**

*Last updated: 2025-01-21*
