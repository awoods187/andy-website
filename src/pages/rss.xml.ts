/**
 * RSS Feed Generator
 *
 * Generates an RSS 2.0 feed for all published blog posts.
 * Accessible at /rss.xml for feed readers and aggregators.
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

/**
 * GET handler for RSS feed
 *
 * Fetches all published blog posts and generates an RSS XML feed.
 * Posts are sorted by date (newest first) and drafts are excluded.
 */
export async function GET(context: APIContext) {
  // Get all blog posts from the content collection
  const blog = await getCollection('blog');

  // Filter out drafts and sort by publication date (newest first)
  const publishedPosts = blog
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  // Generate RSS feed
  return rss({
    title: 'Andy Woods',
    description: 'Product Manager at Cockroach Labs. Writing about AI, databases, and product management.',
    site: context.site || 'https://andywoods.me',

    // Map blog posts to RSS items
    items: publishedPosts.map(post => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,      // Tags become RSS categories
    })),

    // Additional RSS metadata
    customData: `<language>en-us</language>`,
  });
}
