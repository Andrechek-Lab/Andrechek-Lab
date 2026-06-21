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
  // Disable prefetching: the site is served by a Cloudflare Worker, and
  // Cloudflare refuses any speculative `Sec-Purpose: prefetch` request to a
  // Worker route with a 503 (same reason Speed Brain is turned off on the
  // zone). <ClientRouter /> enables `prefetchAll` by default; this overrides
  // it. View-transition navigation still works (it fetches on click, which is
  // a normal request, not a prefetch).
  prefetch: false,
  integrations: [sitemap()],
  build: {
    // Emit /people.html as /people/index.html-free clean URLs handled by the worker;
    // keep file output flat so the .md twins sit next to their HTML pages.
    format: 'file',
  },
});
