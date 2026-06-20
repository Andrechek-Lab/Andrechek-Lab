# Andrechek Lab website — guide for Claude Code

Lab research site (Eran Andrechek, breast-cancer lab, Michigan State University;
live at lab.andrechek.com). Rebuilt as an Astro static site served by a Cloudflare
Worker, designed so non-technical lab members maintain content via GitHub pull
requests. Human-facing docs: `README.md`, `CONTRIBUTING.md`, `docs/`.

## Status (last updated 2026-06-20)

- The redesign lives on branch **`redesign`** (branched off **`old`**, which is the
  original Firebase site and must stay intact). `redesign` is committed and pushed.
- The repo is still **private**, default branch is still `old`, and the site is **not
  deployed** — Firebase still serves the live old site. The owner is finishing a
  content/UI pass before going public + deploying.
- Dataset files are uploaded to the GitHub Release **`datasets-v1`** (all 10 zips).

## Deferred steps — triggered when the owner says "the repo is now public"

These are **blocked while the repo is private on a free plan**, so do them once it's public:

1. **Apply the branch ruleset** — run the `gh api … rulesets` command in
   `docs/maintainers.md`. (Branch protection 403s on private+free repos.) Eric is an
   org owner, so the ruleset's OrganizationAdmin bypass lets him keep pushing directly.
2. **Verify dataset downloads** — Release assets require auth until the repo is public;
   after it's public, check that `/data/Pathway_Signatures.zip` (etc.) resolve.

Then the owner does these **manually in the andrechek.com Cloudflare account** (see
`docs/infrastructure.md`): connect Workers Builds, add the `lab.andrechek.com` custom
domain, paste a Cloudflare Web Analytics token into `src/config/site.ts`, and cut DNS
over from Firebase.

## Working in this repo

- **Package manager: pnpm.** Key commands:
  - `pnpm dev` — local preview at http://localhost:4321
  - `pnpm validate` — type-check + build (exactly what CI runs; run before committing)
  - `pnpm build && pnpm exec wrangler dev` — test the Worker (markdown negotiation + `/data` redirects) at http://localhost:8787
  - `pnpm run optimize:images` — downscale large source images (run after adding photos)
- **Content** is markdown in `src/content/{people,research,publications,news,datasets,home}`;
  schemas in `src/content.config.ts`. One file per item. Files starting with `_`
  (e.g. `_example.md`) are templates the loader ignores. A bad/missing field fails
  the build — that's the safety net.
- **Images** are co-located with their content file and auto-optimized by Astro at
  build (source files are kept ≤1600px wide).
- **Design lives in:** `src/styles/global.css` (design tokens — MSU green `#18453b`,
  type scale, spacing), `src/layouts/BaseLayout.astro` (page shell + `<head>`/analytics),
  `src/components/` (Header, Footer, Slideshow, BlueskyFeed), and per-page `<style>`
  blocks in `src/pages/*.astro`. **For a UI/UX pass, start in `global.css` + the
  components.**
- **Site-wide settings** (nav, PI contact, social links, analytics IDs) live in
  `src/config/site.ts` — the one non-markdown config file.
- **AI/bot readability:** `src/pages/[page].md.ts` generates a `.md` twin of each page
  and `src/pages/llms.txt.ts` an `llms.txt`; `worker/index.ts`
  (`@wave-rf/cloudflare-md-router`) serves markdown to crawlers and HTML to people, and
  redirects `/data/*` to the `datasets-v1` Release.

## Cautions

- **Do NOT make Cloudflare changes via tools.** The connected Cloudflare tools may be
  on Eric's Wave RF *work* account; the lab's Cloudflare (the personally-owned
  `andrechek.com` zone) is separate and Eric sets it up himself. Provide commands, don't
  execute. See `docs/infrastructure.md`.
- Keep the `old` branch and Firebase untouched until cutover.
- The BlueSky feed (`src/components/BlueskyFeed.astro`) fetches live from the public
  AT Protocol API; with no network or no posts it shows a fallback link.

## Open content questions for Eran (one-line PRs)

- Trainee titles were inferred ("Graduate Researcher"; Caroline = "Undergraduate
  Researcher") — the old site didn't list them. Correct in `src/content/people/*.md`.
- PI title is set to **"Professor"** (was inconsistent on the old site). Confirm.
- Confirm the current trainee roster is up to date.
