# Maintenance Schedule & Guidelines

Recommended update frequencies and maintenance procedures for andy-website.

---

## Update Frequencies

### Content (Bi-weekly)

**What**: Blog posts, external content aggregation, profile updates

**Schedule**: Every 2 weeks or as needed

**Tasks**:

- [ ] Add new blog posts
- [ ] Run Python scraper for Cockroach Labs posts:
      `python3 scripts/scrape-crl-posts.py`
- [ ] Review and update "About" page if role/responsibilities change
- [ ] Update newsletter archives

**Effort**: 15-30 minutes

---

### Dependencies (Quarterly)

**What**: npm packages, Python dependencies, framework updates

**Schedule**: Every 3 months (January, April, July, October)

**Tasks**:

```bash
# 1. Check for outdated packages
npm outdated

# 2. Update all dependencies
npm update

# 3. Update Astro specifically
npm install astro@latest

# 4. Update Python dependencies
pip install --upgrade -r requirements.txt

# 5. Run tests
npm test

# 6. Build and preview
npm run build
npm run preview

# 7. Commit updates
git add package.json package-lock.json requirements.txt
git commit -m "chore(deps): update dependencies Q[1-4] 2025"
git push origin main
```

**Effort**: 30-60 minutes

**Critical**: Review changelog for breaking changes before updating major
versions.

---

### Security Patches (Within 48 hours)

**What**: Critical security vulnerabilities in dependencies

**Triggers**:

- Dependabot alerts (GitHub)
- `npm audit` warnings (severity: high/critical)
- Security advisories for Astro, Tailwind, etc.

**Tasks**:

```bash
# 1. Review vulnerability
npm audit

# 2. Update specific package
npm update [package-name]

# Or auto-fix
npm audit fix

# 3. Test thoroughly
npm test
npm run build

# 4. Deploy immediately
git commit -m "security: patch [vulnerability-name]"
git push origin main
```

**Effort**: 15-30 minutes

**SLA**: Patch within 48 hours of disclosure

---

### Performance Audits (Monthly)

**What**: Lighthouse scores, Core Web Vitals, bundle size analysis

**Schedule**: First week of each month

**Tasks**:

1. **Run Lighthouse audit** in Chrome DevTools (Incognito mode)
   - Target: 90+ across all categories
   - Focus on Performance, Accessibility, SEO

2. **Check Core Web Vitals**:
   - Vercel Analytics or Google Search Console
   - LCP: <3.7s • FID: <100ms • CLS: <0.1

3. **Analyze bundle size**:

   ```bash
   npm run build
   # Review output for unexpected size increases
   ```

4. **Test mobile performance**:
   - Lighthouse mobile audit (Slow 4G throttling)
   - Test on real device if possible

5. **Document findings**:
   - Add to performance log
   - Create issues for regressions

**Effort**: 30 minutes

---

### Metadata Updates (As Needed)

**What**: Version numbers, "Last Updated" dates, maintenance status

**Schedule**: With each significant update

**Locations to update**:

- `README.md` → "Last Updated" footer
- `package.json` → `version` field (if using semantic versioning)
- `docs/MAINTENANCE.md` → This file's "Last Updated"
- Blog post dates (if substantially revised)

**Effort**: 5 minutes

---

## Routine Maintenance Checklist

### Monthly Tasks

- [ ] Run Lighthouse performance audit
- [ ] Review Vercel/Netlify analytics for errors
- [ ] Check for broken links (use link checker tool)
- [ ] Verify RSS feed still working
- [ ] Review Plausible/Google Analytics for traffic patterns
- [ ] Backup critical content (already in Git)

### Quarterly Tasks

- [ ] Update npm dependencies
- [ ] Update Python dependencies
- [ ] Review and update documentation
- [ ] Audit images for optimization opportunities
- [ ] Check for Astro framework updates
- [ ] Review SEO rankings (Google Search Console)
- [ ] Test newsletter subscription flow
- [ ] Verify custom domain SSL certificate auto-renewed

### Annual Tasks

- [ ] Renew custom domain (Network Solutions)
- [ ] Review and update Visual Style Guide
- [ ] Major version upgrades (Astro, Tailwind)
- [ ] Comprehensive accessibility audit
- [ ] Review and update content strategy
- [ ] Archive or update outdated blog posts

---

## Monitoring & Alerts

### Recommended Services

**Uptime Monitoring**:

- Service: [UptimeRobot](https://uptimerobot.com) (free tier)
- Check frequency: Every 5 minutes
- Alert via: Email
- Monitors: `https://andywoods.me`, `https://andywoods.me/blog`

**Dependency Scanning**:

- Service: GitHub Dependabot (built-in)
- Configuration: `.github/dependabot.yml`
- Auto-creates PRs for security updates

**Performance Monitoring**:

- Service: Vercel Analytics (built-in) or Google Search Console
- Metrics: Core Web Vitals, page load times
- Review: Monthly

**SSL Certificate**:

- Vercel/Netlify auto-renews Let's Encrypt certificates
- Expiration: Every 90 days
- No manual action required (verify quarterly)

---

## Breaking Changes Protocol

When Astro or major dependencies release breaking changes:

1. **Review changelog** thoroughly
2. **Create feature branch**:
   ```bash
   git checkout -b upgrade/astro-v6
   ```
3. **Update dependencies**:
   ```bash
   npm install astro@latest
   ```
4. **Fix breaking changes** per migration guide
5. **Run full test suite**:
   ```bash
   npm test
   npm run build
   npm run preview
   ```
6. **Test locally** in multiple browsers
7. **Deploy to preview** (automatic on Vercel/Netlify)
8. **Merge to main** after verification

---

## Backup Strategy

**Primary backup**: Git version control (GitHub)

**What's backed up**:

- All source code
- Blog post content (Markdown)
- Configuration files
- Build scripts

**Not backed up** (regenerable):

- `node_modules/` (reinstall via `npm install`)
- `dist/` (rebuild via `npm run build`)
- `.astro/` (cache, auto-generated)

**Disaster recovery**:

```bash
# Clone repository
git clone https://github.com/awoods187/andy-website.git

# Install dependencies
npm install
pip install -r requirements.txt

# Rebuild
npm run build

# Redeploy
git push origin main
```

**RTO (Recovery Time Objective)**: <1 hour

---

## EOL (End of Life) Considerations

**Current status**: Active, no EOL planned

**If retiring project**:

1. Archive GitHub repository
2. Add notice to home page
3. Maintain redirects for SEO
4. Export content to portable format
5. Keep domain registered (prevent squatting)

---

## Contact for Maintenance Issues

- **Owner**: Andy Woods
- **Email**: andrewscottwoods@gmail.com
- **GitHub**: [@awoods187](https://github.com/awoods187)
- **LinkedIn**:
  [andrewscottwoods](https://www.linkedin.com/in/andrewscottwoods/)

---

## Maintenance Log Template

Keep track of significant maintenance activities:

```markdown
## 2025-01-15 - Quarterly Dependency Update

**What**: Updated npm packages to latest versions **Changes**:

- Astro 4.0 → 5.0
- Tailwind 3.4 → 4.0
- Vitest 1.0 → 1.2

**Testing**: All tests pass, Lighthouse score maintained at 95+ **Issues**: None
**Effort**: 45 minutes
```

---

**Last Updated**: 2025-01-21 **Next Scheduled Review**: 2025-04-01 (Quarterly
dependency update)
