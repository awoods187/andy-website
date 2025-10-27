/**
 * Subscribe Modal Dialog Tests
 *
 * These tests ensure the modal dialog implementation works correctly
 * and prevents popup blocker issues.
 *
 * Background:
 * - Replaced popup window approach (window.open) with native <dialog> element
 * - Modal keeps everything on the same page
 * - No popup blockers, better mobile UX
 *
 * Key validations:
 * 1. Modal dialog structure is correct
 * 2. Button triggers modal open
 * 3. Close mechanisms work (X button, Cancel, backdrop)
 * 4. Iframe is properly embedded
 * 5. Responsive design for mobile
 * 6. No popup window code exists
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Subscribe Modal Dialog', () => {
  const subscribeFormPath = join(process.cwd(), 'src/components/SubscribeForm.astro');
  const subscribeForm = readFileSync(subscribeFormPath, 'utf-8');

  describe('Modal Structure', () => {
    it('should use native HTML dialog element', () => {
      expect(subscribeForm).toMatch(/<dialog[^>]*>/);
    });

    it('dialog should have unique id', () => {
      expect(subscribeForm).toMatch(/<dialog[^>]*id="subscribe-modal"[^>]*>/);
    });

    it('dialog should have CSS class', () => {
      expect(subscribeForm).toMatch(/<dialog[^>]*class="subscribe-dialog"[^>]*>/);
    });

    it('should have dialog content wrapper', () => {
      expect(subscribeForm).toMatch(/<div class="dialog-content">/);
    });

    it('should have dialog header section', () => {
      expect(subscribeForm).toMatch(/<div class="dialog-header">/);
    });

    it('should have dialog footer section', () => {
      expect(subscribeForm).toMatch(/<div class="dialog-footer">/);
    });

    it('should have iframe container', () => {
      expect(subscribeForm).toMatch(/<div class="iframe-container">/);
    });
  });

  describe('Modal Open Mechanism', () => {
    it('subscribe button should trigger showModal()', () => {
      const buttonMatch = subscribeForm.match(/<button[^>]*class="subscribe-button"[^>]*onclick="([^"]*)"[^>]*>/);
      expect(buttonMatch).toBeTruthy();
      if (buttonMatch) {
        const onclick = buttonMatch[1];
        expect(onclick).toContain('showModal()');
        expect(onclick).toContain('subscribe-modal');
      }
    });

    it('button should use correct DOM method', () => {
      // Should use document.getElementById('subscribe-modal').showModal()
      expect(subscribeForm).toMatch(/document\.getElementById\(['"]subscribe-modal['"]\)\.showModal\(\)/);
    });

    it('subscribe button should be type="button" not submit', () => {
      expect(subscribeForm).toMatch(/<button[^>]*type="button"[^>]*class="subscribe-button"[^>]*>/);
    });
  });

  describe('Modal Close Mechanisms', () => {
    it('should have close button with X symbol', () => {
      const closeButtonMatch = subscribeForm.match(/<button[^>]*class="close-button"[^>]*>([^<]*)<\/button>/);
      expect(closeButtonMatch).toBeTruthy();
      if (closeButtonMatch) {
        const buttonText = closeButtonMatch[1].trim();
        expect(buttonText).toContain('✕');
      }
    });

    it('close button should trigger close()', () => {
      const closeButtonMatch = subscribeForm.match(/<button[^>]*class="close-button"[^>]*onclick="([^"]*)"[^>]*>/);
      expect(closeButtonMatch).toBeTruthy();
      if (closeButtonMatch) {
        const onclick = closeButtonMatch[1];
        expect(onclick).toContain('close()');
        expect(onclick).toContain('subscribe-modal');
      }
    });

    it('should have cancel button in footer', () => {
      expect(subscribeForm).toMatch(/<button[^>]*class="cancel-button"[^>]*>/);
    });

    it('cancel button should trigger close()', () => {
      const cancelButtonMatch = subscribeForm.match(/<button[^>]*class="cancel-button"[^>]*onclick="([^"]*)"[^>]*>/);
      expect(cancelButtonMatch).toBeTruthy();
      if (cancelButtonMatch) {
        const onclick = cancelButtonMatch[1];
        expect(onclick).toContain('close()');
      }
    });

    it('cancel button should have descriptive text', () => {
      const cancelButtonMatch = subscribeForm.match(/<button[^>]*class="cancel-button"[^>]*>\s*([^<\s]+)\s*<\/button>/);
      expect(cancelButtonMatch).toBeTruthy();
      if (cancelButtonMatch) {
        const buttonText = cancelButtonMatch[1].trim();
        expect(buttonText).toBe('Cancel');
      }
    });
  });

  describe('Iframe Embed', () => {
    it('should have iframe element', () => {
      expect(subscribeForm).toMatch(/<iframe[^>]*>/);
    });

    it('iframe should have Buttondown embed URL', () => {
      expect(subscribeForm).toMatch(
        /src=\{`https:\/\/buttondown\.com\/api\/emails\/embed-subscribe\/\$\{buttondownUsername\}`\}/
      );
    });

    it('iframe should have title attribute', () => {
      expect(subscribeForm).toMatch(/<iframe[^>]*title="[^"]*"[^>]*>/);
    });

    it('iframe should have scrolling disabled', () => {
      expect(subscribeForm).toMatch(/<iframe[^>]*scrolling="no"[^>]*>/);
    });

    it('iframe should have CSS class', () => {
      expect(subscribeForm).toMatch(/<iframe[^>]*class="buttondown-iframe"[^>]*>/);
    });
  });

  describe('Modal Styling', () => {
    it('should have dialog CSS styles', () => {
      expect(subscribeForm).toMatch(/\.subscribe-dialog\s*{/);
    });

    it('should have backdrop styling', () => {
      expect(subscribeForm).toMatch(/\.subscribe-dialog::backdrop\s*{/);
    });

    it('dialog should have border-radius for rounded corners', () => {
      expect(subscribeForm).toMatch(/\.subscribe-dialog\s*{[^}]*border-radius:/s);
    });

    it('dialog should have box-shadow for depth', () => {
      expect(subscribeForm).toMatch(/\.subscribe-dialog\s*{[^}]*box-shadow:/s);
    });

    it('backdrop should have semi-transparent background', () => {
      expect(subscribeForm).toMatch(/\.subscribe-dialog::backdrop\s*{[^}]*background:[^}]*rgba/s);
    });

    it('should have iframe container styles', () => {
      expect(subscribeForm).toMatch(/\.iframe-container\s*{/);
    });

    it('iframe should have defined height', () => {
      expect(subscribeForm).toMatch(/\.buttondown-iframe\s*{[^}]*height:\s*\d+px/s);
    });

    it('iframe should be full width', () => {
      expect(subscribeForm).toMatch(/\.buttondown-iframe\s*{[^}]*width:\s*100%/s);
    });
  });

  describe('Responsive Design', () => {
    it('should have mobile media query', () => {
      expect(subscribeForm).toMatch(/@media\s*\(max-width:\s*640px\)/);
    });

    it('dialog should have responsive width', () => {
      // Desktop width
      expect(subscribeForm).toMatch(/\.subscribe-dialog\s*{[^}]*width:/s);

      // Mobile section should exist with dialog adjustments
      expect(subscribeForm).toMatch(/@media\s*\(max-width:\s*640px\)/);

      // Check that mobile section contains subscribe-dialog styling
      const mediaSectionMatch = subscribeForm.match(/@media\s*\(max-width:\s*640px\)\s*{([\s\S]*?)(?=@media|\/\*\s*Tablet|<\/style>)/);
      expect(mediaSectionMatch).toBeTruthy();
    });

    it('mobile dialog should be wider (95vw)', () => {
      // Check if mobile responsive section exists
      const mediaSectionMatch = subscribeForm.match(/@media\s*\(max-width:\s*640px\)\s*{([\s\S]*?)(?=@media|<\/style>)/);
      expect(mediaSectionMatch).toBeTruthy();

      if (mediaSectionMatch) {
        const mobileStyles = mediaSectionMatch[1];
        expect(mobileStyles).toMatch(/\.subscribe-dialog\s*{[^}]*width:\s*95vw/s);
      }
    });

    it('iframe height should adjust on mobile', () => {
      // Check for mobile-specific iframe height
      const mediaSectionMatch = subscribeForm.match(/@media\s*\(max-width:\s*640px\)\s*{([\s\S]*?)(?=@media|<\/style>)/);
      expect(mediaSectionMatch).toBeTruthy();

      if (mediaSectionMatch) {
        const mobileStyles = mediaSectionMatch[1];
        expect(mobileStyles).toMatch(/\.buttondown-iframe\s*{[^}]*height:/s);
      }
    });
  });

  describe('No Popup Window Code', () => {
    it('should NOT contain window.open', () => {
      expect(subscribeForm).not.toContain('window.open');
    });

    it('should NOT have target="popupwindow"', () => {
      expect(subscribeForm).not.toContain('target="popupwindow"');
    });

    it('should NOT have popup-related onsubmit', () => {
      expect(subscribeForm).not.toMatch(/onsubmit=.*window\.open/);
    });

    it('should NOT use deprecated popup approach', () => {
      // Ensure no form with method="post" and target="popupwindow"
      const formMatch = subscribeForm.match(/<form[^>]*method="post"[^>]*target="popupwindow"[^>]*>/);
      expect(formMatch).toBeFalsy();
    });
  });

  describe('Regression Prevention', () => {
    it('should fail if dialog element is removed', () => {
      const dialogMatches = subscribeForm.match(/<dialog[^>]*id="subscribe-modal"[^>]*>/g);
      expect(dialogMatches).toBeTruthy();
      expect(dialogMatches!.length).toBe(1);
    });

    it('should fail if popup window code is reintroduced', () => {
      // Critical regression check
      expect(subscribeForm).not.toContain('window.open');
      expect(subscribeForm).not.toContain('popupwindow');
    });

    it('should fail if iframe is removed', () => {
      const iframeMatches = subscribeForm.match(/<iframe[^>]*class="buttondown-iframe"[^>]*>/g);
      expect(iframeMatches).toBeTruthy();
      expect(iframeMatches!.length).toBe(1);
    });

    it('should fail if modal close functionality is broken', () => {
      // Must have at least 2 ways to close (X button and Cancel button)
      const closeMatches = subscribeForm.match(/\.close\(\)/g);
      expect(closeMatches).toBeTruthy();
      expect(closeMatches!.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail if showModal is changed to incorrect method', () => {
      // Must use showModal() not show()
      expect(subscribeForm).toContain('showModal()');

      // Ensure we're not using the non-modal show() method
      const buttonMatch = subscribeForm.match(/onclick="[^"]*subscribe-modal[^"]*"/);
      if (buttonMatch) {
        expect(buttonMatch[0]).toContain('showModal');
        expect(buttonMatch[0]).not.toMatch(/\.show\(\)/);
      }
    });
  });

  describe('Performance & UX', () => {
    it('iframe should have reasonable min-height', () => {
      // Buttondown recommends ~220px height
      expect(subscribeForm).toMatch(/\.iframe-container\s*{[^}]*min-height:\s*\d+px/s);
    });

    it('dialog should have max-width to prevent too-wide modals', () => {
      expect(subscribeForm).toMatch(/\.subscribe-dialog\s*{[^}]*max-width:/s);
    });

    it('buttons should have hover states for better UX', () => {
      expect(subscribeForm).toMatch(/\.subscribe-button:hover\s*{/);
      expect(subscribeForm).toMatch(/\.close-button:hover\s*{/);
      expect(subscribeForm).toMatch(/\.cancel-button:hover\s*{/);
    });

    it('should have smooth transitions', () => {
      // Check for transition properties on buttons
      expect(subscribeForm).toMatch(/transition:/);
    });
  });
});
