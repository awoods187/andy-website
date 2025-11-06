/**
 * Open Graph Meta Tags Tests
 *
 * Tests to ensure proper Open Graph meta tags are present for:
 * - Social media sharing (Facebook, LinkedIn, etc.)
 * - Email preview services (Buttondown, etc.)
 * - Search engine rich results
 *
 * Key validations:
 * 1. All pages have required OG tags (type, url, title, description, image)
 * 2. Image dimensions are specified (required for email previews)
 * 3. Blog posts use og:type="article" while other pages use "website"
 * 4. Twitter Card tags are preserved
 *
 * NOTE: These tests require `npm run build` to be run first.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const hasBuildOutput = existsSync(distPath);

/**
 * Helper function to extract meta tag value from HTML
 */
function getMetaTag(html: string, property: string): string | null {
  const regex = new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

/**
 * Helper function to get all meta tags as key-value pairs
 */
function getAllMetaTags(html: string): Record<string, string> {
  const metaTags: Record<string, string> = {};
  const regex = /<meta\s+property="([^"]+)"\s+content="([^"]*)"/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    metaTags[match[1]] = match[2];
  }

  return metaTags;
}

describe.skipIf(!hasBuildOutput)('Open Graph Meta Tags - Required Tags', () => {
  const pages = [
    { path: 'index.html', name: 'Home Page' },
    { path: 'about/index.html', name: 'About Page' },
    { path: 'blog/all/index.html', name: 'Blog All Page' },
  ];

  pages.forEach(({ path, name }) => {
    describe(name, () => {
      const filePath = join(distPath, path);
      let html: string;

      it('should exist', () => {
        expect(existsSync(filePath)).toBe(true);
        html = readFileSync(filePath, 'utf-8');
      });

      it('should have og:type meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogType = getMetaTag(html, 'og:type');
        expect(ogType).toBeTruthy();
        expect(ogType).toBe('website');
      });

      it('should have og:url meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogUrl = getMetaTag(html, 'og:url');
        expect(ogUrl).toBeTruthy();
        expect(ogUrl).toMatch(/^https:\/\//);
      });

      it('should have og:title meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogTitle = getMetaTag(html, 'og:title');
        expect(ogTitle).toBeTruthy();
        expect(ogTitle!.length).toBeGreaterThan(0);
      });

      it('should have og:description meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogDescription = getMetaTag(html, 'og:description');
        expect(ogDescription).toBeTruthy();
        expect(ogDescription!.length).toBeGreaterThan(0);
      });

      it('should have og:image meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogImage = getMetaTag(html, 'og:image');
        expect(ogImage).toBeTruthy();
        expect(ogImage).toMatch(/^https:\/\//);
      });
    });
  });
});

describe.skipIf(!hasBuildOutput)('Open Graph Meta Tags - Image Dimensions', () => {
  const pages = [
    { path: 'index.html', name: 'Home Page' },
    { path: 'about/index.html', name: 'About Page' },
    { path: 'blog/all/index.html', name: 'Blog All Page' },
  ];

  pages.forEach(({ path, name }) => {
    describe(name, () => {
      const filePath = join(distPath, path);
      let html: string;

      it('should have og:image:width meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogImageWidth = getMetaTag(html, 'og:image:width');
        expect(ogImageWidth).toBeTruthy();
        expect(ogImageWidth).toBe('1200');
      });

      it('should have og:image:height meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogImageHeight = getMetaTag(html, 'og:image:height');
        expect(ogImageHeight).toBeTruthy();
        expect(ogImageHeight).toBe('800');
      });

      it('image dimensions should be numeric values', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogImageWidth = getMetaTag(html, 'og:image:width');
        const ogImageHeight = getMetaTag(html, 'og:image:height');

        expect(Number(ogImageWidth)).toBeGreaterThan(0);
        expect(Number(ogImageHeight)).toBeGreaterThan(0);
      });

      it('image dimensions should follow standard social media aspect ratios', () => {
        html = readFileSync(filePath, 'utf-8');
        const ogImageWidth = getMetaTag(html, 'og:image:width');
        const ogImageHeight = getMetaTag(html, 'og:image:height');

        const width = Number(ogImageWidth);
        const height = Number(ogImageHeight);
        const aspectRatio = width / height;

        // Common social media aspect ratios: 1.2 (1200x1000), 1.5 (1200x800), 1.91 (1200x630)
        // We're using 1.5 (1200x800)
        expect(aspectRatio).toBeCloseTo(1.5, 1);
      });
    });
  });
});

