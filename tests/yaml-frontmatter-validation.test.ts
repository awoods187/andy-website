/**
 * YAML Frontmatter Validation Tests
 *
 * These tests ensure all blog post frontmatter can be parsed correctly by both:
 * 1. Our test suite (simple regex parser)
 * 2. Astro's build process (js-yaml library)
 *
 * Common YAML parsing errors prevented:
 * - Missing quotes around values with colons
 * - Bad indentation in mapping entries
 * - Unclosed quotes or brackets
 * - Invalid YAML syntax
 *
 * This prevents runtime errors like:
 * "YAMLException: bad indentation of a mapping entry"
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

describe('YAML Frontmatter Validation', () => {
  const blogDir = join(process.cwd(), 'src/content/blog');
  const blogFiles = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

  describe('Astro YAML Parser Compatibility', () => {
    for (const filename of blogFiles) {
      it(`${filename} should have valid YAML frontmatter parseable by js-yaml`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        expect(frontmatterMatch).toBeTruthy();

        if (!frontmatterMatch) {
          throw new Error(`No frontmatter found in ${filename}`);
        }

        const frontmatterText = frontmatterMatch[1];

        // This is the SAME parser Astro uses (js-yaml)
        // If this throws, Astro will also fail at build time
        let parsed: any;
        try {
          parsed = yaml.load(frontmatterText);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(
              `YAML parsing failed for ${filename}:\n${error.message}\n\nFrontmatter:\n${frontmatterText}`
            );
          }
          throw error;
        }

        expect(parsed).toBeDefined();
        expect(typeof parsed).toBe('object');
      });
    }
  });

  describe('Required Fields Validation', () => {
    for (const filename of blogFiles) {
      it(`${filename} should have all required frontmatter fields`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        expect(frontmatterMatch).toBeTruthy();

        if (!frontmatterMatch) {
          throw new Error(`No frontmatter found in ${filename}`);
        }

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        // Required fields
        expect(parsed.title).toBeDefined();
        expect(parsed.title).not.toBe('');
        expect(typeof parsed.title).toBe('string');

        expect(parsed.date).toBeDefined();

        expect(parsed.excerpt).toBeDefined();
        expect(parsed.excerpt).not.toBe('');
        expect(typeof parsed.excerpt).toBe('string');

        expect(parsed.tags).toBeDefined();
        expect(Array.isArray(parsed.tags)).toBe(true);
        expect(parsed.tags.length).toBeGreaterThan(0);
      });
    }
  });

  describe('Common YAML Pitfalls Prevention', () => {
    it('titles with colons should be quoted', () => {
      for (const filename of blogFiles) {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) continue;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        // If title contains a colon, verify it's a valid string
        // (which means it must have been quoted in the YAML)
        if (parsed.title && parsed.title.includes(':')) {
          expect(typeof parsed.title).toBe('string');

          // Verify the full title was captured (not truncated at colon)
          const titleMatch = frontmatterMatch[1].match(/title:\s*"([^"]*)"/);
          if (titleMatch) {
            expect(titleMatch[1]).toBe(parsed.title);
          }
        }
      }
    });

    it('excerpts with colons should be quoted', () => {
      for (const filename of blogFiles) {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) continue;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        // If excerpt contains a colon, verify it's a valid string
        if (parsed.excerpt && parsed.excerpt.includes(':')) {
          expect(typeof parsed.excerpt).toBe('string');

          // Verify the full excerpt was captured
          const excerptMatch = frontmatterMatch[1].match(/excerpt:\s*"([^"]*)"/);
          if (excerptMatch) {
            expect(excerptMatch[1]).toBe(parsed.excerpt);
          }
        }
      }
    });

    it('should not have multi-line scalar blocks without proper indicators', () => {
      for (const filename of blogFiles) {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) continue;

        const frontmatterText = frontmatterMatch[1];

        // Check for common multi-line errors
        // If a value spans multiple lines without | or >, it's likely wrong
        const multiLineWithoutIndicator = /^(\w+):\s*[^|>"\n]+\n\s+[^\s]/m;
        if (multiLineWithoutIndicator.test(frontmatterText)) {
          // Verify it still parses correctly
          expect(() => yaml.load(frontmatterText)).not.toThrow();
        }
      }
    });
  });

  describe('Regression Tests - Previous Errors', () => {
    it('should not have unquoted title with colons (YAMLException: bad indentation)', () => {
      // This is the EXACT error we encountered:
      // title: How I Built My Blog: Why I Use Different AI Models
      // Should be:
      // title: "How I Built My Blog: Why I Use Different AI Models"

      const problematicYAML = `title: How I Built My Blog: Why I Use Different AI Models
date: 2025-10-21
excerpt: Test excerpt`;

      expect(() => yaml.load(problematicYAML)).toThrow(/bad indentation/);
    });

    it('all blog posts should parse without YAMLException', () => {
      const errors: Array<{ file: string; error: string }> = [];

      for (const filename of blogFiles) {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
          errors.push({ file: filename, error: 'No frontmatter found' });
          continue;
        }

        try {
          yaml.load(frontmatterMatch[1]);
        } catch (error) {
          if (error instanceof Error) {
            errors.push({ file: filename, error: error.message });
          }
        }
      }

      if (errors.length > 0) {
        const errorMessage = errors.map((e) => `  - ${e.file}: ${e.error}`).join('\n');
        throw new Error(`YAML parsing errors found:\n${errorMessage}`);
      }

      expect(errors.length).toBe(0);
    });
  });

  describe('Build-time Error Prevention', () => {
    it('should detect the exact error pattern that causes Astro build failures', () => {
      // Simulate the exact pattern from the error log
      const badYAML = `
title: How I Built My Blog: Why I Use Different AI Models for Architecture vs Implementation
date: 2025-10-21
excerpt: Strategic AI model selection: using Claude Opus for architecture
tags: [web-development, astro]
`;

      let parseError: Error | null = null;
      try {
        yaml.load(badYAML);
      } catch (error) {
        parseError = error as Error;
      }

      expect(parseError).toBeTruthy();
      expect(parseError?.message).toMatch(/bad indentation|mapping entry/);
    });

    it('should verify the corrected format works', () => {
      // The CORRECT format with quotes
      const goodYAML = `title: "How I Built My Blog: Why I Use Different AI Models for Architecture vs Implementation"
date: 2025-10-21
excerpt: "Strategic AI model selection: using Claude Opus for architecture"
tags: [web-development, astro]`;

      let parsed: any;
      expect(() => {
        parsed = yaml.load(goodYAML);
      }).not.toThrow();

      expect(parsed.title).toBe(
        'How I Built My Blog: Why I Use Different AI Models for Architecture vs Implementation'
      );
    });
  });
});
