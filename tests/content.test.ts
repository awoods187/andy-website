/**
 * Content Tests
 *
 * Validates blog post content, frontmatter, and metadata.
 * Ensures all posts have required fields and valid formatting.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
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

describe('Blog Content Validation', () => {
  const contentPath = join(process.cwd(), 'src', 'content', 'blog');

  it('should have blog post files', () => {
    const files = readdirSync(contentPath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));
    expect(mdFiles.length).toBeGreaterThanOrEqual(3);
  });

  it('all blog posts should have required frontmatter fields', () => {
    const files = readdirSync(contentPath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    mdFiles.forEach((file) => {
      const content = readFileSync(join(contentPath, file), 'utf-8');

      // Check for frontmatter block
      expect(content).toMatch(/^---\n/);

      // Check for required fields
      expect(content).toMatch(/title:/);
      expect(content).toMatch(/date:/);
      expect(content).toMatch(/excerpt:/);
      expect(content).toMatch(/tags:/);
    });
  });

  it('all blog posts should have valid dates', () => {
    const files = readdirSync(contentPath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    mdFiles.forEach((file) => {
      const content = readFileSync(join(contentPath, file), 'utf-8');
      const dateMatch = content.match(/date:\s*(\d{4}-\d{2}-\d{2})/);

      if (dateMatch) {
        const date = new Date(dateMatch[1]);
        expect(date.toString()).not.toBe('Invalid Date');
      }
    });
  });

  it('all blog posts should have at least one tag', () => {
    const files = readdirSync(contentPath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    mdFiles.forEach((file) => {
      const content = readFileSync(join(contentPath, file), 'utf-8');
      const frontmatter = extractFrontmatter(content);

      // Tags should be an array with at least one item
      expect(frontmatter.tags).toBeDefined();
      expect(Array.isArray(frontmatter.tags)).toBe(true);
      expect(frontmatter.tags.length).toBeGreaterThan(0);
    });
  });
});

describe('SEO and Metadata', () => {
  const contentPath = join(process.cwd(), 'src', 'content', 'blog');

  it('all excerpts should be under 200 characters', () => {
    const files = readdirSync(contentPath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    mdFiles.forEach((file) => {
      const content = readFileSync(join(contentPath, file), 'utf-8');
      const excerptMatch = content.match(/excerpt:\s*"(.+?)"/);

      if (excerptMatch && excerptMatch[1]) {
        expect(excerptMatch[1].length).toBeLessThanOrEqual(200);
      }
    });
  });

  it('all titles should be under 100 characters', () => {
    const files = readdirSync(contentPath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    mdFiles.forEach((file) => {
      const content = readFileSync(join(contentPath, file), 'utf-8');
      const titleMatch = content.match(/title:\s*"(.+?)"/);

      if (titleMatch && titleMatch[1]) {
        expect(titleMatch[1].length).toBeLessThanOrEqual(100);
      }
    });
  });
});
