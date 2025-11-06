/**
 * RSS Feed Generator with Full Content and Images
 *
 * Generates an RSS 2.0 feed with full HTML content including images.
 * Includes content:encoded for full post content with absolute image URLs.
 * Accessible at /rss.xml for feed readers, aggregators, and Buttondown.
 */

import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { crlPosts } from '../data/crl-posts';
import { publications } from '../data/publications';

type BlogPost = CollectionEntry<'blog'>;

const SITE_URL = 'https://andywoods.me';

/**
 * Escapes HTML special characters for use in XML
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converts relative image URLs to absolute URLs
 */
function makeImageUrlsAbsolute(html: string): string {
  return html
    .replace(/src="\/images\//g, `src="${SITE_URL}/images/`)
    .replace(/src='\/images\//g, `src='${SITE_URL}/images/`)
    .replace(/href="\/images\//g, `href="${SITE_URL}/images/`)
    .replace(/href='\/images\//g, `href='${SITE_URL}/images/`)
    .replace(/!\[([^\]]*)\]\(\/images\//g, `![$1](${SITE_URL}/images/`);
}

/**
 * Converts markdown to basic HTML (simple implementation)
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Convert images: ![alt](url) -> <img src="url" alt="alt" />
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Convert links: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Convert bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Convert line breaks to paragraphs
  html = html
    .split('\n\n')
    .filter((p) => p.trim())
    .map((p) => `<p>${p.replace(/\n/g, ' ')}</p>`)
    .join('\n');

  return html;
}

/**
 * Creates full HTML content with hero image and post body
 */
function createFullContent(post: BlogPost): string {
  let html = '';

  // Add hero image if it exists
  if (post.data.image) {
    const imageUrl = post.data.image.startsWith('http')
      ? post.data.image
      : `${SITE_URL}${post.data.image}`;

    const altText = escapeHtml(post.data.title);
    html += `<p><img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto;" /></p>\n\n`;
  }

  // Get the raw markdown/MDX body content
  let rawBody = post.body;

  // Remove MDX/JSX import statements and component tags
  rawBody = rawBody
    .replace(/^import\s+.+?from\s+.+?;?\s*$/gm, '') // Remove import statements
    .replace(/<\/?[A-Z][a-zA-Z0-9]*[^>]*>/g, '') // Remove JSX component tags
    .trim();

  // Convert markdown to HTML (basic conversion)
  const bodyHtml = markdownToHtml(rawBody);

  html += bodyHtml;
  html += `\n\n<p><a href="${SITE_URL}/blog/${post.slug}/">Read the full post on andywoods.me →</a></p>`;

  // Convert all relative URLs to absolute
  return makeImageUrlsAbsolute(html);
}

/**
 * GET handler for RSS feed
 *
 * Fetches all content from multiple sources and generates an RSS XML feed
 * with full HTML content including images.
 */
export async function GET(context: APIContext): Promise<Response> {
  // Get all blog posts from the content collection
  const blog: BlogPost[] = await getCollection('blog');

  // Filter out drafts from personal posts
  const publishedPosts: BlogPost[] = blog.filter((post: BlogPost) => !post.data.draft);

  // Create items with full content for personal posts
  const personalPostItems = publishedPosts.map((post: BlogPost) => {
    const content = createFullContent(post);

    return {
      title: post.data.title,
      description: post.data.excerpt,
      content, // Full HTML content with images
      pubDate: post.data.date,
      link: `${SITE_URL}/blog/${post.slug}/`,
      categories: post.data.tags,
      author: 'Andy Woods',
      // Add enclosure for the hero image (for podcast-style feeds)
      ...(post.data.image && {
        enclosure: {
          url: post.data.image.startsWith('http')
            ? post.data.image
            : `${SITE_URL}${post.data.image}`,
          type: 'image/jpeg',
          length: 0, // We don't know the actual file size
        },
      }),
    };
  });

  // Combine all content sources
  const allPosts = [
    ...personalPostItems,
    // Cockroach Labs posts (external URLs)
    ...crlPosts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      content: `<p>${post.excerpt}</p><p><a href="${post.url}">Read the full post at Cockroach Labs →</a></p>`,
      pubDate: new Date(post.date),
      link: post.url, // External URL
      categories: post.tags,
      author: 'Andy Woods',
    })),
    // Publications
    ...publications.map((pub) => ({
      title: pub.title,
      description: pub.excerpt || `Published at ${pub.venue}`,
      content: `<p>${pub.excerpt || `Published at ${pub.venue}`}</p><p><a href="${pub.url}">Read the publication →</a></p>`,
      pubDate: new Date(pub.date),
      link: pub.url,
      categories: pub.tags || ['publication'],
      author: 'Andy Woods',
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  // Generate RSS feed with content:encoded support
  return rss({
    title: 'Andy Woods - Product & AI Engineering',
    description:
      'Building at the intersection of databases, AI, and product management. Director of PM at Cockroach Labs.',
    site: context.site || SITE_URL,
    items: allPosts,
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <webMaster>noreply@andywoods.me (Andy Woods)</webMaster>
      <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    `,
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}
