/**
 * Vitest Configuration
 *
 * Configures the Vitest testing framework for the Astro project.
 * Uses happy-dom for simulating browser environment in tests.
 * Enforces strict coverage thresholds to maintain code quality.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for fast DOM simulation
    environment: 'happy-dom',

    // Test file patterns
    include: ['tests/**/*.test.ts'],

    // Global test timeout
    testTimeout: 10000,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],

      // Files to include in coverage
      include: ['src/**/*.{js,ts,astro}'],

      // Files to exclude from coverage
      exclude: [
        'node_modules/',
        'dist/',
        '.astro/',
        'tests/',
        '**/*.config.{js,ts,mjs}',
        '**/*.d.ts',
        '**/types.ts',
        'public/',
      ],

      // Strict coverage thresholds - enforced in CI
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },

      // Report uncovered lines
      all: true,

      // Clean coverage directory before running tests
      clean: true,
    },

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks between tests
    restoreMocks: true,

    // Mock reset between tests
    mockReset: true,
  },
});
