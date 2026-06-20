import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://lab.andrechek.com',
  // Static site generation. The site is served as static assets by a Cloudflare
  // Worker (see wrangler.jsonc + worker/), which also handles markdown content
  // negotiation for AI crawlers and /data/* download redirects.
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // Emit /people.html as /people/index.html-free clean URLs handled by the worker;
    // keep file output flat so the .md twins sit next to their HTML pages.
    format: 'file',
  },
});
