/**
 * Blog Title/Filename Matching Tests
 *
 * These tests ensure blog post titles match their filenames to maintain URL consistency.
 * This prevents:
 * - Title changes without corresponding filename updates
 * - Broken URLs when content is reorganized
 * - SEO issues from mismatched slugs
 *
 * Key validations:
 * 1. Filename slug matches title slug (kebab-case conversion)
 * 2. Image paths match filename slugs
 * 3. All blog posts have consistent naming
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Converts a string to kebab-case slug
 * Handles: "How I Built My Blog: Claude Opus for Design, Claude Code for Implementation"
 * Returns: "how-i-built-my-blog-claude-opus-for-design-claude-code-for-implementation"
 */
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Extracts frontmatter from a markdown file
 */
function extractFrontmatter(content: string): Record<string, any> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error('No frontmatter found');
  }

  const frontmatter: Record<string, any> = {};
  const lines = frontmatterMatch[1].split('\n');

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) continue;

    const match = line.match(/^(\w+):\s*"?([^"]*)"?$/);
    if (match) {
      const [, key, value] = match;
      frontmatter[key] = value.replace(/^"(.*)"$/, '$1'); // Remove quotes
    }
  }

  return frontmatter;
}

describe('Blog Title/Filename Matching', () => {
  const blogDir = join(process.cwd(), 'src/content/blog');
  const blogFiles = readdirSync(blogDir).filter(f => f.endsWith('.md'));

  // Legacy posts that use shorter, SEO-friendly filenames
  // These don't match the full title slug but are acceptable
  const legacyPosts = new Set([
    'getting-started-ai-pm-perspective.md',
    'why-pms-should-understand-databases.md'
  ]);

  it('should have at least one blog post', () => {
    expect(blogFiles.length).toBeGreaterThan(0);
  });

  describe('Title and Filename Consistency', () => {
    for (const filename of blogFiles) {
      describe(`${filename}`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        it('should have a title in frontmatter', () => {
          expect(frontmatter.title).toBeDefined();
          expect(frontmatter.title).not.toBe('');
        });

        it('filename should match title slug (or be in legacy posts)', () => {
          const title = frontmatter.title;
          const expectedSlug = toKebabCase(title);
          const actualSlug = filename.replace(/\.md$/, '');

          // Allow legacy posts with shorter filenames
          if (legacyPosts.has(filename)) {
            expect(actualSlug.length).toBeGreaterThan(0);
          } else {
            // New posts should have exact title/filename match
            expect(actualSlug).toBe(expectedSlug);
          }
        });

        it('image path should match filename slug (if image exists)', () => {
          if (frontmatter.image) {
            const imagePath = frontmatter.image;
            const filenameSlug = filename.replace(/\.md$/, '');

            // Image should contain the filename slug
            expect(imagePath).toContain(filenameSlug);
          }
        });
      });
    }
  });

  describe('Specific Post Validations', () => {
    it('should have the correct title and filename for the main blog post', () => {
      const expectedFilename = 'how-i-built-my-blog-claude-opus-for-design-claude-code-for-implementation.md';
      const expectedTitle = 'How I Built My Blog: Claude Opus for Design, Claude Code for Implementation';

      expect(blogFiles).toContain(expectedFilename);

      const filepath = join(blogDir, expectedFilename);
      const content = readFileSync(filepath, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      expect(frontmatter.title).toBe(expectedTitle);
    });

    it('should have matching image path for the main blog post', () => {
      const filename = 'how-i-built-my-blog-claude-opus-for-design-claude-code-for-implementation.md';
      const expectedImagePath = '/images/blog/how-i-built-my-blog-claude-opus-for-design-claude-code-for-implementation-hero.jpg';

      const filepath = join(blogDir, filename);
      const content = readFileSync(filepath, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      expect(frontmatter.image).toBe(expectedImagePath);
    });
  });

  describe('Regression Prevention', () => {
    it('should fail if title is updated without filename update (for non-legacy posts)', () => {
      // This test will fail if someone changes the title in frontmatter
      // without also renaming the file to match
      // (Legacy posts are exempted)

      for (const filename of blogFiles) {
        // Skip legacy posts
        if (legacyPosts.has(filename)) continue;

        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        const titleSlug = toKebabCase(frontmatter.title);
        const filenameSlug = filename.replace(/\.md$/, '');

        if (titleSlug !== filenameSlug) {
          throw new Error(
            `Title/filename mismatch:\n` +
            `  File: ${filename}\n` +
            `  Title: ${frontmatter.title}\n` +
            `  Expected filename: ${titleSlug}.md\n` +
            `  Actual filename: ${filenameSlug}.md`
          );
        }
      }
    });

    it('should fail if old filename is found', () => {
      // Regression test: ensure old filename doesn't exist
      const oldFilename = 'hybrid-blog-system-2025.md';
      expect(blogFiles).not.toContain(oldFilename);
    });
  });
});
