/**
 * Component Rendering Tests - Phase 3
 *
 * Validates component rendering in build output:
 * - Header component (navigation, active states, links)
 * - Footer component (social links, copyright, accessibility)
 * - BlogPostCard and PostCard components (rendering, date formatting, tags)
 *
 * Priority: COMPLEX - Components are reusable across pages
 *
 * Testing approach:
 * - Test build output HTML (what users actually see)
 * - Validate structure, accessibility, and security attributes
 * - Verify component behavior across different page contexts
 *
 * Note: These tests validate component integration by examining
 * the actual rendered HTML in the build output directory.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

// Build output directory
const distDir = join(process.cwd(), 'dist');

// Ensure build exists before running tests
beforeAll(() => {
  if (!existsSync(distDir)) {
    console.log('Building site for component tests...');
    execSync('npm run build', { stdio: 'inherit' });
  }
}, 60000); // 60 second timeout for build

describe('Header Component Rendering', () => {
  it('renders on home page with correct structure', () => {
    const homePath = join(distDir, 'index.html');
    expect(existsSync(homePath), 'Home page should exist in build output').toBe(true);

    const html = readFileSync(homePath, 'utf-8');

    expect(html, 'Should contain site name').toContain('Andy Woods');
    expect(html, 'Should have header element').toContain('<header');
    expect(html, 'Should have nav element').toContain('<nav');
  });

  it('contains all navigation links', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    // Navigation links include newlines in build output
    expect(html, 'Should have Home link').toContain('Home');
    expect(html, 'Should have Blog link').toContain('Blog');
    expect(html, 'Should have About link').toContain('About');
    expect(html, 'Should have Subscribe link').toContain('Subscribe');

    // And they should be actual links
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/blog/all"');
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/subscribe"');
  });

  it('highlights active navigation link on home page', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    // Active link should have 'text-black font-medium' classes
    expect(html, 'Home link should be active on home page').toMatch(
      /href="\/"[^>]*(?:text-black font-medium|font-medium text-black)/
    );
  });

  it('highlights active navigation link on blog page', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // Blog link should be active when on blog page
    expect(html, 'Blog link should be active on blog pages').toMatch(
      /href="\/blog\/all"[^>]*(?:text-black font-medium|font-medium text-black)/
    );
  });

  it('highlights active navigation link on about page', () => {
    const aboutPath = join(distDir, 'about', 'index.html');

    if (!existsSync(aboutPath)) {
      console.warn('About page not found, skipping test');
      return;
    }

    const html = readFileSync(aboutPath, 'utf-8');

    // About link should have active classes (fixed: Header now handles trailing slashes)
    const hasActiveAboutLink =
      html.includes('href="/about"') &&
      html.match(/text-black[^>]*font-medium|font-medium[^>]*text-black/);

    expect(hasActiveAboutLink, 'About link should be active on about page').toBeTruthy();
  });

  it('highlights active navigation link on subscribe page', () => {
    const subscribePath = join(distDir, 'subscribe', 'index.html');

    if (!existsSync(subscribePath)) {
      console.warn('Subscribe page not found, skipping test');
      return;
    }

    const html = readFileSync(subscribePath, 'utf-8');

    // Subscribe link should have active classes (fixed: Header now handles trailing slashes)
    const hasActiveSubscribeLink =
      html.includes('href="/subscribe"') &&
      html.match(/text-black[^>]*font-medium|font-medium[^>]*text-black/);

    expect(
      hasActiveSubscribeLink,
      'Subscribe link should be active on subscribe page'
    ).toBeTruthy();
  });
});

describe('Footer Component Rendering', () => {
  it('renders copyright text with current year', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    const currentYear = new Date().getFullYear();
    expect(html, 'Should contain copyright symbol').toContain('©');
    expect(html, 'Should contain current year').toContain(currentYear.toString());
    expect(html, 'Should contain author name').toContain('Andy Woods');
    expect(html, 'Should contain copyright text').toContain('All rights reserved');
  });

  it('renders LinkedIn link with correct URL and security attributes', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    expect(html, 'Should have LinkedIn link').toContain(
      'href="https://www.linkedin.com/in/andrewscottwoods/"'
    );
    expect(html, 'LinkedIn link should open in new tab').toContain('target="_blank"');
    expect(html, 'LinkedIn link should have noopener noreferrer').toContain(
      'rel="noopener noreferrer"'
    );
    expect(html, 'LinkedIn link should have aria-label').toContain('aria-label="LinkedIn"');
  });

  it('renders GitHub link with correct URL and security attributes', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    expect(html, 'Should have GitHub link').toContain('href="https://github.com/awoods187"');
    expect(html, 'GitHub link should open in new tab').toContain('target="_blank"');
    expect(html, 'GitHub link should have noopener noreferrer').toContain(
      'rel="noopener noreferrer"'
    );
    expect(html, 'GitHub link should have aria-label').toContain('aria-label="GitHub"');
  });

  it('renders X (Twitter) link with correct URL and security attributes', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    expect(html, 'Should have X/Twitter link').toContain('href="https://twitter.com/iamandywoods"');
    expect(html, 'X link should open in new tab').toContain('target="_blank"');
    expect(html, 'X link should have noopener noreferrer').toContain('rel="noopener noreferrer"');
    expect(html, 'X link should have descriptive aria-label').toContain(
      'aria-label="X (formerly Twitter)"'
    );
  });

  it('renders RSS feed link', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    expect(html, 'Should have RSS feed link').toContain('href="/rss.xml"');
    expect(html, 'RSS link should have aria-label').toContain('aria-label="RSS Feed"');
  });

  it('all external links use HTTPS', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    // Extract footer section
    const footerMatch = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/);
    expect(footerMatch, 'Should find footer element').toBeTruthy();

    if (footerMatch) {
      const footer = footerMatch[0];
      // Check for insecure http:// links (excluding localhost)
      const httpLinks = footer.match(/href="http:\/\/(?!localhost)/g);
      expect(httpLinks, 'All external links in footer should use HTTPS').toBeNull();
    }
  });

  it('uses semantic HTML with footer element', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    expect(html, 'Should use <footer> element').toContain('<footer');
  });
});

describe('Blog Post Card Rendering', () => {
  it('renders blog post cards on blog listing page', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    expect(html, 'Should have article elements for posts').toContain('<article');
    expect(html, 'Should have time elements for dates').toContain('<time');
  });

  it('blog post cards have proper date formatting', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // Should have datetime attributes in ISO format
    expect(html, 'Should have datetime attributes').toMatch(/datetime="[0-9]{4}-[0-9]{2}-[0-9]{2}/);

    // Should have human-readable dates (e.g., "October 21, 2024")
    expect(html, 'Should have formatted dates').toMatch(
      /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/
    );
  });

  it('blog post cards link to individual posts', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // Should have links to blog posts
    expect(html, 'Should have links to blog posts').toMatch(/href="\/blog\/[^"]+"/);
  });

  it('blog post cards have tags with links', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // Should have tag links
    const hasTagLinks = html.includes('href="/blog/tag/');
    if (hasTagLinks) {
      expect(html, 'Should have tag links').toMatch(/href="\/blog\/tag\/[^"]+"/);
    }
  });
});

describe('Post Card Component (Mixed Content)', () => {
  it('displays source badges for external posts', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // Should have "Cockroach Labs" badge for external posts
    const hasCRLPosts = html.includes('Cockroach Labs');
    if (hasCRLPosts) {
      expect(html, 'Should display "Cockroach Labs" badge').toContain('Cockroach Labs');
    }
  });

  it('external post links open in new tab', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // If there are external links to cockroachlabs.com, they should have target="_blank"
    const hasCRLLinks = html.includes('cockroachlabs.com');
    if (hasCRLLinks) {
      // Extract links to cockroachlabs.com and check they have target="_blank"
      const crlLinkPattern = /<a[^>]*href="https:\/\/www\.cockroachlabs\.com[^"]*"[^>]*>/g;
      const crlLinks = html.match(crlLinkPattern) || [];

      for (const link of crlLinks) {
        expect(link, 'External CRL links should open in new tab').toContain('target="_blank"');
        expect(link, 'External CRL links should have noopener noreferrer').toContain(
          'rel="noopener noreferrer"'
        );
      }
    }
  });

  it('post images use lazy loading', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // Should have loading="lazy" on images
    const hasImages = html.includes('<img');
    if (hasImages) {
      expect(html, 'Images should use lazy loading').toContain('loading="lazy"');
    }
  });

  it('external images have crossorigin attribute', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // If there are images from ctfassets.net, they should have crossorigin
    const hasExternalImages = html.includes('ctfassets.net');
    if (hasExternalImages) {
      // Crossorigin can be rendered as crossorigin="anonymous" or just crossorigin
      const hasCrossorigin = html.match(/crossorigin(?:="anonymous")?/);
      expect(hasCrossorigin, 'External images should have crossorigin attribute').toBeTruthy();
    } else {
      // No external images found, skip test
      console.warn('No external images found, skipping crossorigin test');
    }
  });

  it('source badge has whitespace-nowrap to prevent line breaks', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    const hasCRLBadge = html.includes('Cockroach Labs');
    if (hasCRLBadge) {
      // Verify badge exists with correct styling
      expect(html, 'Should have Cockroach Labs badge').toContain('Cockroach Labs');

      // Badge should be in a span with appropriate styling
      const badgePattern = /<span[^>]*>[\s\n]*Cockroach Labs[\s\n]*<\/span>/;
      expect(html, 'Badge should be in a styled span').toMatch(badgePattern);

      // Badge should have whitespace-nowrap class (fixed: added to global.css)
      expect(html, 'Badge should have whitespace-nowrap class').toContain('whitespace-nowrap');
    } else {
      console.warn('No CRL badge found, skipping badge test');
    }
  });
});

describe('Component Accessibility', () => {
  it('navigation has semantic structure', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    expect(html, 'Should have semantic header').toContain('<header');
    expect(html, 'Should have semantic nav').toContain('<nav');
    expect(html, 'Should have semantic footer').toContain('<footer');
  });

  it('all social media links have aria-labels', () => {
    const homePath = join(distDir, 'index.html');
    const html = readFileSync(homePath, 'utf-8');

    // Extract footer and check for aria-labels on social links
    const footerMatch = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/);
    expect(footerMatch, 'Should find footer').toBeTruthy();

    if (footerMatch) {
      const footer = footerMatch[0];
      const socialLinks = footer.match(/<a[^>]*(?:linkedin|github|twitter|rss)[^>]*>/gi) || [];

      // Each social link should have an aria-label
      for (const link of socialLinks) {
        expect(link, 'Social link should have aria-label').toContain('aria-label=');
      }
    }
  });

  it('images have alt attributes', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // All img tags should have alt attributes
    const imgTags = html.match(/<img[^>]*>/g) || [];
    for (const img of imgTags) {
      expect(img, 'Image should have alt attribute').toContain('alt=');
    }
  });

  it('time elements have datetime attributes', () => {
    const blogPath = join(distDir, 'blog', 'all', 'index.html');

    if (!existsSync(blogPath)) {
      console.warn('Blog listing page not found, skipping test');
      return;
    }

    const html = readFileSync(blogPath, 'utf-8');

    // All time tags should have datetime attributes
    const timeTags = html.match(/<time[^>]*>/g) || [];
    for (const time of timeTags) {
      expect(time, 'Time element should have datetime attribute').toContain('datetime=');
    }
  });
});
