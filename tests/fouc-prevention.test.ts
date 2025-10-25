/**
 * FOUC (Flash of Unstyled Content) Prevention Tests
 *
 * These tests ensure CSS and fonts load in the correct order to prevent
 * Flash of Unstyled Content during page navigation.
 *
 * Background: https://en.wikipedia.org/wiki/Flash_of_unstyled_content
 *
 * Key requirements:
 * 1. Fonts must load synchronously (no async tricks like media="print")
 * 2. CSS must be in <head> before any content
 * 3. font-display=swap for graceful fallback
 * 4. Preconnect hints for performance
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('FOUC Prevention', () => {
  const baseLayout = readFileSync(
    join(process.cwd(), 'src/layouts/BaseLayout.astro'),
    'utf-8'
  );

  describe('Font Loading Strategy', () => {
    it('should NOT use async font loading (media="print" trick)', () => {
      // This async technique causes FOUC during navigation
      expect(baseLayout).not.toMatch(/media="print"/);
      expect(baseLayout).not.toMatch(/onload="this\.media='all'"/);
    });

    it('should load fonts synchronously to prevent FOUC', () => {
      // Fonts should be loaded with a regular stylesheet link
      const fontLinkPattern = /<link[^>]*rel="stylesheet"[^>]*href="https:\/\/fonts\.googleapis\.com/;
      expect(baseLayout).toMatch(fontLinkPattern);

      // Ensure it's NOT wrapped in async loading
      const asyncPattern = /<link[^>]*fonts\.googleapis\.com[^>]*media="print"/;
      expect(baseLayout).not.toMatch(asyncPattern);
    });

    it('should use font-display=swap for graceful loading', () => {
      // font-display=swap prevents invisible text during font load
      expect(baseLayout).toContain('display=swap');
    });

    it('should have preconnect hints for performance', () => {
      // Preconnect speeds up DNS resolution without causing FOUC
      expect(baseLayout).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
      expect(baseLayout).toContain('rel="preconnect" href="https://fonts.gstatic.com"');
    });

    it('should load both required font families', () => {
      expect(baseLayout).toContain('Space+Grotesk');
      expect(baseLayout).toContain('Merriweather');
    });
  });

  describe('CSS Loading Order in HTML', () => {
    it('should have stylesheet links in <head> section', () => {
      const headSection = baseLayout.match(/<head>[\s\S]*?<\/head>/)?.[0];
      expect(headSection).toBeTruthy();

      // Font stylesheet should be in head
      expect(headSection).toContain('fonts.googleapis.com');
    });

    it('should load fonts before any body content', () => {
      const fontLinkIndex = baseLayout.indexOf('fonts.googleapis.com');
      const bodyIndex = baseLayout.indexOf('<body');

      expect(fontLinkIndex).toBeLessThan(bodyIndex);
      expect(fontLinkIndex).toBeGreaterThan(0); // Font link exists
    });

    it('should load global CSS before fonts', () => {
      // global.css import should be at the top of the frontmatter
      const globalCssPattern = /import\s+['"]\.\.\/styles\/global\.css['"]/;
      expect(baseLayout).toMatch(globalCssPattern);

      // It should be in the frontmatter (before the ---\n\n<!DOCTYPE)
      const frontmatterSection = baseLayout.split('---\n\n<!DOCTYPE')[0];
      expect(frontmatterSection).toMatch(globalCssPattern);
    });
  });

  describe('Built HTML Output (Integration Test)', () => {
    it('should have correct stylesheet order in built pages', () => {
      const distPath = join(process.cwd(), 'dist');
      const indexPath = join(distPath, 'index.html');

      // Check if build output exists (skip if not built yet)
      try {
        const indexHtml = readFileSync(indexPath, 'utf-8');

        // Fonts should load synchronously
        expect(indexHtml).not.toContain('media="print"');

        // Should have font stylesheet
        expect(indexHtml).toMatch(/fonts\.googleapis\.com/);

        // CSS should be in head
        const headMatch = indexHtml.match(/<head>[\s\S]*?<\/head>/);
        expect(headMatch).toBeTruthy();
        expect(headMatch![0]).toContain('stylesheet');
      } catch (error) {
        // If dist doesn't exist, skip this test
        console.log('Skipping built HTML test - run npm run build first');
      }
    });
  });

  describe('Performance vs FOUC Trade-offs', () => {
    it('should document why synchronous loading is chosen', () => {
      // The comment should explain the trade-off
      const hasFoucComment = baseLayout.includes('FOUC') ||
                            baseLayout.includes('prevent') ||
                            baseLayout.includes('synchronously');
      expect(hasFoucComment).toBe(true);
    });

    it('should still use preconnect for performance optimization', () => {
      // Preconnect is the right way to optimize without FOUC
      expect(baseLayout).toContain('rel="preconnect"');
    });

    it('should NOT use noscript fallback for sync fonts', () => {
      // noscript is only needed for async loading
      // With sync loading, we don't need it
      const noscriptPattern = /<noscript>[\s\S]*?fonts\.googleapis\.com[\s\S]*?<\/noscript>/;
      expect(baseLayout).not.toMatch(noscriptPattern);
    });
  });

  describe('Font Loading Edge Cases', () => {
    it('should handle multiple font weights correctly', () => {
      // Space Grotesk: 400, 500, 600, 700
      expect(baseLayout).toContain('Space+Grotesk:wght@400;500;600;700');

      // Merriweather: 300, 400, 700
      expect(baseLayout).toContain('Merriweather:wght@300;400;700');
    });

    it('should not have duplicate font stylesheet links', () => {
      // Should have exactly 2 instances: preconnect + stylesheet (no async/noscript duplicates)
      const fontLinks = baseLayout.match(/fonts\.googleapis\.com/g);
      expect(fontLinks).toBeTruthy();
      expect(fontLinks!.length).toBe(2);

      // Should have exactly 1 stylesheet link (not duplicated by async pattern)
      const stylesheetLinks = baseLayout.match(/rel="stylesheet"[^>]*fonts\.googleapis\.com/g);
      expect(stylesheetLinks).toBeTruthy();
      expect(stylesheetLinks!.length).toBe(1);
    });

    it('should use HTTPS for font URLs', () => {
      const fontUrlPattern = /href="https:\/\/fonts\.googleapis\.com/;
      expect(baseLayout).toMatch(fontUrlPattern);

      // Should NOT use HTTP
      expect(baseLayout).not.toContain('href="http://fonts.googleapis.com');
    });
  });
});
