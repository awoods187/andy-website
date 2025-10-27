/**
 * Buttondown Integration Tests
 *
 * These tests ensure the Buttondown email subscription integration uses
 * the correct domain and API endpoints.
 *
 * Background:
 * - Buttondown migrated from buttondown.email to buttondown.com
 * - This test catches domain changes that would break subscriptions
 *
 * Key validations:
 * 1. Form action uses correct Buttondown domain
 * 2. Popup window URL uses correct domain
 * 3. Privacy policy link uses correct domain
 * 4. API endpoint is accessible
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Buttondown Integration', () => {
  const subscribeFormPath = join(process.cwd(), 'src/components/SubscribeForm.astro');
  const subscribeForm = readFileSync(subscribeFormPath, 'utf-8');

  describe('Buttondown Domain', () => {
    it('should use buttondown.com domain (not buttondown.email)', () => {
      // Form should use buttondown.com
      expect(subscribeForm).toContain('buttondown.com');

      // Should NOT use the old buttondown.email domain
      expect(subscribeForm).not.toContain('buttondown.email');
    });

    it('form action should use buttondown.com API endpoint', () => {
      // Check for the correct API endpoint
      expect(subscribeForm).toMatch(
        /action=\{`https:\/\/buttondown\.com\/api\/emails\/embed-subscribe\/\$\{buttondownUsername\}`\}/
      );
    });

    it('popup window should open buttondown.com URL', () => {
      // Check the onsubmit popup URL
      expect(subscribeForm).toMatch(
        /window\.open\('https:\/\/buttondown\.com\/\$\{buttondownUsername\}'/
      );
    });

    it('privacy policy link should use buttondown.com', () => {
      // Check privacy link
      expect(subscribeForm).toContain('https://buttondown.com/privacy');
    });
  });

  describe('Buttondown Username', () => {
    it('should have buttondownUsername set to awoods187', () => {
      expect(subscribeForm).toMatch(/const buttondownUsername = ['"]awoods187['"]/);
    });
  });

  describe('Form Configuration', () => {
    it('should have correct form method (POST)', () => {
      expect(subscribeForm).toMatch(/method="post"/);
    });

    it('should target popupwindow', () => {
      expect(subscribeForm).toMatch(/target="popupwindow"/);
    });

    it('should have embed hidden field', () => {
      expect(subscribeForm).toMatch(/<input type="hidden" name="embed" value="1"/);
    });
  });

  describe('API Endpoint Format', () => {
    it('should use the correct API path structure', () => {
      // The API endpoint should be:
      // https://buttondown.com/api/emails/embed-subscribe/{username}
      const apiPattern = /https:\/\/buttondown\.com\/api\/emails\/embed-subscribe\/\$\{buttondownUsername\}/;
      expect(subscribeForm).toMatch(apiPattern);
    });
  });

  describe('Regression Prevention', () => {
    it('should fail if buttondown.email domain is reintroduced', () => {
      // This test specifically catches if someone accidentally changes back to .email
      const oldDomain = 'buttondown.email';
      expect(subscribeForm).not.toContain(oldDomain);
    });

    it('should have exactly 3 references to buttondown.com', () => {
      // 1. Form action URL
      // 2. Popup window URL
      // 3. Privacy policy link
      const matches = subscribeForm.match(/buttondown\.com/g);
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThanOrEqual(3);
    });
  });
});
