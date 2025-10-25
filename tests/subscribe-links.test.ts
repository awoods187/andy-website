/**
 * Subscribe Page Link Validation Tests
 *
 * These tests ensure all external links and RSS URLs on the subscribe page
 * remain valid and don't break with future changes.
 *
 * Critical links tested:
 * - RSS feed URLs
 * - Feedly subscription link
 * - RSS reader links (NetNewsWire, Reeder, Inoreader)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Subscribe Page Links', () => {
  // Read the subscribe page content
  const subscribePage = readFileSync(
    join(process.cwd(), 'src/pages/subscribe.astro'),
    'utf-8'
  );

  describe('RSS Feed URLs', () => {
    it('should have correct RSS feed URL in code block', () => {
      expect(subscribePage).toContain('https://andywoods.me/rss.xml');
    });

    it('should have correct internal RSS feed link', () => {
      expect(subscribePage).toContain('href="/rss.xml"');
    });

    it('should have RSS feed URL exactly 2 times (code block + View RSS Feed button)', () => {
      const rssUrlMatches = subscribePage.match(/https:\/\/andywoods\.me\/rss\.xml/g);
      expect(rssUrlMatches).toHaveLength(2);
    });

    it('should have internal RSS link in View RSS Feed button', () => {
      const viewRssButton = subscribePage.match(
        /href="\/rss\.xml"[\s\S]*?View RSS Feed/
      );
      expect(viewRssButton).toBeTruthy();
    });
  });

  describe('Feedly Integration', () => {
    it('should have correct Feedly subscription URL', () => {
      const feedlyUrl = 'https://feedly.com/i/subscription/feed/https://andywoods.me/rss.xml';
      expect(subscribePage).toContain(feedlyUrl);
    });

    it('should have Feedly link in RSS explainer', () => {
      expect(subscribePage).toContain('href="https://feedly.com"');
    });

    it('should have proper rel attributes on Feedly links', () => {
      const feedlyLinkMatches = subscribePage.match(
        /href="https:\/\/feedly\.com[^"]*"[^>]*rel="noopener"/g
      );
      expect(feedlyLinkMatches).toBeTruthy();
      expect(feedlyLinkMatches!.length).toBeGreaterThan(0);
    });

    it('should open Feedly links in new tab', () => {
      const feedlyLinkMatches = subscribePage.match(
        /href="https:\/\/feedly\.com[^"]*"[^>]*target="_blank"/g
      );
      expect(feedlyLinkMatches).toBeTruthy();
    });
  });

  describe('RSS Reader Links in Explainer', () => {
    const expectedReaders = [
      { name: 'Feedly', url: 'https://feedly.com' },
      { name: 'NetNewsWire', url: 'https://netnewswire.com' },
      { name: 'Reeder', url: 'https://reederapp.com' },
      { name: 'Inoreader', url: 'https://www.inoreader.com' },
    ];

    expectedReaders.forEach(({ name, url }) => {
      it(`should have ${name} link: ${url}`, () => {
        expect(subscribePage).toContain(`href="${url}"`);
      });

      it(`should open ${name} link in new tab with noopener`, () => {
        const linkPattern = new RegExp(
          `href="${url.replace(/\./g, '\\.')}"[^>]*target="_blank"[^>]*rel="noopener"`
        );
        expect(subscribePage).toMatch(linkPattern);
      });
    });

    it('should have all 4 RSS readers listed', () => {
      expect(subscribePage).toContain('Feedly');
      expect(subscribePage).toContain('NetNewsWire');
      expect(subscribePage).toContain('Reeder');
      expect(subscribePage).toContain('Inoreader');
    });
  });

  describe('Subscribe Form Integration', () => {
    it('should import SubscribeForm component', () => {
      expect(subscribePage).toContain("import SubscribeForm from '../components/SubscribeForm.astro'");
    });

    it('should render SubscribeForm component', () => {
      expect(subscribePage).toContain('<SubscribeForm />');
    });
  });

  describe('Content Validation', () => {
    it('should have "Email Newsletter" section', () => {
      expect(subscribePage).toContain('📧 Email Newsletter');
    });

    it('should have "RSS Feed" section', () => {
      expect(subscribePage).toContain('📰 RSS Feed');
    });

    it('should have "Privacy Commitment" section', () => {
      expect(subscribePage).toContain('Privacy Commitment');
    });

    it('should mention Buttondown in privacy section', () => {
      expect(subscribePage).toContain('Buttondown');
    });

    it('should have "What\'s RSS?" explainer', () => {
      expect(subscribePage).toContain("What's RSS?");
    });
  });

  describe('Security Attributes', () => {
    it('should have rel="noopener" on all external links', () => {
      const externalLinks = subscribePage.match(/href="https:\/\/[^"]+"/g) || [];
      const linksWithNoopener = subscribePage.match(/href="https:\/\/[^"]+"\s+[^>]*rel="noopener"/g) || [];

      // All external links should have noopener
      expect(linksWithNoopener.length).toBe(externalLinks.length);
    });

    it('should open all external links in new tab', () => {
      const externalLinks = subscribePage.match(/href="https:\/\/[^"]+"/g) || [];
      const linksWithTargetBlank = subscribePage.match(/href="https:\/\/[^"]+"\s+[^>]*target="_blank"/g) || [];

      // All external links should open in new tab
      expect(linksWithTargetBlank.length).toBe(externalLinks.length);
    });
  });

  describe('Layout and Styling', () => {
    it('should use BaseLayout', () => {
      expect(subscribePage).toContain("import BaseLayout from '../layouts/BaseLayout.astro'");
    });

    it('should have responsive grid layout for subscription options', () => {
      expect(subscribePage).toContain('subscription-options');
      expect(subscribePage).toContain('grid-template-columns: 1fr 1fr');
    });
  });
});
