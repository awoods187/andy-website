# Troubleshooting Guide

Common issues and solutions for andy-website development and deployment.

---

## Build Issues

### TypeScript Errors During Build

**Symptoms**:

```bash
npm run build
# Error: Type 'X' is not assignable to type 'Y'
```

**Diagnosis**:

```bash
npm run astro check
```

**Common causes**:

- Missing required frontmatter fields
- Invalid date format (must be `YYYY-MM-DD`)
- Type mismatch in blog post schema
- Incorrect tag format (must be array of strings)

**Solutions**:

1. **Validate frontmatter**:

   ```markdown
   ---
   title: 'Post Title' # String required
   date: 2024-10-21 # Date required (YYYY-MM-DD)
   excerpt: 'Summary' # String required
   tags: ['ai', 'databases'] # Array required
   ---
   ```

2. **Check Zod schema** (`src/content/config.ts`):
   - Ensure all required fields present
   - Verify field types match schema

3. **Clear cache and rebuild**:
   ```bash
   rm -rf .astro dist node_modules/.cache
   npm run build
   ```

---

### Build Succeeds But Pages Missing

**Symptoms**: Build completes but blog posts don't appear on site.

**Diagnosis**:

```bash
# Check if files exist
ls dist/blog/

# Verify content collections
npm run astro check
```

**Common causes**:

- `draft: true` in frontmatter
- File not in `src/content/blog/` directory
- Invalid Markdown syntax breaking parser
- Frontmatter missing required fields

**Solutions**:

1. **Check draft status**: Ensure `draft: false` or field omitted
2. **Verify file location**: Must be in `src/content/blog/*.md`
3. **Validate Markdown**: Look for unclosed code blocks, invalid headings
4. **Test locally**: Run `npm run dev` and check console for errors

---

### npm install Fails

**Symptoms**:

```bash
npm install
# Error: ERESOLVE unable to resolve dependency tree
```

**Solutions**:

1. **Clear npm cache**:

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use correct Node version** (18+):

   ```bash
   node --version  # Should be 18.x or higher
   ```

3. **Force resolve** (last resort):
   ```bash
   npm install --legacy-peer-deps
   ```

---

## Development Server Issues

### Port 4321 Already In Use

**Symptoms**:

```bash
npm run dev
# Error: Port 4321 is already in use
```

**Solutions**:

1. **Kill existing process**:

   ```bash
   # macOS/Linux
   lsof -ti:4321 | xargs kill -9

   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Find and stop process**:
   ```bash
   ps aux | grep astro
   kill [PID]
   ```

---

### Changes Not Hot-Reloading

**Symptoms**: File changes don't appear in browser without manual refresh.

**Solutions**:

1. **Hard refresh browser**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Restart dev server**: `Ctrl+C` then `npm run dev`
3. **Clear `.astro` cache**:
   ```bash
   rm -rf .astro
   npm run dev
   ```
4. **Check file watchers limit** (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

## Deployment Issues

### Vercel Build Fails

**Symptoms**: Build succeeds locally but fails on Vercel.

**Diagnosis**: Check build logs in Vercel dashboard.

**Common causes**:

- Node version mismatch
- Missing environment variables
- Dependency installation failure
- TypeScript strict mode errors

**Solutions**:

1. **Set Node version**:
   - Add to `package.json`:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

2. **Check environment variables**:
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure all `PUBLIC_*` vars are set

3. **Test production build locally**:

   ```bash
   npm run build
   npm run preview
   ```

4. **Review build logs** for specific error messages

---

### Netlify Build Fails

**Symptoms**: Deployment fails with exit code 1.

**Common causes**:

- Node version too old
- Build command incorrect
- Publish directory wrong

**Solutions**:

1. **Set Node version**:
   - Add `netlify.toml`:

     ```toml
     [build]
       command = "npm run build"
       publish = "dist"

     [build.environment]
       NODE_VERSION = "18"
     ```

2. **Verify build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18+

3. **Clear cache and retry**:
   - Netlify Dashboard → Deploys → Clear cache and retry deploy

---

### Custom Domain Not Working

**Symptoms**: Domain not resolving to site or showing SSL errors.

**Diagnosis**:

```bash
# Check DNS propagation
dig andywoods.me
dig www.andywoods.me

# Or use web tool
# https://dnschecker.org
```

**Solutions**:

1. **Verify DNS records** (Network Solutions):
   - **A record**: `@` → `76.76.21.21` (Vercel) or `75.2.60.5` (Netlify)
   - **CNAME**: `www` → `cname.vercel-dns.com` or `<site>.netlify.app`

2. **Wait for propagation**: 24-48 hours typical

3. **Check SSL certificate**:
   - Vercel/Netlify auto-provisions Let's Encrypt
   - May take 5-10 minutes after DNS propagates

4. **Force HTTPS redirect** in platform settings

5. **Clear browser DNS cache**:

   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns

   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

### Changes Not Appearing on Live Site

**Symptoms**: Deployed new code but live site shows old version.

**Solutions**:

1. **Check deployment status**:
   - Vercel/Netlify dashboard → Deployments
   - Ensure latest commit deployed

2. **Verify branch**:

   ```bash
   git branch  # Should be on main
   git log     # Verify latest commit pushed
   ```

3. **Hard refresh browser**:
   - `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or open in incognito/private window

