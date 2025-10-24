/**
 * RSS Feed Generator
 *
 * Generates an RSS 2.0 feed for all content: personal posts, CRL posts, and publications.
 * Accessible at /rss.xml for feed readers and aggregators.
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { crlPosts } from '../data/crl-posts';
import { publications } from '../data/publications';

/**
 * GET handler for RSS feed
 *
 * Fetches all content from multiple sources and generates an RSS XML feed.
 * Posts are sorted by date (newest first) and drafts are excluded.
 */
export async function GET(context: APIContext) {
  // Get all blog posts from the content collection
  const blog = await getCollection('blog');

  // Filter out drafts from personal posts
  const publishedPosts = blog.filter(post => !post.data.draft);

  // Combine all content sources
  const allPosts = [
    // Personal blog posts
    ...publishedPosts.map(post => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `https://andywoods.me/blog/${post.slug}/`,
      categories: post.data.tags,
      author: 'Andy Woods',
    })),
    // Cockroach Labs posts (external URLs)
    ...crlPosts.map(post => ({
      title: post.title,
      description: post.excerpt,
      pubDate: new Date(post.date),
      link: post.url, // External URL
      categories: post.tags,
      author: 'Andy Woods',
    })),
    // Publications
    ...publications.map(pub => ({
      title: pub.title,
      description: pub.excerpt || `Published at ${pub.venue}`,
      pubDate: new Date(pub.date),
      link: pub.url,
      categories: pub.tags || ['publication'],
      author: 'Andy Woods',
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  // Generate RSS feed
  return rss({
    title: 'Andy Woods - Product & AI Engineering',
    description: 'Building at the intersection of databases, AI, and product management. Director of PM at Cockroach Labs.',
    site: context.site || 'https://andywoods.me',
    items: allPosts,
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <webMaster>noreply@andywoods.me (Andy Woods)</webMaster>
    `,
  });
}
