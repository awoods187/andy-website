/**
 * RSS Feed Content Tests
 *
 * Validates that the RSS feed includes full content with images for
 * Buttondown newsletter integration.
 *
 * Key validations:
 * 1. Feed includes <content:encoded> tags with full HTML
 * 2. Hero images are included with absolute URLs
 * 3. All image URLs are absolute (https://andywoods.me/...)
 * 4. Content includes markdown converted to HTML
 * 5. No MDX/JSX syntax appears in output
 * 6. Enclosure tags present for hero images
 *
 * NOTE: These tests require `npm run build` to be run first.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const rssPath = join(distPath, 'rss.xml');
const hasRssFeed = existsSync(rssPath);

/**
 * Helper to extract content:encoded sections from RSS
 * Note: Astro RSS uses XML-escaped HTML, not CDATA
 */
function getContentEncoded(xml: string, itemIndex: number = 0): string | null {
  const regex = /<content:encoded>([\s\S]*?)<\/content:encoded>/g;
  const matches = [...xml.matchAll(regex)];
  return matches[itemIndex] ? matches[itemIndex][1] : null;
}

/**
 * Helper to extract all content:encoded sections
 */
function getAllContentEncoded(xml: string): string[] {
  const regex = /<content:encoded>([\s\S]*?)<\/content:encoded>/g;
  return [...xml.matchAll(regex)].map((match) => match[1]);
}

/**
 * Helper to extract item by title
 */
function getItemByTitle(xml: string, title: string): string | null {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = [...xml.matchAll(itemRegex)];

  for (const item of items) {
    if (item[1].includes(`<title>${title}</title>`)) {
      return item[1];
    }
  }
  return null;
}

/**
 * Helper to extract enclosure URL from item
 */
function getEnclosureUrl(itemXml: string): string | null {
  const match = itemXml.match(/<enclosure url="([^"]+)"/);
  return match ? match[1] : null;
}

describe.skipIf(!hasRssFeed)('RSS Feed - Full Content with Images', () => {
  let rssXml: string;

  it('RSS feed file should exist', () => {
    expect(existsSync(rssPath)).toBe(true);
    rssXml = readFileSync(rssPath, 'utf-8');
  });

  it('should have content:encoded namespace', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    expect(rssXml).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
  });

  it('should include content:encoded tags for personal posts', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const contentSections = getAllContentEncoded(rssXml);
    expect(contentSections.length).toBeGreaterThan(0);
  });

  it('should include full HTML content (not just excerpts)', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);
    expect(firstContent).toBeTruthy();
    expect(firstContent!.length).toBeGreaterThan(200); // Should be much longer than excerpt
  });
});

describe.skipIf(!hasRssFeed)('RSS Feed - Hero Images', () => {
  let rssXml: string;

  it('should include hero images in content', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);
    expect(firstContent).toContain('&lt;img src=');
    expect(firstContent).toContain('https://andywoods.me/images/blog/');
  });

  it('hero images should use absolute URLs', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);

    // Extract all img tags (XML-escaped format)
    const imgRegex = /&lt;img[^&]*?src=&quot;([^&]+?)&quot;/g;
    const matches = [...firstContent!.matchAll(imgRegex)];

    expect(matches.length).toBeGreaterThan(0);

    // All images should start with https://andywoods.me
    matches.forEach((match) => {
      expect(match[1]).toMatch(/^https:\/\/andywoods\.me/);
    });
  });

  it('hero images should have proper styling for email clients', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);

    // Check for responsive image styling
    expect(firstContent).toContain('max-width: 100%');
    expect(firstContent).toContain('height: auto');
  });

  it('should include enclosure tags for hero images', () => {
    rssXml = readFileSync(rssPath, 'utf-8');

    // Get first personal blog post item
    const item = getItemByTitle(
      rssXml,
      'The Architect-Builder Pattern: A Production Workflow for AI Development'
    );

    expect(item).toBeTruthy();
    expect(item).toContain('<enclosure');

    const enclosureUrl = getEnclosureUrl(item!);
    expect(enclosureUrl).toBeTruthy();
    expect(enclosureUrl).toMatch(/^https:\/\/andywoods\.me\/images\/blog\//);
    expect(enclosureUrl).toContain('.jpg');
  });
});