4. **Clear CDN cache**:
   - Vercel: Dashboard → Deployments → Redeploy (no cache)
   - Netlify: Site → Deploys → Clear cache and redeploy

5. **Check build logs** for errors preventing deployment

---

## Content Issues

### Blog Posts Not Showing

**Symptoms**: Post file exists but doesn't appear on `/blog` page.

**Solutions**:

1. **Check draft status**:

   ```markdown
   draft: false # Or omit field entirely
   ```

2. **Validate frontmatter**:
   - All required fields present: `title`, `date`, `excerpt`, `tags`
   - Date format correct: `YYYY-MM-DD`
   - Tags is array: `["tag1", "tag2"]`

3. **Verify file location**: Must be `src/content/blog/*.md`

4. **Check console for errors**: Run `npm run dev` and inspect browser console

5. **Rebuild**:
   ```bash
   rm -rf .astro dist
   npm run build
   ```

---

### Images Not Loading

**Symptoms**: Broken image icons or 404 errors for images.

**Solutions**:

1. **Verify path**:
   - Images must be in `/public/` directory
   - Reference without `/public/` prefix:

     ```markdown
     image: "/images/blog/my-image.jpg"

     # NOT: "/public/images/blog/my-image.jpg"
     ```

2. **Check file exists**:

   ```bash
   ls public/images/blog/my-image.jpg
   ```

3. **Verify file extension**: Match exactly (case-sensitive on Linux)

4. **Rebuild**:
   ```bash
   npm run build
   ```

---

## Python Scraper Issues

### Scraper Fails with Import Error

**Symptoms**:

```bash
python3 scripts/scrape-crl-posts.py
# ModuleNotFoundError: No module named 'bs4'
```

**Solution**:

```bash
pip install -r requirements.txt
```

---

### Scraper Returns Empty Results

**Symptoms**: Script runs but generates empty `crl-posts.ts`.

**Common causes**:

- Cockroach Labs website HTML structure changed
- Author page URL changed
- Network issues

**Solutions**:

1. **Verify author page exists**:

   ```bash
   curl -I https://www.cockroachlabs.com/author/andy-woods/
   # Should return HTTP 200
   ```

2. **Update selectors** in `scripts/scrape-crl-posts.py`:
   - Inspect current HTML structure
   - Update BeautifulSoup selectors to match

3. **Check error output**:

   ```bash
   python3 scripts/scrape-crl-posts.py 2>&1 | grep -i error
   ```

4. **Manual fallback**: Add posts directly to `src/data/crl-posts.ts`

---

## Test Failures

### Tests Fail Locally

**Symptoms**:

```bash
npm test
# FAIL tests/build.test.ts
```

**Solutions**:

1. **Build before testing**:

   ```bash
   npm run build
   npm test
   ```

2. **Clear cache**:

   ```bash
   rm -rf .astro dist node_modules/.cache
   npm run build
   npm test
   ```

3. **Check test expectations** match current content structure

4. **Review test output** for specific failure reasons

---

## Performance Issues

### Slow Build Times

**Symptoms**: `npm run build` takes >2 minutes.

**Solutions**:

1. **Clear cache**:

   ```bash
   rm -rf .astro node_modules/.cache
   ```

2. **Update dependencies**:

   ```bash
   npm update
   ```

3. **Check for large images** in `/public/`:

   ```bash
   find public -type f -size +500k
   # Optimize large images
   ```

4. **Disable TypeScript checking** during development:
   ```bash
   npm run dev -- --no-check
   ```

---

### Slow Page Loads in Production

**Symptoms**: Lighthouse score <90, slow Time to First Byte.

**Diagnosis**:

- Run Lighthouse audit in Chrome DevTools
- Check Core Web Vitals in Vercel/Netlify analytics

**Solutions**:

1. **Optimize images**:
   - Convert to WebP
   - Use responsive images with `srcset`
   - Compress to <200KB

2. **Minimize CSS**:
   - Remove unused Tailwind classes
   - Check bundle size: `npm run build` output

3. **Preload critical resources**:
   - Add font preload to `BaseLayout.astro`

4. **Check CDN caching**: Verify assets have long cache headers

---

## Getting Help

If issue persists:

1. **Search GitHub Issues**:
   [github.com/awoods187/andy-website/issues](https://github.com/awoods187/andy-website/issues)
2. **Check Astro Docs**:
   [docs.astro.build/troubleshooting](https://docs.astro.build/en/guides/troubleshooting/)
3. **Contact maintainer**:
   [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)

**When reporting issues, include**:

- Error message (full stack trace)
- Steps to reproduce
- Environment info: `node --version`, `npm --version`, OS
- Relevant config files

---

**Last Updated**: 2025-01-21
