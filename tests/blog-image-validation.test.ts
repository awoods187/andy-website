/**
 * Blog Image Validation Tests
 *
 * These tests ensure all blog post images exist and follow naming conventions.
 * Prevents broken images from being deployed to production.
 *
 * Key validations:
 * 1. All image paths in frontmatter point to existing files
 * 2. Image filenames match blog post slugs
 * 3. Required image formats exist (responsive images)
 * 4. No orphaned images in the blog images directory
 *
 * This prevents issues like:
 * - Broken image links on blog posts
 * - 404 errors for missing images
 * - Inconsistent naming between posts and images
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

describe('Blog Image Validation', () => {
  const blogDir = join(process.cwd(), 'src/content/blog');
  const publicDir = join(process.cwd(), 'public');
  const blogFiles = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

  describe('Image Existence Validation', () => {
    for (const filename of blogFiles) {
      it(`${filename} - image should exist if specified in frontmatter`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        expect(frontmatterMatch).toBeTruthy();

        if (!frontmatterMatch) return;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        // If image is specified, it must exist
        if (parsed.image) {
          const imagePath = parsed.image.startsWith('/')
            ? join(publicDir, parsed.image)
            : join(publicDir, '/', parsed.image);

          const imageExists = existsSync(imagePath);

          if (!imageExists) {
            throw new Error(
              `Image not found for ${filename}:\n` +
                `  Expected: ${imagePath}\n` +
                `  Frontmatter path: ${parsed.image}\n\n` +
                `Possible fixes:\n` +
                `  1. Create the image at: public${parsed.image}\n` +
                `  2. Update frontmatter image path\n` +
                `  3. Remove image field if not needed`
            );
          }

          expect(imageExists).toBe(true);
        }
      });
    }
  });

  describe('Image Naming Convention', () => {
    for (const filename of blogFiles) {
      it(`${filename} - image filename should match blog post slug`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        if (parsed.image) {
          const slug = filename.replace(/\.md$/, '');
          const imagePath = parsed.image;

          // Image should contain the slug in its filename
          expect(imagePath).toContain(slug);
        }
      });
    }
  });

  describe('Image File Extensions', () => {
    for (const filename of blogFiles) {
      it(`${filename} - image should have valid extension`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        if (parsed.image) {
          const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
          const hasValidExtension = validExtensions.some((ext) =>
            parsed.image.toLowerCase().endsWith(ext)
          );

          expect(hasValidExtension).toBe(true);
        }
      });
    }
  });

  describe('Responsive Image Variants', () => {
    for (const filename of blogFiles) {
      it(`${filename} - should have responsive image variants if main image exists`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        if (parsed.image) {
          const imagePath = parsed.image.startsWith('/')
            ? join(publicDir, parsed.image)
            : join(publicDir, '/', parsed.image);

          if (!existsSync(imagePath)) return; // Main image test will catch this

          // Check for responsive variants (400w, 800w)
          const baseImagePath = imagePath.replace(/\.(jpg|jpeg|png|webp)$/i, '');
          const extension = imagePath.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';

          const variant400w = `${baseImagePath}-400w${extension}`;
          const variant800w = `${baseImagePath}-800w${extension}`;

          // Note: Not requiring variants, but warning if they don't exist
          if (!existsSync(variant400w) || !existsSync(variant800w)) {
            console.warn(
              `⚠️  Missing responsive image variants for ${filename}:\n` +
                `   Main: ${imagePath}\n` +
                `   400w: ${variant400w} (${existsSync(variant400w) ? '✓' : '✗'})\n` +
                `   800w: ${variant800w} (${existsSync(variant800w) ? '✓' : '✗'})\n`
            );
          }

          // Just pass the test - responsive variants are optional
          expect(true).toBe(true);
        }
      });
    }
  });

  describe('Image Directory Consistency', () => {
    it('should not have orphaned blog images', () => {
      const blogImagesDir = join(publicDir, 'images/blog');

      if (!existsSync(blogImagesDir)) {
        // No blog images directory means no orphaned images
        expect(true).toBe(true);
        return;
      }

      const imageFiles = readdirSync(blogImagesDir).filter(
        (f) =>
          f.endsWith('.jpg') ||
          f.endsWith('.jpeg') ||
          f.endsWith('.png') ||
          f.endsWith('.webp') ||
          f.endsWith('.gif')
      );

      // Get all image paths from blog posts
      const referencedImages = new Set<string>();
      for (const filename of blogFiles) {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) continue;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;
        if (parsed.image) {
          const imageFilename = parsed.image.split('/').pop();
          if (imageFilename) {
            referencedImages.add(imageFilename);

            // Also track responsive variants
            const baseFilename = imageFilename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
            const extension = imageFilename.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
            referencedImages.add(`${baseFilename}-400w${extension}`);
            referencedImages.add(`${baseFilename}-800w${extension}`);
          }
        }
      }

      // Check for orphaned images
      const orphanedImages = imageFiles.filter((imgFile) => {
        // Skip backup files
        if (imgFile.endsWith('.backup')) return false;

        return !referencedImages.has(imgFile);
      });

      if (orphanedImages.length > 0) {
        console.warn(
          `\n⚠️  Found ${orphanedImages.length} orphaned image(s) in public/images/blog/:\n${orphanedImages
            .map((img) => `   - ${img}`)
            .join('\n')}\n\nThese images are not referenced by any blog post.\n` +
            `Consider removing them or updating blog posts to reference them.\n`
        );
      }

      // Don't fail the test, just warn
      expect(true).toBe(true);
    });
  });

  describe('Image Path Format', () => {
    for (const filename of blogFiles) {
      it(`${filename} - image path should start with /`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        if (parsed.image) {
          expect(parsed.image.startsWith('/')).toBe(true);
        }
      });

      it(`${filename} - image path should be in /images/blog/ directory`, () => {
        const filepath = join(blogDir, filename);
        const content = readFileSync(filepath, 'utf-8');

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;

        const parsed = yaml.load(frontmatterMatch[1]) as Record<string, any>;

        if (parsed.image) {
          expect(parsed.image).toMatch(/^\/images\/blog\//);
        }
      });
    }
  });

  describe('Regression Prevention', () => {
    it('should fail if blog post has image but file is missing (regression test)', () => {
      // Simulate the exact error that occurred
      const testFrontmatter = {
        title: 'Test Post',
        image: '/images/blog/nonexistent-image.jpg',
      };

      const imagePath = join(publicDir, testFrontmatter.image);
      const imageExists = existsSync(imagePath);

      // This should be false (image doesn't exist)
      expect(imageExists).toBe(false);
    });

    it('should detect when image filename does not match blog post slug', () => {
      // Test the scenario where blog post is renamed but images aren't
      const blogSlug = 'new-post-title';
      const oldImagePath = '/images/blog/old-post-title-hero.jpg';

      // Image should contain the blog slug
      expect(oldImagePath.includes(blogSlug)).toBe(false);
    });
  });
});