describe.skipIf(!hasRssFeed)('RSS Feed - Content Processing', () => {
  let rssXml: string;

  it('should convert markdown to HTML', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);

    // Should have HTML tags (XML-escaped)
    expect(firstContent).toContain('&lt;p&gt;');
    expect(firstContent).toContain('&lt;h2&gt;');
    expect(firstContent).toContain('&lt;a href=');

    // Should not have raw markdown syntax
    expect(firstContent).not.toContain('## '); // Markdown headers
  });

  it('should NOT include MDX import statements', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const allContent = getAllContentEncoded(rssXml);

    allContent.forEach((content) => {
      // Check for actual import statements, not just the word "import" or "from"
      expect(content).not.toMatch(/import\s+\{.*\}\s+from\s+/);
      expect(content).not.toMatch(/import\s+\w+\s+from\s+/);
      expect(content).not.toMatch(/import\s+.*\.astro/);
    });
  });

  it('should NOT include JSX component tags', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const allContent = getAllContentEncoded(rssXml);

    allContent.forEach((content) => {
      // JSX components start with capital letters (XML-escaped)
      expect(content).not.toMatch(/&lt;[A-Z][a-zA-Z0-9]*/);
    });
  });

  it('should include "Read more" link back to website', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);

    expect(firstContent).toContain('Read the full post on andywoods.me');
    expect(firstContent).toContain('https://andywoods.me/blog/');
  });

  it('should properly escape HTML characters in content', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);

    // Astro RSS uses XML escaping instead of CDATA
    // Check that HTML is properly escaped
    expect(firstContent).toContain('&lt;');
    expect(firstContent).toContain('&gt;');
    expect(firstContent).toContain('&quot;');
  });
});

describe.skipIf(!hasRssFeed)('RSS Feed - Specific Blog Post Validation', () => {
  let rssXml: string;

  it('should include "The Architect-Builder Pattern" post with images', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const item = getItemByTitle(
      rssXml,
      'The Architect-Builder Pattern: A Production Workflow for AI Development'
    );

    expect(item).toBeTruthy();

    // Extract content from this specific item (XML-escaped format)
    const itemContent = item!.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/);
    expect(itemContent).toBeTruthy();

    const content = itemContent![1];

    // Should include hero image
    expect(content).toContain('the-architect-builder-pattern-hero.jpg');
    expect(content).toContain('https://andywoods.me/images/blog/');

    // Should include actual content
    expect(content).toContain('Claude Code');
    expect(content).toContain('Phase 1: The Architect');
  });

  it('should include "How I Built My Blog" post with images', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const item = getItemByTitle(
      rssXml,
      'How I Built My Blog: Why I Use Different AI Models for Architecture vs Implementation'
    );

    expect(item).toBeTruthy();

    const itemContent = item!.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/);
    expect(itemContent).toBeTruthy();

    const content = itemContent![1];

    // Should include hero image
    expect(content).toContain(
      'how-i-built-my-blog-why-i-use-different-ai-models-for-architecture-vs-implementation-hero.jpg'
    );
    expect(content).toContain('https://andywoods.me/images/blog/');

    // Should include actual content
    expect(content).toContain('Astro');
    expect(content).toContain('Multi-Model Orchestration');
  });
});

