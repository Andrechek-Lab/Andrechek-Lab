# Andrechek Lab website — notes for Claude Code

Research lab site (Eran Andrechek, breast-cancer lab; live at lab.andrechek.com). Astro static site served by a Cloudflare Worker, designed so non-technical lab members edit content via GitHub pull requests. Human docs: `README.md`, `CONTRIBUTING.md`, `docs/`.

## Commands (pnpm)

- `pnpm dev` — preview at <http://localhost:4321>
- `pnpm validate` — type-check + build; **run before committing** (this is exactly what CI runs)
- `pnpm build && pnpm exec wrangler dev` — test the Worker (markdown negotiation + `/data` redirects) at <http://localhost:8787>
- `pnpm run og` — regenerate `public/og.png` (only after a name/institution/brand-color change; commit the result)

## Where things live

- **Content** (one file per item): `src/content/{people,research,publications,news,datasets,home}` — markdown; schemas in `src/content.config.ts`. `_`-prefixed files are ignored templates. A bad/missing field fails the build (the safety net).
- **Page wording** (headings, ledes, labels): `src/content/pages/*.yaml`, using `{tokens}` (`{lab}`, `{institution}`, …).
- **Lab facts + settings** (the single source the tokens pull from): `src/config/site.ts`.
- **Design**: brand color + tokens in `src/styles/global.css`; shell/`<head>`/SEO in `src/layouts/BaseLayout.astro`; `src/components/`; per-page `<style>` in `src/pages/*.astro`.
- **AI/bot output**: `src/pages/[page].md.ts` (markdown twins) + `llms.txt.ts`; `worker/index.ts` serves markdown to crawlers and redirects `/data/*` to the `datasets-v1` GitHub Release.

## Cautions

- **Don't make Cloudflare changes via tools** — the connected Cloudflare MCP may be on a *work* account; the lab's infra is the personally-owned `andrechek.com` zone, set up by hand. Provide commands, don't run them. See `docs/infrastructure.md`.
- The redesign lives on **`redesign`** (branched from **`old`**, the original Firebase site). Keep `old` and Firebase intact until cutover. Repo is still private + not deployed; remaining go-public/deploy steps are in `docs/maintainers.md` and `docs/infrastructure.md`.
- The BlueSky feed (`src/components/BlueskyEmbed.astro`) fetches live from the public AT Protocol API; no network → fallback link.
