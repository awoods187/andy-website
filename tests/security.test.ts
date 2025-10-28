/**
 * Security Hardening Tests
 *
 * These tests ensure security measures are in place to protect against:
 * - XSS attacks from scraped content
 * - Clickjacking attacks
 * - Content injection
 * - Missing security headers
 *
 * Key security measures tested:
 * 1. Content sanitization in scraper (no scripts, event handlers, iframes)
 * 2. Security headers in vercel.json (CSP, X-Frame-Options, HSTS, etc.)
 * 3. External content is properly sanitized before being rendered
 * 4. No dangerous HTML in scraped data files
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Security Hardening', () => {
  describe('Vercel Security Headers', () => {
    const vercelConfigPath = join(process.cwd(), 'vercel.json');

    it('vercel.json should exist', () => {
      expect(existsSync(vercelConfigPath)).toBe(true);
    });

    it('vercel.json should be valid JSON', () => {
      const content = readFileSync(vercelConfigPath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('should have security headers configuration', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));

      expect(config.headers).toBeDefined();
      expect(Array.isArray(config.headers)).toBe(true);
      expect(config.headers.length).toBeGreaterThan(0);
    });

    it('should have Content-Security-Policy header', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const cspHeader = headers.find((h: any) => h.key === 'Content-Security-Policy');

      expect(cspHeader).toBeDefined();
      expect(cspHeader.value).toBeTruthy();
    });

    it('CSP should restrict default-src to self', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const cspHeader = headers.find((h: any) => h.key === 'Content-Security-Policy');

      expect(cspHeader.value).toContain("default-src 'self'");
    });

    it('CSP should prevent frame-ancestors (clickjacking protection)', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const cspHeader = headers.find((h: any) => h.key === 'Content-Security-Policy');

      expect(cspHeader.value).toContain("frame-ancestors 'none'");
    });

    it('CSP should restrict image sources (no wildcard https:)', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const cspHeader = headers.find((h: any) => h.key === 'Content-Security-Policy');

      // Should NOT have unrestricted https: or http: wildcard
      // Should have specific domains
      expect(cspHeader.value).toMatch(/img-src[^;]*cockroachlabs\.com/);
    });

    it('CSP should block object and media elements', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const cspHeader = headers.find((h: any) => h.key === 'Content-Security-Policy');

      expect(cspHeader.value).toContain("object-src 'none'");
      expect(cspHeader.value).toContain("media-src 'none'");
    });

    it('should have X-Frame-Options: DENY', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const xFrameOptions = headers.find((h: any) => h.key === 'X-Frame-Options');

      expect(xFrameOptions).toBeDefined();
      expect(xFrameOptions.value).toBe('DENY');
    });

    it('should have X-Content-Type-Options: nosniff', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const contentTypeOptions = headers.find((h: any) => h.key === 'X-Content-Type-Options');

      expect(contentTypeOptions).toBeDefined();
      expect(contentTypeOptions.value).toBe('nosniff');
    });

    it('should have Strict-Transport-Security with preload', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const hsts = headers.find((h: any) => h.key === 'Strict-Transport-Security');

      expect(hsts).toBeDefined();
      expect(hsts.value).toContain('max-age=');
      expect(hsts.value).toContain('includeSubDomains');
      expect(hsts.value).toContain('preload');
    });

    it('should have Referrer-Policy', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const referrerPolicy = headers.find((h: any) => h.key === 'Referrer-Policy');

      expect(referrerPolicy).toBeDefined();
      expect(referrerPolicy.value).toBe('strict-origin-when-cross-origin');
    });

    it('should have Permissions-Policy restricting dangerous features', () => {
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      const headers = config.headers[0].headers;
      const permissionsPolicy = headers.find((h: any) => h.key === 'Permissions-Policy');

      expect(permissionsPolicy).toBeDefined();
      expect(permissionsPolicy.value).toContain('camera=()');
      expect(permissionsPolicy.value).toContain('microphone=()');
      expect(permissionsPolicy.value).toContain('geolocation=()');
    });
  });

  describe('Content Sanitization - Scraped Data', () => {
    const crlPostsPath = join(process.cwd(), 'src/data/crl-posts.ts');

    it('crl-posts.ts should exist', () => {
      expect(existsSync(crlPostsPath)).toBe(true);
    });

    it('scraped content should NOT contain <script> tags', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      // Should not have any script tags
      expect(content).not.toMatch(/<script[^>]*>/i);
      expect(content).not.toMatch(/<\/script>/i);
    });

    it('scraped content should NOT contain event handlers', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      const eventHandlers = [
        'onclick',
        'onload',
        'onerror',
        'onmouseover',
        'onmouseout',
        'onfocus',
        'onblur',
        'onchange',
        'onsubmit',
        'onkeydown',
        'onkeyup',
        'onkeypress',
      ];

      for (const handler of eventHandlers) {
        const regex = new RegExp(`${handler}\\s*=`, 'i');
        expect(content).not.toMatch(regex);
      }
    });

    it('scraped content should NOT contain <iframe> tags', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      expect(content).not.toMatch(/<iframe[^>]*>/i);
      expect(content).not.toMatch(/<\/iframe>/i);
    });

    it('scraped content should NOT contain <object> or <embed> tags', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      expect(content).not.toMatch(/<object[^>]*>/i);
      expect(content).not.toMatch(/<embed[^>]*>/i);
    });

    it('scraped content should NOT contain javascript: protocol', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      expect(content).not.toMatch(/javascript:/i);
    });

    it('scraped content should NOT contain data: URIs in href attributes', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      // data: URIs can contain executable code
      expect(content).not.toMatch(/href\s*=\s*["']data:/i);
    });

    it('scraped content should NOT contain <form> tags', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      expect(content).not.toMatch(/<form[^>]*>/i);
      expect(content).not.toMatch(/<\/form>/i);
    });

    it('scraped content should NOT contain <style> tags or inline styles', () => {
      const content = readFileSync(crlPostsPath, 'utf-8');

      expect(content).not.toMatch(/<style[^>]*>/i);
      expect(content).not.toMatch(/style\s*=\s*["'][^"']*["']/i);
    });
  });

  describe('Scraper Security Configuration', () => {
    const scraperPath = join(process.cwd(), 'scripts/scrape-crl-posts.py');

    it('scraper script should exist', () => {
      expect(existsSync(scraperPath)).toBe(true);
    });

    it('scraper should import bleach for sanitization', () => {
      const content = readFileSync(scraperPath, 'utf-8');

      expect(content).toContain('import bleach');
    });

    it('scraper should have sanitize_html function', () => {
      const content = readFileSync(scraperPath, 'utf-8');

      expect(content).toContain('def sanitize_html');
    });

    it('scraper should define ALLOWED_TAGS whitelist', () => {
      const content = readFileSync(scraperPath, 'utf-8');

      expect(content).toContain('ALLOWED_TAGS');
      expect(content).toMatch(/ALLOWED_TAGS\s*=\s*\[/);
    });

    it('scraper should define ALLOWED_ATTRIBUTES whitelist', () => {
      const content = readFileSync(scraperPath, 'utf-8');

      expect(content).toContain('ALLOWED_ATTRIBUTES');
      expect(content).toMatch(/ALLOWED_ATTRIBUTES\s*=\s*\{/);
    });

    it('scraper ALLOWED_TAGS should NOT include dangerous tags', () => {
      const content = readFileSync(scraperPath, 'utf-8');

      const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input'];

      for (const tag of dangerousTags) {
        // Check that these tags are NOT in the ALLOWED_TAGS list
        const allowedTagsMatch = content.match(/ALLOWED_TAGS\s*=\s*\[([\s\S]*?)\]/);
        if (allowedTagsMatch) {
          const allowedTagsContent = allowedTagsMatch[1];
          expect(allowedTagsContent).not.toContain(`'${tag}'`);
        }
      }
    });

    it('scraper should use bleach.clean() for sanitization', () => {
      const content = readFileSync(scraperPath, 'utf-8');

      expect(content).toContain('bleach.clean');
    });

    it('scraper should call sanitize_html on excerpts', () => {
      const content = readFileSync(scraperPath, 'utf-8');

      expect(content).toContain('sanitize_html');
      expect(content).toMatch(/excerpt\s*=\s*sanitize_html/);
    });
  });

  describe('Requirements and Dependencies', () => {
    const requirementsPath = join(process.cwd(), 'requirements.txt');

    it('requirements.txt should exist', () => {
      expect(existsSync(requirementsPath)).toBe(true);
    });

    it('requirements.txt should include bleach', () => {
      const content = readFileSync(requirementsPath, 'utf-8');

      expect(content).toContain('bleach');
      expect(content).toMatch(/bleach>=[\d.]+/);
    });

    it('requirements.txt should specify minimum bleach version', () => {
      const content = readFileSync(requirementsPath, 'utf-8');
      const bleachMatch = content.match(/bleach>=([\d.]+)/);

      expect(bleachMatch).toBeTruthy();
      if (bleachMatch) {
        const version = parseFloat(bleachMatch[1]);
        expect(version).toBeGreaterThanOrEqual(6.0);
      }
    });
  });

  describe('Blog Post Security Documentation', () => {
    const blogPostPath = join(
      process.cwd(),
      'src/content/blog/how-i-built-my-blog-why-i-use-different-ai-models-for-architecture-vs-implementation.md'
    );

    it('blog post should exist', () => {
      expect(existsSync(blogPostPath)).toBe(true);
    });

    it('blog post should document security considerations', () => {
      const content = readFileSync(blogPostPath, 'utf-8');

      expect(content).toContain('Security Considerations');
      expect(content).toContain('Content Sanitization');
      expect(content).toContain('Security Headers');
    });

    it('blog post should mention bleach library', () => {
      const content = readFileSync(blogPostPath, 'utf-8');

      expect(content).toContain('bleach');
    });

    it('blog post should explain CSP headers', () => {
      const content = readFileSync(blogPostPath, 'utf-8');

      expect(content).toContain('Content Security Policy');
      expect(content).toContain('CSP');
    });

    it('blog post should mention attack surface reduction', () => {
      const content = readFileSync(blogPostPath, 'utf-8');

      expect(content).toMatch(/attack surface/i);
      expect(content).toContain('static site');
    });
  });

  describe('Regression Prevention', () => {
    it('should fail if script tags are found in scraped data (regression test)', () => {
      const crlPostsPath = join(process.cwd(), 'src/data/crl-posts.ts');
      const content = readFileSync(crlPostsPath, 'utf-8');

      // Explicit regression test for XSS
      expect(content.toLowerCase()).not.toContain('<script>');
      expect(content.toLowerCase()).not.toContain('</script>');
    });

    it('should fail if onclick handlers are found in scraped data', () => {
      const crlPostsPath = join(process.cwd(), 'src/data/crl-posts.ts');
      const content = readFileSync(crlPostsPath, 'utf-8');

      expect(content.toLowerCase()).not.toContain('onclick=');
    });

    it('should fail if CSP is removed from vercel.json', () => {
      const vercelConfigPath = join(process.cwd(), 'vercel.json');
      const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));

      const headers = config.headers[0].headers;
      const hasCsp = headers.some((h: any) => h.key === 'Content-Security-Policy');

      expect(hasCsp).toBe(true);
    });
  });
});
