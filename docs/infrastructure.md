# Infrastructure & hosting (admin)

This is the internal, admin-only guide to how the site is hosted and how to perform the one-time setup and occasional maintenance. Lab members editing content do **not** need this — see [editing-content.md](./editing-content.md).

> ⚠️ **Which Cloudflare account?** Everything below must be done in the Cloudflare account that holds the **`andrechek.com`** DNS zone (the lab's own personal account, **not** a work/organization account) — the same account, so the Worker and the domain live together.

## Overview

- The site is built with **Astro** into a `dist/` folder of static files.
- A **Cloudflare Worker** (`worker/index.ts`, configured by `wrangler.jsonc`) serves that folder, and additionally:
  - serves a markdown version of each page to AI crawlers (content negotiation), and
  - redirects `/data/<file>.zip` to the large files stored on **GitHub Releases**.
- **Cloudflare Workers Builds** rebuilds and redeploys automatically whenever `main` changes. Nobody needs to run a deploy command by hand.
- **GitHub Releases** stores the large dataset zips (not in the git repo).
- `lab.andrechek.com` points at the Worker via Cloudflare DNS.

---

## One-time setup

### 1. Publish the datasets to a GitHub Release {#publishing-datasets}

The dataset zips are kept outside the git repo (they're large). The Worker is configured to redirect `/data/*` to a release tagged **`datasets-v1`** (see `DOWNLOAD_BASE` in `worker/index.ts`).

Create that release and upload the files (run from your local clone of the repo, once it's on GitHub and public). Replace the staging path with wherever you keep the zips:

```bash
cd /path/to/Andrechek-Lab            # your local clone of this repo
gh release create datasets-v1 \
  --title "Supplemental datasets" \
  --notes "Large supplemental data files for Andrechek Lab manuscripts." \
  /path/to/dataset-zips/*.zip        # wherever the .zip files are staged
```

That single command creates the release and attaches all ten zips. To add or replace a file later:

```bash
gh release upload datasets-v1 /path/to/New_File.zip          # add one
gh release upload datasets-v1 /path/to/File.zip --clobber    # replace one
```

If you ever cut a *new* release tag, update the one `DOWNLOAD_BASE` line in `worker/index.ts` to match.

> Download links only work without a login because the repo is **public**.
> If the repo were private, Release assets would require authentication — use a public archive (e.g. Zenodo) instead and point the `href:` values there.

### 2. Connect the repo to Cloudflare Workers Builds

In the Cloudflare dashboard (correct account!):

1. **Workers & Pages → Create → Workers → Import a repository** (connect the GitHub app to `Andrechek-Lab/Andrechek-Lab` if prompted).
2. Pick this repo and the `main` branch.
3. Build settings:
   - **Build command:** `pnpm run build`
   - **Deploy command:** `npx wrangler deploy`
   - (Cloudflare reads `wrangler.jsonc` for the Worker name and asset settings.)
4. Save. Cloudflare will build and deploy on every push to `main`, and build (without deploying) on pull requests from branches in this repo.

> **Alternative / manual deploy.** You can deploy by hand instead:
>
> ```bash
> pnpm run build
> wrangler deploy
> ```
>
> The first `wrangler deploy` will prompt you to log in and pick the account.

### 3. Add the custom domain

In the Worker's page → **Settings → Domains & Routes → Add → Custom domain** → `lab.andrechek.com`. Because the `andrechek.com` zone is in this same account, Cloudflare provisions the DNS record and certificate automatically.

This is the **cutover** from Firebase: once the custom domain resolves to the Worker and the site looks right, the migration is complete. The old site remains on the `old` git branch and on Firebase as a fallback until you decommission it.

### 4. Cloudflare Web Analytics (privacy-friendly, no cookie banner)

1. Dashboard → **Analytics & Logs → Web Analytics → Add a site** → `lab.andrechek.com`.
2. Copy the **token** it gives you.
3. Paste it into `src/config/site.ts` → `analytics.cloudflareToken`.
4. Commit + push. (Leaving it blank simply disables Cloudflare Analytics; Google Analytics keeps working regardless.)

### 5. Google Analytics (GA4)

Already wired up with Eran's measurement ID `G-WS5FVEQTZ7` in `src/config/site.ts` (`analytics.ga4`). It reports to the same Google Analytics account Eran already uses. To change it, edit that one value.

---

## Routine maintenance

| Task | How |
| --- | --- |
| Deploy a change | Automatic on merge to `main` (Workers Builds). |
| Add/replace a dataset file | `gh release upload datasets-v1 …` (see above), then add its entry in `src/content/datasets/`. |
| Regenerate the social-share image | `pnpm run og`, then commit the updated `public/og.png`. Only needed after changing the lab name, tagline (`src/config/site.ts`), or brand color (`src/styles/global.css`). |
| Manual deploy | `pnpm run build && wrangler deploy` |
| Watch a deploy | Cloudflare dashboard → the Worker → **Deployments** / **Builds**. |
| Tail live logs | `wrangler tail` (observability is enabled in `wrangler.jsonc`). |
| Test the Worker locally | `pnpm run build && pnpm exec wrangler dev` then visit `http://localhost:8787`. |

## Wrangler quick reference

```bash
wrangler login            # authenticate (pick the andrechek.com account!)
wrangler whoami           # confirm which account you're in
pnpm exec wrangler dev    # run the site + Worker locally
wrangler deploy           # manual deploy
wrangler tail             # stream live request logs
```
