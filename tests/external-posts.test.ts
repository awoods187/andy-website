/**
 * External Posts Validation Tests
 *
 * Validates that external blog posts (Cockroach Labs, Publications)
 * have correct data structure and valid URLs.
 */

import { describe, it, expect } from 'vitest';
import { crlPosts } from '../src/data/crl-posts';
import { publications } from '../src/data/publications';

describe('External Posts Validation', () => {
  describe('Cockroach Labs Posts', () => {
    it('should have valid post structure', () => {
      expect(crlPosts.length).toBeGreaterThan(0);

      crlPosts.forEach((post) => {
        expect(post.title).toBeTruthy();
        expect(post.url).toBeTruthy();
        expect(post.date).toBeTruthy();
        expect(post.source).toBe('cockroach-labs');
      });
    });

    it('should have valid Cockroach Labs URLs', () => {
      crlPosts.forEach((post) => {
        expect(post.url).toMatch(/^https:\/\/www\.cockroachlabs\.com/);
      });
    });
  });

  describe('Publications', () => {
    it('should have valid publication structure', () => {
      expect(publications.length).toBeGreaterThan(0);

      publications.forEach((pub) => {
        expect(pub.title).toBeTruthy();
        expect(pub.url).toBeTruthy();
        expect(pub.date).toBeTruthy();
        expect(pub.venue).toBeTruthy();
      });
    });

    it('should have valid publication URLs', () => {
      publications.forEach((pub) => {
        expect(pub.url).toMatch(/^https?:\/\//);
      });
    });
  });
});
