// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://andywoods.me',

  vite: {
    // @ts-ignore - Vite plugin type incompatibility
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap(),
    mdx({
      // Enable markdown in MDX files
      extendMarkdownConfig: true,
    }),
  ],
});
