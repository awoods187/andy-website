/**
 * Build Tests
 *
 * Tests to ensure the Astro project builds successfully and generates
 * all expected pages and assets.
 *
 * NOTE: These tests require `npm run build` to be run first.
 * In CI, these run in the separate "build" job after the build step.
 * If dist/ doesn't exist, tests are skipped with a warning.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');

// Check if build is complete by looking for a marker file that's generated last
function isBuildComplete(): boolean {
  // sitemap-index.xml is one of the last files generated
  const sitemapPath = join(distPath, 'sitemap-index.xml');
  return existsSync(sitemapPath);
}

const buildComplete = isBuildComplete();

// Skip all build tests if build is not complete
describe.skipIf(!buildComplete)('Build Output', () => {
  it('should have a dist directory after build', () => {
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

describe.skipIf(!buildComplete)('Blog Posts', () => {
  it('should generate blog post pages', () => {
    const blogPath = join(distPath, 'blog');
    expect(existsSync(blogPath)).toBe(true);
    const files = readdirSync(blogPath, { withFileTypes: true });
    const postDirs = files.filter((f) => f.isDirectory());

    // Should have at least the 3 blog posts
    expect(postDirs.length).toBeGreaterThanOrEqual(3);
  });
});

// Informational test that always runs
describe('Build Test Status', () => {
  it('should indicate if build tests were skipped', () => {
    if (!buildComplete) {
      console.log(
        '\n⚠️  Build output tests skipped - build not complete.\n' +
          'Run `npm run build` before running tests to enable build validation.\n' +
          'This is expected in CI during the test phase (build happens separately).\n'
      );
    }
    // Always pass - this is just informational
    expect(true).toBe(true);
  });
});
