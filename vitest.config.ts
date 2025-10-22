/**
 * Vitest Configuration
 *
 * Configures the Vitest testing framework for the Astro project.
 * Uses happy-dom for simulating browser environment in tests.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for fast DOM simulation
    environment: 'happy-dom',

    // Test file patterns
    include: ['tests/**/*.test.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.astro/',
        'tests/',
      ],
    },
  },
});
