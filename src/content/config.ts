/**
 * Content Collections Configuration
 *
 * Defines schemas for Astro content collections.
 * This ensures type safety and validation for all blog post frontmatter.
 */

import { defineCollection, z } from 'astro:content';

/**
 * Blog Collection Schema
 *
 * Defines the structure and validation rules for blog post frontmatter.
 * All blog posts must include these required fields.
 */
const blog = defineCollection({
  type: 'content', // Content collection (Markdown/MDX files)
  schema: z.object({
    title: z.string(),                                    // Post title (required)
    date: z.date(),                                       // Publication date (required)
    excerpt: z.string(),                                  // Brief summary for previews (required)
    tags: z.array(z.string()),                            // Array of tag strings (required)
    image: z.string().optional(),                         // Featured image URL (optional)
    draft: z.boolean().optional().default(false),         // Draft status (optional, defaults to false)
  }),
});

// Export all content collections
export const collections = { blog };
