# TODO - Next Steps for Production

**Status**: ✅ Codebase production ready (security audit passed, all tests
passing)

This checklist tracks what needs to be done to take the site live.

---

## 🔴 CRITICAL - Before First Deployment

### 1. Add Profile Photo

- [ ] Save your profile photo as `public/profile.jpg`
  - Recommended dimensions: 400×400px minimum (square aspect ratio)
  - Optimize to < 500KB
  - About page already configured to display it

**Note**: The photo layout is ready - just add the file!

---

## 🟡 RECOMMENDED - Before Going Live

### 2. Configure Analytics

**Option A: Plausible (Privacy-First)** ⭐ Recommended

- [ ] Sign up at https://plausible.io
- [ ] Add domain: `andywoods.me`
- [ ] Edit `src/components/Analytics.astro`
- [ ] Uncomment the Plausible script (line ~10)
- [ ] Redeploy

**Option B: Google Analytics 4**

- [ ] Create GA4 property at https://analytics.google.com
- [ ] Get measurement ID (G-XXXXXXXXXX)
- [ ] Edit `src/components/Analytics.astro`
- [ ] Replace `G-XXXXXXXXXX` with your actual ID
- [ ] Uncomment the GA script block
- [ ] Redeploy

### 3. Generate Blog Post Images

Use the **Visual Style Guide** to create branded images:

- [ ] Read `VISUAL_STYLE_GUIDE.md` (13KB guide)
- [ ] Use `.github/IMAGE_PROMPT_TEMPLATE.txt` for quick copy-paste
- [ ] Generate images for existing blog posts:
  - [ ] Getting Started with AI: A PM's Perspective
  - [ ] Why PMs Should Understand Database Fundamentals
  - [ ] Setting Up a Modern Static Site in 2024

**Quick Start**:

1. Copy prompt from `.github/IMAGE_PROMPT_TEMPLATE.txt`
2. Choose subject template (e.g., "Neural networks as mountain ranges")
3. Generate with Midjourney/DALL-E
4. Save to `public/images/blog/[post-slug]-hero.jpg`
5. Update frontmatter: `image: "/images/blog/[post-slug]-hero.jpg"`

### 4. Create OpenGraph Image

- [ ] Generate site-wide OG image (16:9 aspect ratio)
- [ ] Should represent personal brand (not specific post)
- [ ] Save as `public/og-image.png` (already referenced in BaseLayout)
- [ ] Optimize to < 300KB

---

## 🟢 DEPLOYMENT - Going Live

### 5. Deploy to Vercel (Recommended)

- [ ] Push code to GitHub

  ```bash
  git add .
  git commit -m "Production-ready: Security audit passed, docs complete"
  git push origin main
  ```

- [ ] Go to https://vercel.com
- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Import `andy-website` repository
- [ ] Deploy (auto-detects Astro, no config needed)
- [ ] Note your URL: `<project>.vercel.app`

### 6. Configure Custom Domain

**In Network Solutions**:

- [ ] Log in to Network Solutions
- [ ] Go to DNS settings for `andywoods.me`
- [ ] Add A record:
  - Host: `@`
  - Points to: `76.76.21.21`
- [ ] Add CNAME record:
  - Host: `www`
  - Points to: `cname.vercel-dns.com`

**In Vercel Dashboard**:

- [ ] Go to Project → Settings → Domains
- [ ] Add `andywoods.me`
- [ ] Add `www.andywoods.me`
- [ ] Wait for SSL certificate (automatic, ~5-10 minutes)

**DNS Propagation**:

- [ ] Wait 24-48 hours for full propagation
- [ ] Check status: https://dnschecker.org
- [ ] Test HTTPS: `https://andywoods.me`

---

## 🔵 OPTIONAL - Nice to Have

### 7. Environment Variables (Optional)

If you want to use environment variables:

- [ ] Copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```
- [ ] Fill in actual values
- [ ] Add to Vercel:
  - Go to Project → Settings → Environment Variables
  - Add variables with `PUBLIC_` prefix
  - Redeploy

**Note**: Not required for basic deployment, analytics IDs can be hardcoded.

### 8. Social Media Updates

Once live:

- [ ] Update LinkedIn bio with `andywoods.me`
- [ ] Update X/Twitter bio with link
- [ ] Update GitHub profile README
- [ ] Share launch post (optional)

### 9. SEO Verification

- [ ] Submit sitemap to Google Search Console
  - Sitemap URL: `https://andywoods.me/sitemap-index.xml`
- [ ] Verify domain ownership
- [ ] Monitor indexing status

### 10. Performance Testing

- [ ] Run Lighthouse audit (should be 95-100 across all categories)
- [ ] Test on mobile devices
- [ ] Verify all links work
- [ ] Check RSS feed: `https://andywoods.me/rss.xml`

---

## 📝 FUTURE ENHANCEMENTS

These are documented but not required for launch:

### High Priority

- [ ] Newsletter signup (ConvertKit or Substack)
- [ ] Dark mode toggle
- [ ] Search functionality (Pagefind)

### Medium Priority

- [ ] Comments system (Giscus - GitHub Discussions)
- [ ] Projects/portfolio section
- [ ] View counter for posts

### Low Priority

- [ ] Reading time estimates
- [ ] Table of contents for long posts
- [ ] Related posts recommendations

See `README.md` for full roadmap and implementation guidance.

---

## 🎓 Documentation Reference

| Document                              | Purpose                               |
| ------------------------------------- | ------------------------------------- |
| **README.md**                         | Main documentation, setup, deployment |
| **VISUAL_STYLE_GUIDE.md**             | Image generation, brand guidelines    |
| **CODE_REVIEW.md**                    | Security audit, refactoring summary   |
| **.env.example**                      | Environment variable template         |
| **requirements.txt**                  | Python dependencies                   |
| **.github/IMAGE_PROMPT_TEMPLATE.txt** | Quick copy prompts                    |

---

## ✅ Completion Tracking

**Phase 1: Pre-Launch** (Critical)

- [ ] Profile photo added
- [ ] Analytics configured
- [ ] Blog images generated
- [ ] OG image created

**Phase 2: Deployment**

- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] DNS propagated

**Phase 3: Verification**

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Analytics tracking
- [ ] Mobile responsive

**Phase 4: Promotion**

- [ ] Social media updated
- [ ] SEO configured
- [ ] Performance tested

---

## 🚨 Troubleshooting

**Build fails?**

```bash
npm run build
# Check error messages
npm run astro check
```

**Domain not working?**

- Check DNS settings in Network Solutions
- Verify A and CNAME records
- Use https://dnschecker.org
- Wait 24-48 hours for propagation

**Images not loading?**

- Verify files are in `public/` directory
- Check file names match frontmatter
- Rebuild: `npm run build`

**Tests failing?**

```bash
npm test
# Should show 15/15 passing
```

---

## 📞 Need Help?

- **Astro Docs**: https://docs.astro.build
- **Vercel Docs**: https://vercel.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

For project-specific questions, see the comprehensive documentation in:

- `README.md` (573 lines)
- `CODE_REVIEW.md` (16KB)
- `VISUAL_STYLE_GUIDE.md` (13KB)

---

**Last Updated**: 2025-01-21 **Current Status**: ✅ Code production-ready,
awaiting deployment

_Delete completed items or convert to ~~strikethrough~~ as you progress._
