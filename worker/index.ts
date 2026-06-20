/**
 * Cloudflare Worker entry point for the Andrechek Lab site.
 *
 * It does two things:
 *   1. Redirects /data/<file>.zip download links to wherever the large dataset
 *      files actually live (a GitHub Release). Keeping a stable /data/* URL on
 *      our own domain means the public links never change even if we move the
 *      files to different storage later — only DOWNLOAD_BASE below changes.
 *   2. Delegates everything else to @wave-rf/cloudflare-md-router, which serves
 *      the markdown twin of a page to AI crawlers and the normal HTML to people.
 */
import { createMdRouter, type MdRouterEnv } from '@wave-rf/cloudflare-md-router';

// Where the dataset zips actually live. To publish new/updated datasets, upload
// them to a GitHub Release and (if the tag changes) update this one line.
// See docs/infrastructure.md.
const DOWNLOAD_BASE =
  'https://github.com/Andrechek-Lab/Andrechek-Lab/releases/download/datasets-v1';

// Only redirect well-formed "<name>.zip" requests under /data/.
const SAFE_FILE = /^[A-Za-z0-9_.-]+\.zip$/;

const md = createMdRouter({ vary: true });

export default {
  async fetch(request: Request, env: MdRouterEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/data/')) {
      const file = url.pathname.slice('/data/'.length);
      if (SAFE_FILE.test(file)) {
        return Response.redirect(`${DOWNLOAD_BASE}/${file}`, 302);
      }
      return new Response('Not found', { status: 404 });
    }

    return md.fetch!(request, env, ctx);
  },
};
