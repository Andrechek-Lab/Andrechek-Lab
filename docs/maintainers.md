# Maintainer guide (Eric & Eran)

How to review contributions, keep the repo safe, and handle the occasional settings change. For hosting/deploy setup, see [infrastructure.md](./infrastructure.md).

## Reviewing & approving a pull request

When a student opens a pull request (e.g. to add themselves):

1. Open the PR on GitHub. Check the **automatic "Build & validate content" check** — it must be green ✓. If it's red ✗, the student has a fix to make; the check's **Details** page explains what's wrong in plain English. They push a fix and it re-runs.
2. Glance at the **Files changed** tab — for a new person that's one `.md` file and one photo. Confirm the name/blurb look right.
3. Click **Merge pull request**. Within ~a minute, Cloudflare rebuilds and the change is live.

That's it — you never need to touch the terminal to approve routine content changes.

## Branch protection (the ruleset)

`main` is protected by a repository **ruleset** so that:

- changes must go through a pull request,
- the validation check must pass before merging,
- at least one approval is required,
- nobody can force-push or delete `main`.

Organization owners (you) can bypass these when necessary. To create the ruleset, run this once (requires the `gh` CLI, logged in with admin rights to the repo):

```bash
gh api -X POST repos/Andrechek-Lab/Andrechek-Lab/rulesets \
  --input - <<'JSON'
{
  "name": "Protect main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false
    }},
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [ { "context": "Build & validate content" } ]
    }}
  ],
  "bypass_actors": [
    { "actor_id": 1, "actor_type": "OrganizationAdmin", "bypass_mode": "always" }
  ]
}
JSON
```

You can also create/edit it in the UI: **Repo → Settings → Rules → Rulesets → New branch ruleset**. To require more reviewers later, bump `required_approving_review_count`.

> If you'd rather not require an approval for your *own* quick fixes, the OrganizationAdmin bypass above already lets owners merge directly.
> To loosen it for everyone, set `required_approving_review_count` to `0` (the validation check still runs).

## How the automatic check works

`.github/workflows/validate-content.yml` runs on every pull request and on pushes to `main`. It installs the project, type-checks, and builds the site — which validates every content file against its schema (`src/content.config.ts`). If anything is malformed, the build fails, the PR is blocked from merging, and **the live site keeps serving the last good version**. GitHub emails the PR author on failure, and the workflow writes a plain-English explanation to the run's summary page.

The check needs no secrets, so it runs safely on pull requests from forks (students' copies of the repo).

## Common settings changes

In `src/config/site.ts` (the lab's core facts + settings):

- **Lab identity** — `name`, `institution`, `department`, `pi`, `focus`, `location`, `tagline`. These are the single source of truth: they flow into every page, the header/footer, the SEO/social tags, and the `{tokens}` used in the page-wording files. Change one here and it updates everywhere.
- **Navigation menu** — the `nav` list.
- **Contact info** (address, phones, email, title) — the `contact` block.
- **Social links** — `social.bluesky`, `social.linkedin`, and `blueskyHandle` (the handle drives the live BlueSky feed on the homepage).
- **Analytics** — `analytics.ga4` (Google) and `analytics.cloudflareToken` (Cloudflare). See [infrastructure.md](./infrastructure.md).

Page wording (headings, ledes, labels, footer tagline) lives in `src/content/pages/*.yaml` — see [editing-content.md](./editing-content.md#page-wording--srccontentpages). After changing the lab name, institution, or brand color, regenerate the social-share card with `pnpm run og` and commit `public/og.png`.

Editing these goes through the same PR + check flow as content.

## The `old` branch

The original Firebase site is preserved on the `old` branch, untouched. Don't delete it — it's the historical record and a fallback.
