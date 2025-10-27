/**
 * Buttondown Integration Tests
 *
 * These tests ensure the Buttondown email subscription integration uses
 * the correct domain and API endpoints.
 *
 * Background:
 * - Buttondown migrated from buttondown.email to buttondown.com
 * - This test catches domain changes that would break subscriptions
 * - Updated to use iframe modal approach (no popup window)
 *
 * Key validations:
 * 1. Iframe uses correct Buttondown domain and API endpoint
 * 2. Privacy policy link uses correct domain
 * 3. No popup window blockers (uses modal dialog)
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

    it('iframe src should use buttondown.com API endpoint', () => {
      // Check for the correct iframe API endpoint
      expect(subscribeForm).toMatch(
        /src=\{`https:\/\/buttondown\.com\/api\/emails\/embed-subscribe\/\$\{buttondownUsername\}`\}/
      );
    });

    it('should NOT use popup window (window.open)', () => {
      // We replaced popup window with modal dialog to avoid popup blockers
      expect(subscribeForm).not.toContain('window.open');
      expect(subscribeForm).not.toContain('popupwindow');
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

  describe('Modal Dialog Configuration', () => {
    it('should use dialog element for modal', () => {
      expect(subscribeForm).toMatch(/<dialog[^>]*id="subscribe-modal"[^>]*>/);
    });

    it('should have iframe element with Buttondown embed', () => {
      expect(subscribeForm).toMatch(/<iframe[^>]*class="buttondown-iframe"[^>]*>/);
    });

    it('should have button to open modal dialog', () => {
      // Button should trigger showModal()
      expect(subscribeForm).toMatch(/onclick="[^"]*showModal\(\)"/);
    });

    it('should have close button functionality', () => {
      // Close button should trigger close()
      expect(subscribeForm).toMatch(/onclick="[^"]*close\(\)"/);
    });
  });

  describe('API Endpoint Format', () => {
    it('should use the correct API path structure in iframe', () => {
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

    it('should have at least 2 references to buttondown.com', () => {
      // 1. Iframe src URL
      // 2. Privacy policy link
      const matches = subscribeForm.match(/buttondown\.com/g);
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail if popup window approach is reintroduced', () => {
      // Ensure we don't accidentally go back to popup windows
      expect(subscribeForm).not.toContain('target="popupwindow"');
      expect(subscribeForm).not.toContain('window.open');
    });
  });
});
