/**
 * Shared types for external blog posts.
 */

export interface ExternalPost {
  title: string;
  url: string;
  date: string;
  image: string | null;
  excerpt: string;
  source: 'cockroach-labs' | 'dualentry';
  tags?: string[];
}
