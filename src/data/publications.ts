/**
 * Academic Publications
 *
 * Academic papers and publications by Andy Woods.
 * Manually maintained - ACM Digital Library blocks automated scraping.
 *
 * Last updated: 2025-10-21
 */

export interface Publication {
  title: string;
  url: string;
  date: string;
  venue: string;
  authors: string[];
  excerpt: string;
  doi: string;
  type: 'conference' | 'journal' | 'workshop';
  image?: string | null;
  tags?: string[];
}

export const publications: Publication[] = [
  {
    title: 'Enabling the Next Generation of Multi-Region Applications with CockroachDB',
    url: 'https://dl.acm.org/doi/10.1145/3514221.3526053',
    date: '2022-06-12',
    venue: 'SIGMOD 2022',
    authors: [
      'Nathan VanBenschoten',
      'Arul Ajmani',
      'Andy Woods',
      'Rebecca Taft',
      'Ben Darnell',
      'Irfan Sharif',
      'Peter Mattis',
      'Cockroach Labs',
    ],
    excerpt:
      'Demonstrates how CockroachDB enables the next generation of multi-region applications through low-latency geo-distributed reads and configurable isolation features.',
    doi: '10.1145/3514221.3526053',
    type: 'conference',
    image: '/images/blog/multiregionsigmod.jpg',
    tags: ['databases', 'research', 'distributed-systems'],
  },
  {
    title: 'CockroachDB: The Resilient Geo-Distributed SQL Database',
    url: 'https://dl.acm.org/doi/10.1145/3318464.3386134',
    date: '2020-06-14',
    venue: 'SIGMOD 2020',
    authors: [
      'Rebecca Taft',
      'Irfan Sharif',
      'Andrei Matei',
      'Nathan VanBenschoten',
      'Jordan Lewis',
      'Tobias Grieger',
      'Kai Niemi',
      'Andy Woods',
      'Anne Birzin',
      'Raphael Poss',
      'Paul Bardea',
      'Amruta Ranade',
      'Ben Darnell',
      'Bram Gruneir',
      'Justin Jaffray',
      'Lucy Zhang',
      'Peter Mattis',
      'Cockroach Labs',
    ],
    excerpt:
      'Introduces CockroachDB, a geo-distributed SQL database designed to provide resilience, strong consistency, and horizontal scalability across multiple datacenters.',
    doi: '10.1145/3318464.3386134',
    type: 'conference',
    image: '/images/blog/firstsigmod.png',
    tags: ['databases', 'research', 'distributed-systems'],
  },
];
