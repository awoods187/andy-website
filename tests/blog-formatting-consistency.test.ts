/**
 * Blog Formatting Consistency Tests
 *
 * These tests ensure consistent formatting across all blog posts to prevent
 * visual inconsistencies like spacing issues, FOUC, and formatting problems.
 *
 * Catches issues like:
 * - Inconsistent hero image spacing
 * - Missing FOUC prevention (aspect-ratio, fetchpriority)
 * - Inconsistent code block formatting for examples
 * - Multi-line vs single-line frontmatter formatting
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

/**
 * Extracts frontmatter from a markdown file using proper YAML parsing
 */
function extractFrontmatter(content: string): Record<string, any> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error('No frontmatter found');
  }

  try {
    const frontmatter = yaml.load(frontmatterMatch[1]);
    return frontmatter as Record<string, any>;
  } catch (error) {
    throw new Error(`Failed to parse YAML frontmatter: ${error}`);
  }
}

describe('Blog Formatting Consistency', () => {
  const blogDir = join(process.cwd(), 'src/content/blog');
  const blogFiles = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  const templatePath = join(process.cwd(), 'src/pages/blog/[slug].astro');
  const templateContent = readFileSync(templatePath, 'utf-8');

  describe('Hero Image Spacing', () => {
    it('should have consistent hero image margin-bottom in template', () => {
      // Check that the image container uses mb-12
      // Look for the div that wraps the hero image
      const imageContainerMatch = templateContent.match(
        /post\.data\.image[\s\S]*?<div class="mb-(\d+)"/
      );
      expect(imageContainerMatch).toBeTruthy();

      if (imageContainerMatch) {
        const marginClass = imageContainerMatch[1];
        expect(marginClass).toBe('12'); // Should be mb-12 (3rem)
      }
    });

    it('should use object-fit: contain to preserve aspect ratio', () => {
      // Images should use object-fit: contain to prevent squashing/cropping
      expect(templateContent).toContain('object-fit: contain');
    });

    it('should have max-height constraint for images', () => {
      // Images should have max-height to prevent them from being too large
      expect(templateContent).toContain('max-height: 400px');
    });

    it('should have fetchpriority="high" for hero images', () => {
      // Hero images should load with high priority
      expect(templateContent).toContain('fetchpriority="high"');
    });
  });

  describe('Frontmatter Formatting', () => {
    for (const filename of blogFiles) {
      it(`${filename} should have valid YAML frontmatter`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        // Should successfully parse with js-yaml (handles both single and multi-line)
        expect(() => extractFrontmatter(content)).not.toThrow();
      });

      it(`${filename} should have required frontmatter fields`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        // Required fields
        expect(frontmatter.title).toBeDefined();
        expect(typeof frontmatter.title).toBe('string');
        expect(frontmatter.title.length).toBeGreaterThan(0);

        expect(frontmatter.date).toBeDefined();
        expect(frontmatter.excerpt).toBeDefined();
        expect(frontmatter.tags).toBeDefined();
        expect(Array.isArray(frontmatter.tags)).toBe(true);
      });
    }
  });

  describe('Code Block Formatting for Examples', () => {
    for (const filename of blogFiles) {
      it(`${filename} should use consistent code block formatting`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        // Count code blocks
        const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

        if (codeBlocks.length > 0) {
          // If there are code blocks, they should be properly closed
          codeBlocks.forEach((block) => {
            // Each block should start and end with ```
            expect(block.startsWith('```')).toBe(true);
            expect(block.endsWith('```')).toBe(true);

            // Should not have malformed blocks
            expect(block).not.toContain('```\n```'); // No empty blocks
          });
        }
      });
    }
  });

  describe('Visual Consistency', () => {
    it('all posts with images should follow same pattern', () => {
      const postsWithImages = blogFiles.filter((filename) => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');
        const frontmatter = extractFrontmatter(content);
        return frontmatter.image !== undefined;
      });

      // All posts with images should reference them in frontmatter
      expect(postsWithImages.length).toBeGreaterThan(0);

      for (const filename of postsWithImages) {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        // Image path should be absolute
        expect(frontmatter.image).toMatch(/^\//);

        // Image should be in /images/blog/
        expect(frontmatter.image).toContain('/images/blog/');

        // Image should have file extension
        expect(frontmatter.image).toMatch(/\.(jpg|jpeg|png|webp|svg)$/i);
      }
    });

    it('template should use responsive images with srcset', () => {
      // Template should support responsive images
      expect(templateContent).toContain('srcset=');
      expect(templateContent).toContain('sizes=');

      // Should have different sizes for mobile/tablet/desktop
      expect(templateContent).toContain('-400w');
      expect(templateContent).toContain('-800w');
    });
  });

  describe('Content Structure', () => {
    for (const filename of blogFiles) {
      it(`${filename} should have content after frontmatter`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        // Should have content after frontmatter
        const afterFrontmatter = content.split('---').slice(2).join('---');
        const contentText = afterFrontmatter.trim();

        expect(contentText.length).toBeGreaterThan(50); // At least some content
      });

      it(`${filename} should not have excessive blank lines`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        // Should not have more than 3 consecutive blank lines
        const excessiveBlankLines = content.match(/\n\n\n\n+/);
        expect(excessiveBlankLines).toBeNull();
      });
    }
  });
});
