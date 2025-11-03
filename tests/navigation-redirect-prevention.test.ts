/**
 * Navigation Redirect Prevention Tests
 *
 * These tests prevent "redirect flash" issues where clicking a navigation link
 * causes a brief visible redirect notice before reaching the destination.
 *
 * Problem:
 * - User clicks "Blog" button
 * - Link goes to /blog
 * - /blog redirects to /blog/all
 * - User sees flash of redirect notice
 * - Poor UX
 *
 * Solution:
 * - Navigation links must point directly to final destination
 * - No intermediate redirects
 * - Instant navigation
 *
 * This test suite ensures all header navigation links avoid redirects.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

describe('Navigation Redirect Prevention', () => {
  const headerContent = readFileSync(join(process.cwd(), 'src/components/Header.astro'), 'utf-8');

  /**
   * Recursively get all .astro files in a directory
   */
  function getAllAstroFiles(dir: string): string[] {
    const files: string[] = [];

    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...getAllAstroFiles(fullPath));
        } else if (entry.endsWith('.astro')) {
          files.push(fullPath);
        }
      }
    } catch (_error) {
      // Directory doesn't exist or can't be read
    }

    return files;
  }

  /**
   * Extract all href values from Header navigation links
   */
  function extractNavigationLinks(content: string): string[] {
    const hrefPattern = /href="([^"]+)"/g;
    const links: string[] = [];
    let match;

    while ((match = hrefPattern.exec(content)) !== null) {
      links.push(match[1]);
    }

    return links;
  }

  /**
   * Check if a page file contains a redirect
   */
  function pageHasRedirect(pagePath: string): boolean {
    if (!existsSync(pagePath)) {
      return false;
    }

    const content = readFileSync(pagePath, 'utf-8');

    // Check for Astro.redirect() calls
    const hasAstroRedirect = /Astro\.redirect\(/.test(content);

    // Check for meta refresh redirects
    const hasMetaRedirect = /<meta[^>]+http-equiv=["']refresh["']/i.test(content);

    // Check for return Astro.redirect pattern
    const hasReturnRedirect = /return\s+Astro\.redirect\(/.test(content);

    return hasAstroRedirect || hasMetaRedirect || hasReturnRedirect;
  }

  /**
   * Convert URL path to potential file paths in src/pages
   */
  function getPageFilePaths(urlPath: string): string[] {
    const basePath = join(process.cwd(), 'src/pages');
    const cleanPath = urlPath.replace(/^\//, '').replace(/\/$/, '');

    if (!cleanPath) {
      // Root path
      return [join(basePath, 'index.astro'), join(basePath, 'index.md')];
    }

    return [
      join(basePath, `${cleanPath}.astro`),
      join(basePath, `${cleanPath}/index.astro`),
      join(basePath, `${cleanPath}.md`),
      join(basePath, `${cleanPath}/index.md`),
    ];
  }

  describe('Header Navigation Links', () => {
    it('should extract all navigation links from Header', () => {
      const links = extractNavigationLinks(headerContent);

      expect(links.length).toBeGreaterThan(0);
      expect(links).toContain('/');
      expect(links.some((link) => link.includes('blog'))).toBe(true);
    });

    it('should not link to /blog (redirects to /blog/all)', () => {
      const links = extractNavigationLinks(headerContent);

      // /blog has a redirect in /blog/index.astro
      expect(links).not.toContain('/blog');

      // Should link to /blog/all instead
      expect(links).toContain('/blog/all');
    });

    it('all navigation links should NOT point to redirect pages', () => {
      const links = extractNavigationLinks(headerContent);
      const redirectingLinks: string[] = [];

      for (const link of links) {
        // Skip external links
        if (link.startsWith('http')) continue;

        const possiblePaths = getPageFilePaths(link);

        for (const path of possiblePaths) {
          if (pageHasRedirect(path)) {
            redirectingLinks.push(`${link} → ${path}`);
          }
        }
      }

      expect(redirectingLinks).toEqual([]);
    });

    it('should have direct links to final destinations', () => {
      const links = extractNavigationLinks(headerContent);

      // Each link should either:
      // 1. Point to a page with content (no redirect)
      // 2. Point to a dynamic route (like /blog/all which is /blog/[category])

      const problematicLinks: string[] = [];

      for (const link of links) {
        if (link.startsWith('http')) continue;

        const possiblePaths = getPageFilePaths(link);
        let hasValidDestination = false;

        for (const path of possiblePaths) {
          if (existsSync(path) && !pageHasRedirect(path)) {
            hasValidDestination = true;
            break;
          }
        }

        // Check if it's a dynamic route
        const isDynamicRoute =
          link.includes('/all') || link.includes('/personal') || link.includes('/cockroach-labs');

        if (!hasValidDestination && !isDynamicRoute) {
          problematicLinks.push(link);
        }
      }

      // Only expect problems for non-dynamic routes
      const nonDynamicProblems = problematicLinks.filter((link) => !link.includes('/blog/'));

      expect(nonDynamicProblems).toEqual([]);
    });
  });

  describe('Known Redirect Pages', () => {
    it('/blog/index.astro should redirect (but not be linked from nav)', () => {
      const blogIndexPath = join(process.cwd(), 'src/pages/blog/index.astro');

      // This redirect is fine - it's for direct URL access
      expect(existsSync(blogIndexPath)).toBe(true);
      expect(pageHasRedirect(blogIndexPath)).toBe(true);

      // But nav should NOT link to /blog
      const links = extractNavigationLinks(headerContent);
      expect(links).not.toContain('/blog');
    });

    it('should document all redirect pages in codebase', () => {
      const pagesPath = join(process.cwd(), 'src/pages');
      const allPages = getAllAstroFiles(pagesPath);

      const redirectPages: string[] = [];

      for (const pagePath of allPages) {
        if (pageHasRedirect(pagePath)) {
          const relativePath = pagePath.replace(process.cwd(), '');
          redirectPages.push(relativePath);
        }
      }

      // Document known redirect pages
      const knownRedirects = [
        '/src/pages/blog/index.astro', // Redirects /blog → /blog/all
        '/src/pages/archive.astro', // Redirects /archive → /blog/all (legacy URL)
      ];

      // All redirect pages should be known and documented
      for (const redirect of redirectPages) {
        expect(knownRedirects).toContain(redirect);
      }
    });
  });

  describe('Navigation UX Requirements', () => {
    it('should have instant navigation (no multi-hop redirects)', () => {
      const links = extractNavigationLinks(headerContent);

      // No link should go through multiple redirects
      // Test: /blog → /blog/all → /blog/foo (BAD)
      // Good: /blog/all (direct)

      for (const link of links) {
        if (link.startsWith('http')) continue;

        const possiblePaths = getPageFilePaths(link);

        for (const path of possiblePaths) {
          if (!existsSync(path)) continue;

          const content = readFileSync(path, 'utf-8');

          // If page has redirect, check if it's a single-hop
          if (pageHasRedirect(content)) {
            const redirectMatch = content.match(/Astro\.redirect\(['"]([^'"]+)['"]/);

            if (redirectMatch) {
              const targetPath = redirectMatch[1];
              const targetPaths = getPageFilePaths(targetPath);

              // Target should NOT also be a redirect
              for (const targetFilePath of targetPaths) {
                if (existsSync(targetFilePath)) {
                  expect(pageHasRedirect(targetFilePath)).toBe(false);
                }
              }
            }
          }
        }
      }
    });

    it('should not have redirect loops', () => {
      const pagesPath = join(process.cwd(), 'src/pages');
      const allPages = getAllAstroFiles(pagesPath);

      const redirectMap = new Map<string, string>();

      // Build redirect map
      for (const pagePath of allPages) {
        const content = readFileSync(pagePath, 'utf-8');
        const redirectMatch = content.match(/Astro\.redirect\(['"]([^'"]+)['"]/);

        if (redirectMatch) {
          const source =
            pagePath.replace(pagesPath, '').replace('/index.astro', '').replace('.astro', '') ||
            '/';
          const target = redirectMatch[1];
          redirectMap.set(source, target);
        }
      }

      // Check for loops
      for (const [source, target] of redirectMap.entries()) {
        const visited = new Set<string>();
        let current = target;

        while (redirectMap.has(current)) {
          if (visited.has(current)) {
            throw new Error(
              `Redirect loop detected: ${source} → ${Array.from(visited).join(' → ')} → ${current}`
            );
          }
          visited.add(current);
          current = redirectMap.get(current)!;
        }
      }
    });
  });

  describe('Footer Navigation (if exists)', () => {
    it('footer links should also avoid redirects', () => {
      const footerPath = join(process.cwd(), 'src/components/Footer.astro');

      if (!existsSync(footerPath)) {
        return; // Skip if no footer
      }

      const footerContent = readFileSync(footerPath, 'utf-8');
      const links = extractNavigationLinks(footerContent);
      const internalLinks = links.filter((link) => !link.startsWith('http'));

      for (const link of internalLinks) {
        const possiblePaths = getPageFilePaths(link);

        for (const path of possiblePaths) {
          if (existsSync(path)) {
            const hasRedirect = pageHasRedirect(path);

            if (hasRedirect) {
              throw new Error(`Footer links to redirect page: ${link} (${path})`);
            }
          }
        }
      }
    });
  });

  describe('Regression Prevention', () => {
    it('should document the /blog redirect issue (regression test)', () => {
      // This test documents the specific issue that was fixed
      // If someone changes /blog/all back to /blog, this will fail

      const links = extractNavigationLinks(headerContent);
      const blogLink = links.find((link) => link.includes('blog'));

      expect(blogLink).toBeDefined();
      expect(blogLink).toBe('/blog/all'); // NOT /blog
    });

    it('should fail if Header links to /blog instead of /blog/all', () => {
      // Explicit test for the exact regression
      expect(headerContent).not.toMatch(/href="\/blog"\s/);
      expect(headerContent).not.toMatch(/href='\/blog'\s/);
    });
  });
});
