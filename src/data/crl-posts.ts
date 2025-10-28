/**
 * Cockroach Labs Blog Posts
 *
 * External blog posts written for Cockroach Labs.
 * Manually maintained. Run `python3 scripts/scrape-crl-posts.py` to update.
 *
 * Last updated: 2025-01-21
 */

export interface ExternalPost {
  title: string;
  url: string;
  date: string;
  image: string | null;
  excerpt: string;
  source: 'cockroach-labs';
  tags?: string[];
}

export const crlPosts: ExternalPost[] = [
  {
    title: 'Surviving Failures: Disaster Recovery with CockroachDB',
    url: 'https://www.cockroachlabs.com/blog/disaster-recovery-cockroachdb-surviving-failures',
    date: '2025-04-09',
    image:
      'https://images.ctfassets.net/00voh0j35590/40YlKM5SYGs9JXQ1YtTM2r/f5744f0b080440cfe5c7e5ff07d52aa0/Disaster_Recovery_with_CockroachDB.png',
    excerpt:
      'So you were worried about a failure, and it happened. Despite all of the planning, something went wrong, and now the goal is to minimize the impact of that failure.',
    source: 'cockroach-labs',
    tags: ['databases', 'disaster-recovery', 'reliability'],
  },
  {
    title: 'Surviving Large-Scale Failures with CockroachDB',
    url: 'https://www.cockroachlabs.com/blog/surviving-large-scale-failures',
    date: '2025-03-27',
    image:
      'https://images.ctfassets.net/00voh0j35590/34yldFlyhxjYrtGrEGoM3u/211236f501365acd0e53a103bfa15b11/How_CockroachDB_Survives_Large-Scale_Failures.png',
    excerpt:
      'CockroachDB is built to prevent systemic breakdowns by isolating failures, automating recovery, and maintaining consistency across environments.',
    source: 'cockroach-labs',
    tags: ['databases', 'reliability', 'distributed-systems'],
  },
  {
    title: 'Surviving 11 Application and Database Failures with CockroachDB',
    url: 'https://www.cockroachlabs.com/blog/surviving-application-database-failures',
    date: '2025-03-17',
    image:
      'https://images.ctfassets.net/00voh0j35590/DihoWhIGxxt8Y8kjxWmvE/a7e9c95e51d6cf4828f238324ef17f16/How_CockroachDB_survives.png',
    excerpt:
      'In this 3-part series, "Surviving Failures with CockroachDB," we\'ll explore the most common failure scenarios affecting modern applications and databases.',
    source: 'cockroach-labs',
    tags: ['databases', 'reliability', 'architecture'],
  },
  {
    title: 'Announcing Improved CockroachDB Cloud Pricing',
    url: 'https://www.cockroachlabs.com/blog/improved-cockroachdb-cloud-pricing',
    date: '2024-11-01',
    image:
      'https://images.ctfassets.net/00voh0j35590/2ylqk0mWXJl994RHs9oNoZ/6b5074ac810602e7eb2b88db27f955a4/cockroachdb-cloud-pricing-thumbnail.png',
    excerpt:
      'Reduced prices in compute for CockroachDB Cloud Standard and Advanced plans. Only pay for what you use in data transfer, backups, and changefeeds.',
    source: 'cockroach-labs',
    tags: ['product-management', 'pricing', 'cloud'],
  },
];