describe.skipIf(!hasBuildOutput)('Open Graph Meta Tags - Blog Posts', () => {
  const blogPost = 'blog/the-architect-builder-pattern/index.html';
  const filePath = join(distPath, blogPost);

  it('blog post should exist', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('should have og:type="article" for blog posts', () => {
    const html = readFileSync(filePath, 'utf-8');
    const ogType = getMetaTag(html, 'og:type');
    expect(ogType).toBe('article');
  });

  it('should have og:image with blog post hero image', () => {
    const html = readFileSync(filePath, 'utf-8');
    const ogImage = getMetaTag(html, 'og:image');
    expect(ogImage).toBeTruthy();
    expect(ogImage).toMatch(/^https:\/\//);
    expect(ogImage).toContain('/images/blog/');
  });

  it('should have og:image:width and og:image:height', () => {
    const html = readFileSync(filePath, 'utf-8');
    const ogImageWidth = getMetaTag(html, 'og:image:width');
    const ogImageHeight = getMetaTag(html, 'og:image:height');

    expect(ogImageWidth).toBe('1200');
    expect(ogImageHeight).toBe('800');
  });

  it('should have all required OG tags for articles', () => {
    const html = readFileSync(filePath, 'utf-8');
    const metaTags = getAllMetaTags(html);

    expect(metaTags['og:type']).toBe('article');
    expect(metaTags['og:url']).toBeTruthy();
    expect(metaTags['og:title']).toBeTruthy();
    expect(metaTags['og:description']).toBeTruthy();
    expect(metaTags['og:image']).toBeTruthy();
    expect(metaTags['og:image:width']).toBe('1200');
    expect(metaTags['og:image:height']).toBe('800');
  });
});

describe.skipIf(!hasBuildOutput)('Twitter Card Tags - Preserved', () => {
  const pages = [
    { path: 'index.html', name: 'Home Page' },
    { path: 'blog/the-architect-builder-pattern/index.html', name: 'Blog Post' },
  ];

  pages.forEach(({ path, name }) => {
    describe(name, () => {
      const filePath = join(distPath, path);
      let html: string;

      it('should have twitter:card meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const twitterCard = getMetaTag(html, 'twitter:card');
        expect(twitterCard).toBe('summary_large_image');
      });

      it('should have twitter:image meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const twitterImage = getMetaTag(html, 'twitter:image');
        expect(twitterImage).toBeTruthy();
        expect(twitterImage).toMatch(/^https:\/\//);
      });

      it('should have twitter:title meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const twitterTitle = getMetaTag(html, 'twitter:title');
        expect(twitterTitle).toBeTruthy();
      });

      it('should have twitter:description meta tag', () => {
        html = readFileSync(filePath, 'utf-8');
        const twitterDescription = getMetaTag(html, 'twitter:description');
        expect(twitterDescription).toBeTruthy();
      });
    });
  });
});

describe.skipIf(!hasBuildOutput)('Open Graph - Email Preview Compatibility', () => {
  it('Buttondown email preview should have all required tags', () => {
    const filePath = join(distPath, 'blog/the-architect-builder-pattern/index.html');
    const html = readFileSync(filePath, 'utf-8');
    const metaTags = getAllMetaTags(html);

    // Buttondown requires these tags for email previews
    expect(metaTags['og:image']).toBeTruthy();
    expect(metaTags['og:image:width']).toBe('1200');
    expect(metaTags['og:image:height']).toBe('800');
    expect(metaTags['og:title']).toBeTruthy();
    expect(metaTags['og:description']).toBeTruthy();
  });

  it('image dimensions should be reasonable for email clients', () => {
    const filePath = join(distPath, 'blog/the-architect-builder-pattern/index.html');
    const html = readFileSync(filePath, 'utf-8');

    const width = Number(getMetaTag(html, 'og:image:width'));
    const height = Number(getMetaTag(html, 'og:image:height'));

    // Email clients prefer images between 600-1200px width
    expect(width).toBeGreaterThanOrEqual(600);
    expect(width).toBeLessThanOrEqual(1200);

    // Height should be reasonable for display
    expect(height).toBeGreaterThanOrEqual(315); // Twitter minimum
    expect(height).toBeLessThanOrEqual(1200);
  });
});

// Informational test that always runs
describe('Open Graph Test Status', () => {
  it('should indicate if OG tests were skipped', () => {
    if (!hasBuildOutput) {
      console.log(
        '\n⚠️  Open Graph meta tag tests skipped - dist/ directory not found.\n' +
          'Run `npm run build` before running tests to enable OG tag validation.\n'
      );
    }
    expect(true).toBe(true);
  });
});
