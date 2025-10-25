/**
 * Subscribe Form Accessibility Tests
 *
 * These tests ensure the subscribe form has proper labels and accessibility features.
 * This prevents UX issues where users can't tell what fields are for.
 *
 * Key validations:
 * 1. Email input has a visible label
 * 2. Label is properly associated with input (for attribute)
 * 3. Form has required attributes for accessibility
 * 4. No reliance only on placeholders for field identification
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Subscribe Form Accessibility', () => {
  const subscribeFormPath = join(process.cwd(), 'src/components/SubscribeForm.astro');

  it('SubscribeForm component should exist', () => {
    const content = readFileSync(subscribeFormPath, 'utf-8');
    expect(content).toBeTruthy();
  });

  describe('Email Input Label', () => {
    it('should have a visible label for the email input', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Should have a label element
      expect(content).toMatch(/<label[^>]*for="bd-email"[^>]*>/);

      // Label should NOT be visually hidden (this was the bug)
      const labelMatch = content.match(/<label[^>]*for="bd-email"[^>]*class="([^"]*)"[^>]*>/);
      if (labelMatch) {
        const classes = labelMatch[1];
        expect(classes).not.toContain('visually-hidden');
        expect(classes).not.toContain('sr-only');
        expect(classes).not.toContain('hidden');
      }
    });

    it('label should contain "Email address" text', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Extract the label content
      const labelMatch = content.match(/<label[^>]*for="bd-email"[^>]*>([^<]+)<\/label>/);
      expect(labelMatch).toBeTruthy();

      if (labelMatch) {
        const labelText = labelMatch[1].trim();
        expect(labelText).toBe('Email address');
      }
    });

    it('label should have email-label class for styling', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Should have the email-label class
      expect(content).toMatch(/<label[^>]*class="email-label"[^>]*>/);
    });

    it('email input should have proper id matching label for attribute', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Label should have for="bd-email"
      expect(content).toMatch(/<label[^>]*for="bd-email"[^>]*>/);

      // Input should have id="bd-email"
      expect(content).toMatch(/<input[^>]*id="bd-email"[^>]*>/);
    });
  });

  describe('Form Structure', () => {
    it('should wrap input and button in input-button-group', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Should have input-button-group div
      expect(content).toMatch(/<div class="input-button-group">/);
    });

    it('form-group should use flexbox column layout', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // CSS should set form-group to flex-direction: column
      expect(content).toMatch(/\.form-group\s*{[^}]*flex-direction:\s*column/s);
    });

    it('should have email-label CSS styling', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Should have CSS for .email-label
      expect(content).toMatch(/\.email-label\s*{/);

      // Should have font-weight and color
      expect(content).toMatch(/\.email-label\s*{[^}]*font-weight:/s);
      expect(content).toMatch(/\.email-label\s*{[^}]*color:/s);
    });
  });

  describe('Accessibility Attributes', () => {
    it('email input should have type="email"', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');
      expect(content).toMatch(/<input[^>]*type="email"[^>]*>/);
    });

    it('email input should have required attribute', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');
      expect(content).toMatch(/<input[^>]*required[^>]*>/);
    });

    it('email input should have autocomplete="email"', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');
      expect(content).toMatch(/<input[^>]*autocomplete="email"[^>]*>/);
    });

    it('email input should have aria-label for screen readers', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');
      expect(content).toMatch(/<input[^>]*aria-label="[^"]*"[^>]*>/);
    });
  });

  describe('Regression Prevention', () => {
    it('should fail if label is made visually-hidden again', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // This test ensures we don't accidentally hide the label again
      const labelMatch = content.match(/<label[^>]*for="bd-email"[^>]*>/);
      expect(labelMatch).toBeTruthy();

      if (labelMatch) {
        const labelTag = labelMatch[0];
        // Should NOT contain visually-hidden class
        expect(labelTag).not.toContain('class="visually-hidden"');
        expect(labelTag).not.toContain('sr-only');
      }
    });

    it('should fail if label is removed entirely', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Count label elements for bd-email
      const labelMatches = content.match(/<label[^>]*for="bd-email"[^>]*>/g);

      expect(labelMatches).toBeTruthy();
      expect(labelMatches!.length).toBeGreaterThan(0);
    });

    it('should have visible label text (not empty)', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      const labelMatch = content.match(/<label[^>]*for="bd-email"[^>]*>([^<]+)<\/label>/);
      expect(labelMatch).toBeTruthy();

      if (labelMatch) {
        const labelText = labelMatch[1].trim();
        expect(labelText.length).toBeGreaterThan(0);
        expect(labelText).not.toBe('');
      }
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should have responsive styles for mobile', () => {
      const content = readFileSync(subscribeFormPath, 'utf-8');

      // Should have mobile media query
      expect(content).toMatch(/@media\s*\(max-width:\s*640px\)/);

      // Should have input-button-group with flex-direction column in responsive section
      expect(content).toMatch(/\.input-button-group\s*{[^}]*flex-direction:\s*column/s);
    });
  });
});