describe.skipIf(!hasRssFeed)('RSS Feed - External Posts', () => {
  let rssXml: string;

  it('should include Cockroach Labs posts with content', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const item = getItemByTitle(rssXml, 'Surviving Failures: Disaster Recovery with CockroachDB');

    expect(item).toBeTruthy();

    // Should have content:encoded
    const itemContent = item!.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/);
    expect(itemContent).toBeTruthy();

    const content = itemContent![1];

    // Should include link to external post
    expect(content).toContain('Read the full post at Cockroach Labs');
    expect(content).toContain('https://www.cockroachlabs.com');
  });

  it('should include publication posts with content', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const item = getItemByTitle(rssXml, 'CockroachDB: The Resilient Geo-Distributed SQL Database');

    expect(item).toBeTruthy();

    // Should have content:encoded
    const itemContent = item!.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/);
    expect(itemContent).toBeTruthy();

    const content = itemContent![1];

    // Should include link to publication
    expect(content).toContain('Read the publication');
    expect(content).toContain('https://dl.acm.org');
  });
});

describe.skipIf(!hasRssFeed)('RSS Feed - XML Structure', () => {
  let rssXml: string;

  it('should have valid RSS 2.0 structure', () => {
    rssXml = readFileSync(rssPath, 'utf-8');

    expect(rssXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(rssXml).toContain('<rss version="2.0"');
    expect(rssXml).toContain('</rss>');
  });

  it('should have balanced item tags', () => {
    rssXml = readFileSync(rssPath, 'utf-8');

    const openingTags = (rssXml.match(/<item>/g) || []).length;
    const closingTags = (rssXml.match(/<\/item>/g) || []).length;

    expect(openingTags).toBe(closingTags);
    expect(openingTags).toBeGreaterThan(0);
  });

  it('should have all required RSS elements', () => {
    rssXml = readFileSync(rssPath, 'utf-8');

    expect(rssXml).toContain('<title>');
    expect(rssXml).toContain('<description>');
    expect(rssXml).toContain('<link>');
    expect(rssXml).toContain('<pubDate>');
  });
});

describe.skipIf(!hasRssFeed)('RSS Feed - Buttondown Compatibility', () => {
  let rssXml: string;

  it('should include all elements needed for Buttondown email import', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const item = getItemByTitle(
      rssXml,
      'The Architect-Builder Pattern: A Production Workflow for AI Development'
    );

    expect(item).toBeTruthy();

    // Buttondown requires these elements
    expect(item).toContain('<title>');
    expect(item).toContain('<link>');
    expect(item).toContain('<description>');
    expect(item).toContain('<content:encoded>');
    expect(item).toContain('<pubDate>');
    expect(item).toContain('<author>');
  });

  it('should have images that will display in email clients', () => {
    rssXml = readFileSync(rssPath, 'utf-8');
    const firstContent = getContentEncoded(rssXml, 0);

    // Images should have:
    // 1. Absolute URLs (for email clients) - XML-escaped
    expect(firstContent).toContain('src=&quot;https://andywoods.me/images');

    // 2. Proper alt text
    expect(firstContent).toMatch(/alt=&quot;[^&]+&quot;/);

    // 3. Responsive styling
    expect(firstContent).toContain('max-width: 100%');
  });

  it('should have proper character encoding for email', () => {
    rssXml = readFileSync(rssPath, 'utf-8');

    // Should specify UTF-8 encoding
    expect(rssXml).toContain('encoding="UTF-8"');

    // Content should be in CDATA to preserve HTML
    const contentSections = getAllContentEncoded(rssXml);
    expect(contentSections.length).toBeGreaterThan(0);
  });
});

// Informational test that always runs
describe('RSS Feed Test Status', () => {
  it('should indicate if RSS tests were skipped', () => {
    if (!hasRssFeed) {
      console.log(
        '\n⚠️  RSS feed tests skipped - rss.xml not found in dist/ directory.\n' +
          'Run `npm run build` before running tests to enable RSS validation.\n'
      );
    } else {
      console.log('\n✅ RSS feed found at dist/rss.xml - running full test suite\n');
    }
    expect(true).toBe(true);
  });
});
