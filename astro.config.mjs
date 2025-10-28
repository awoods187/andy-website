// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://andywoods.me',

  vite: {
    // @ts-ignore - Vite plugin type incompatibility
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
