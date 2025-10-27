/**
 * Subscribe Form Accessibility Tests
 *
 * These tests ensure the subscribe form modal has proper accessibility features.
 * Updated for modal dialog approach with Buttondown iframe embed.
 *
 * Key validations:
 * 1. Modal dialog has proper ARIA attributes
 * 2. Subscribe button is accessible
 * 3. Close button has proper labels
 * 4. Iframe has proper title attribute
 * 5. Keyboard navigation works (focus management)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Subscribe Form Accessibility', () => {
  const subscribeFormPath = join(process.cwd(), 'src/components/SubscribeForm.astro');
  const content = readFileSync(subscribeFormPath, 'utf-8');

  it('SubscribeForm component should exist', () => {
    expect(content).toBeTruthy();
  });

  describe('Modal Dialog Accessibility', () => {
    it('dialog should have aria-labelledby attribute', () => {
      expect(content).toMatch(/<dialog[^>]*aria-labelledby="dialog-title"[^>]*>/);
    });

    it('dialog should have id="subscribe-modal"', () => {
      expect(content).toMatch(/<dialog[^>]*id="subscribe-modal"[^>]*>/);
    });

    it('dialog header should have h2 with id="dialog-title"', () => {
      expect(content).toMatch(/<h2[^>]*id="dialog-title"[^>]*>/);
    });

    it('dialog title should describe the modal purpose', () => {
      const titleMatch = content.match(/<h2[^>]*id="dialog-title"[^>]*>([^<]+)<\/h2>/);
      expect(titleMatch).toBeTruthy();
      if (titleMatch) {
        const titleText = titleMatch[1].trim();
        expect(titleText.length).toBeGreaterThan(0);
        expect(titleText.toLowerCase()).toContain('subscribe');
      }
    });
  });

  describe('Subscribe Button Accessibility', () => {
    it('subscribe button should have type="button"', () => {
      expect(content).toMatch(/<button[^>]*type="button"[^>]*class="subscribe-button"[^>]*>/);
    });

    it('subscribe button should have aria-haspopup attribute', () => {
      expect(content).toMatch(/<button[^>]*aria-haspopup="dialog"[^>]*>/);
    });

    it('subscribe button should have descriptive text', () => {
      const buttonMatch = content.match(/<button[^>]*class="subscribe-button"[^>]*>\s*([^<]+)\s*<\/button>/);
      expect(buttonMatch).toBeTruthy();
      if (buttonMatch) {
        const buttonText = buttonMatch[1].trim();
        expect(buttonText).toBe('Subscribe');
      }
    });
  });

  describe('Close Button Accessibility', () => {
    it('close button should have aria-label', () => {
      expect(content).toMatch(/<button[^>]*aria-label="Close subscription dialog"[^>]*>/);
    });

    it('close button should have type="button"', () => {
      const closeButtonMatch = content.match(/<button[^>]*class="close-button"[^>]*>/);
      expect(closeButtonMatch).toBeTruthy();
      if (closeButtonMatch) {
        expect(closeButtonMatch[0]).toContain('type="button"');
      }
    });

    it('cancel button should exist for keyboard users', () => {
      expect(content).toMatch(/<button[^>]*class="cancel-button"[^>]*>/);
    });
  });

  describe('Iframe Accessibility', () => {
    it('iframe should have title attribute', () => {
      expect(content).toMatch(/<iframe[^>]*title="[^"]*"[^>]*>/);
    });

    it('iframe title should be descriptive', () => {
      const iframeMatch = content.match(/<iframe[^>]*title="([^"]*)"[^>]*>/);
      expect(iframeMatch).toBeTruthy();
      if (iframeMatch) {
        const titleText = iframeMatch[1];
        expect(titleText.length).toBeGreaterThan(0);
        expect(titleText.toLowerCase()).toMatch(/newsletter|subscription|subscribe/);
      }
    });

    it('iframe should have scrolling="no" for better UX', () => {
      expect(content).toMatch(/<iframe[^>]*scrolling="no"[^>]*>/);
    });
  });

  describe('Focus Management', () => {
    it('close button should have focus-visible styling', () => {
      expect(content).toMatch(/\.close-button:focus-visible\s*{/);
    });

    it('subscribe button should have focus-visible styling', () => {
      expect(content).toMatch(/\.subscribe-button:focus-visible\s*{/);
    });

    it('cancel button should have focus-visible styling', () => {
      expect(content).toMatch(/\.cancel-button:focus-visible\s*{/);
    });
  });

  describe('Modal CSS Accessibility', () => {
    it('should have dialog backdrop styling', () => {
      expect(content).toMatch(/\.subscribe-dialog::backdrop\s*{/);
    });

    it('dialog should have proper visual styling', () => {
      expect(content).toMatch(/\.subscribe-dialog\s*{/);
    });

    it('should have dialog content wrapper', () => {
      expect(content).toMatch(/<div class="dialog-content">/);
    });
  });

  describe('Regression Prevention', () => {
    it('should fail if dialog loses aria-labelledby', () => {
      const dialogMatch = content.match(/<dialog[^>]*id="subscribe-modal"[^>]*>/);
      expect(dialogMatch).toBeTruthy();
      if (dialogMatch) {
        const dialogTag = dialogMatch[0];
        expect(dialogTag).toContain('aria-labelledby');
      }
    });

    it('should fail if iframe loses title attribute', () => {
      const iframeMatch = content.match(/<iframe[^>]*class="buttondown-iframe"[^>]*>/);
      expect(iframeMatch).toBeTruthy();
      if (iframeMatch) {
        const iframeTag = iframeMatch[0];
        expect(iframeTag).toContain('title=');
      }
    });

    it('should fail if close button loses aria-label', () => {
      const closeButtonMatch = content.match(/<button[^>]*class="close-button"[^>]*>/);
      expect(closeButtonMatch).toBeTruthy();
      if (closeButtonMatch) {
        const buttonTag = closeButtonMatch[0];
        expect(buttonTag).toContain('aria-label');
      }
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should have responsive styles for mobile', () => {
      // Should have mobile media query
      expect(content).toMatch(/@media\s*\(max-width:\s*640px\)/);
    });

    it('dialog should have mobile-specific width', () => {
      // Mobile dialog should be wider (95vw)
      expect(content).toMatch(/\.subscribe-dialog\s*{[^}]*width:\s*95vw/s);
    });

    it('iframe should adjust height on mobile', () => {
      // Iframe height should be adjustable for mobile
      expect(content).toMatch(/\.buttondown-iframe\s*{[^}]*height:/s);
    });
  });
});
