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
const hasBuildOutput = existsSync(distPath);

// Skip all build tests if dist doesn't exist
describe.skipIf(!hasBuildOutput)('Build Output', () => {
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

describe.skipIf(!hasBuildOutput)('Blog Posts', () => {
  const blogPath = join(distPath, 'blog');

  it('should generate blog post pages', () => {
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
    if (!hasBuildOutput) {
      console.log(
        '\n⚠️  Build output tests skipped - dist/ directory not found.\n' +
          'Run `npm run build` before running tests to enable build validation.\n' +
          'This is expected in CI during the test phase (build happens separately).\n'
      );
    }
    // Always pass - this is just informational
    expect(true).toBe(true);
  });
});
