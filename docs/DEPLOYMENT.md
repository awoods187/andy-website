# Deployment Guide

Complete deployment instructions for andy-website to Vercel, Netlify, and custom
domain configuration.

---

## Vercel Deployment (Recommended)

### Initial Setup

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import Project**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click **"New Project"**
   - Import `andy-website` repository

3. **Deploy**
   - Vercel auto-detects Astro configuration
   - No manual build settings required
   - Click **"Deploy"**
   - Live at `<project-name>.vercel.app`

### Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```env
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_SITE_URL=https://andywoods.me
```

### Custom Domain (andywoods.me)

**Network Solutions DNS Configuration**:

1. **A Record** (apex domain):
   - **Host**: `@`
   - **Type**: A
   - **Points to**: `76.76.21.21`
   - **TTL**: 3600

2. **CNAME Record** (www subdomain):
   - **Host**: `www`
   - **Type**: CNAME
   - **Points to**: `cname.vercel-dns.com`
   - **TTL**: 3600

3. **Vercel Configuration**:
   - Go to Project → Settings → Domains
   - Add `andywoods.me`
   - Add `www.andywoods.me`
   - Vercel will auto-provision SSL certificate (Let's Encrypt)

4. **Propagation**:
   - Wait 24-48 hours for DNS propagation
   - Check status: [dnschecker.org](https://dnschecker.org)
   - Verify HTTPS: `https://andywoods.me`

---

## Netlify Deployment

### Initial Setup

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import Project**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - **Add new site** → **Import an existing project**
   - Select repository

3. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (in `netlify.toml` or env var `NODE_VERSION=18`)

4. **Deploy**
   - Click **"Deploy site"**
   - Live at `<project-name>.netlify.app`

### Custom Domain (andywoods.me)

**Network Solutions DNS Configuration**:

1. **A Record** (apex domain):
   - **Host**: `@`
   - **Type**: A
   - **Points to**: `75.2.60.5`
   - **TTL**: 3600

2. **CNAME Record** (www subdomain):
   - **Host**: `www`
   - **Type**: CNAME
   - **Points to**: `<your-site>.netlify.app`
   - **TTL**: 3600

3. **Netlify Configuration**:
   - Go to **Site settings** → **Domain management**
   - **Add custom domain**: `andywoods.me`
   - Verify DNS records
   - Enable HTTPS (auto-provisioned via Let's Encrypt)

---

## SSL Certificate Management

**Both platforms provide automatic SSL**:

- Free Let's Encrypt certificates
- Auto-renewal every 90 days
- No manual configuration required
- HTTPS enforced via automatic redirects

**Verification**:

```bash
# Check certificate
curl -vI https://andywoods.me

# Expected: HTTP/2 200, valid TLS 1.3 certificate
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Profile photo added (`public/profile.jpg`)
- [ ] Analytics integration configured
- [ ] Custom domain DNS records updated
- [ ] Build succeeds locally (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] RSS feed accessible at `/rss.xml`
- [ ] OpenGraph images present
- [ ] 404 page configured

---

## Troubleshooting

### Build Fails

**Check build logs** in platform dashboard:

```bash
# Common issues:
# - TypeScript errors → npm run astro check
# - Missing dependencies → npm install
# - Invalid frontmatter → validate Zod schema
```

### Custom Domain Not Working

1. **Verify DNS propagation**: [dnschecker.org](https://dnschecker.org)
2. **Check DNS records** in Network Solutions dashboard
3. **Wait 24-48 hours** for full propagation
4. **Clear browser cache**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
5. **Check SSL certificate** status in platform dashboard

### Changes Not Appearing

1. **Verify deployment** completed in platform dashboard
2. **Check branch** - Ensure changes pushed to `main`
3. **Hard refresh** browser to bypass cache
4. **Check build logs** for errors

---

## Continuous Deployment

**Automatic deployments** on every push to `main`:

### Vercel

- **Production**: `main` branch → andywoods.me
- **Preview**: All other branches → unique preview URL
- **Rollback**: Dashboard → Deployments → Redeploy previous

### Netlify

- **Production**: `main` branch → andywoods.me
- **Deploy previews**: All pull requests
- **Rollback**: Site → Deploys → Publish specific deploy

---

## Performance Optimization

**Vercel Edge Network**:

- Automatic CDN distribution
- Brotli/Gzip compression
- Edge caching (immutable assets)
- HTTP/2 + HTTP/3 support

**Netlify CDN**:

- Global edge network
- Smart CDN with cache invalidation
- Asset optimization
- HTTP/2 support

**Expected response times**: <50ms from nearest edge location

---

## Monitoring

### Vercel Analytics

Enable in Project → Analytics:

- Real-time visitor tracking
- Core Web Vitals monitoring
- Geographic distribution
- Device/browser breakdown

### Netlify Analytics

Enable in Site Settings → Analytics:

- Server-side analytics (no client JS)
- Privacy-friendly tracking
- Bandwidth usage
- Unique visitors

### External Monitoring

Recommended services:

- **UptimeRobot**: Uptime monitoring (free tier)
- **Google Search Console**: SEO health
- **Plausible Analytics**: Privacy-first analytics

---

## Cost Estimates

### Vercel (Hobby Plan)

- **Bandwidth**: 100GB/month included
- **Builds**: Unlimited
- **Cost**: Free for personal projects

### Netlify (Free Tier)

- **Bandwidth**: 100GB/month
- **Build minutes**: 300/month
- **Cost**: Free

### Domain

- **Network Solutions**: ~$15/year

**Total estimated cost**: <$5/month

---

**Last Updated**: 2025-01-21
