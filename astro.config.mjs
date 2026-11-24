// @ts-check
import { defineConfig } from 'astro/config';
import { rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Astro solo genera `404.html` para la página raíz; la de /en/ sale como `en/404/index.html`.
 * Los hostings estáticos (p. ej. Cloudflare Pages) buscan `404.html` en la carpeta más cercana,
 * así que se mueve a `en/404.html` al terminar el build.
 *
 * @returns {import('astro').AstroIntegration}
 */
const localized404 = () => ({
  name: 'localized-404',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const en = fileURLToPath(new URL('en/', dir));
      await rename(`${en}404/index.html`, `${en}404.html`);
      await rm(`${en}404`, { recursive: true });
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://perceptiastudio.com',
  output: 'static',
  trailingSlash: 'ignore',
  // Español en la raíz, inglés bajo /en/. Los textos están en src/i18n.
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react(), sitemap({ filter: (page) => !/\/404\/?$/.test(page) }), localized404()],

  vite: {
    plugins: [tailwindcss()]
  }
});
