/**
 * Build Tests
 *
 * Tests to ensure the Astro project builds successfully and generates
 * all expected pages and assets.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

describe('Build Output', () => {
  const distPath = join(process.cwd(), 'dist');

  it('should have a dist directory after build', () => {
    // Note: Run `npm run build` before running tests
    expect(existsSync(distPath)).toBe(true);
  });

  it('should generate index.html (home page)', () => {
    const indexPath = join(distPath, 'index.html');
    expect(existsSync(indexPath)).toBe(true);
  });

  it('should generate about page', () => {
    const aboutPath = join(distPath, 'about', 'index.html');
    expect(existsSync(aboutPath)).toBe(true);
  });

  it('should generate blog index page', () => {
    const blogPath = join(distPath, 'blog', 'index.html');
    expect(existsSync(blogPath)).toBe(true);
  });

  it('should generate archive page', () => {
    const archivePath = join(distPath, 'archive', 'index.html');
    expect(existsSync(archivePath)).toBe(true);
  });

  it('should generate RSS feed', () => {
    const rssPath = join(distPath, 'rss.xml');
    expect(existsSync(rssPath)).toBe(true);
  });

  it('should generate robots.txt', () => {
    const robotsPath = join(distPath, 'robots.txt');
    expect(existsSync(robotsPath)).toBe(true);
  });

  it('should generate sitemap', () => {
    const sitemapPath = join(distPath, 'sitemap-index.xml');
    expect(existsSync(sitemapPath)).toBe(true);
  });
});

describe('Blog Posts', () => {
  const distPath = join(process.cwd(), 'dist');
  const blogPath = join(distPath, 'blog');

  it('should generate blog post pages', () => {
    if (existsSync(blogPath)) {
      const files = readdirSync(blogPath, { withFileTypes: true });
      const postDirs = files.filter(f => f.isDirectory());

      // Should have at least the 3 sample posts
      expect(postDirs.length).toBeGreaterThanOrEqual(3);
    }
  });
});
