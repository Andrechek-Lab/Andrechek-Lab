# Andrechek Lab website

The website for the [Andrechek Lab](https://lab.andrechek.com) at Michigan State
University, where we study the genomics of breast cancer.

**This site is designed so lab members can update it themselves** — adding people,
publications, news, and datasets by editing simple text files, with no web-design
work required. Doing so is also a gentle, real-world introduction to Git and
GitHub, the same tools you'll use throughout a research career in bioinformatics.

---

## I just want to update the site

You don't need to read the whole thing — pick the guide that matches what you want:

| I want to… | Read this |
| --- | --- |
| **Add myself (or a student) to the People page** | [CONTRIBUTING.md](./CONTRIBUTING.md) — a complete walkthrough that assumes *zero* prior experience with Git, the terminal, or coding |
| Add a publication, news item, dataset, or research area | [docs/editing-content.md](./docs/editing-content.md) |
| Approve someone's change, or manage the repo | [docs/maintainers.md](./docs/maintainers.md) |
| Set up or change hosting, the domain, or downloads | [docs/infrastructure.md](./docs/infrastructure.md) |

Almost every update follows the same idea: **the content lives in plain text files
inside the `src/content/` folder, and you change those files.** You never have to
touch the design or the code.

---

## What's in here (for the curious)

```txt
src/
  content/        ← the content you edit (people, research, publications, news, datasets, home)
  pages/          ← the page templates (the layout/design of each page)
  components/     ← reusable pieces (header, footer, slideshow, BlueSky feed)
  layouts/        ← the shared page shell (used by every page)
  config/site.ts  ← site-wide settings: menu, contact info, social links, analytics
worker/           ← the Cloudflare Worker that serves the site
docs/             ← guides for editing, maintaining, and hosting
.github/          ← the automatic check that runs on every change
```

## How it's built (the short version)

- **[Astro](https://astro.build)** turns the content files into a fast, static website.
  It also automatically shrinks and optimizes every photo, so you can upload a
  large image and the site still loads quickly.
- **[Cloudflare Workers](https://workers.cloudflare.com)** hosts the site. Every
  time a change is merged, the site rebuilds and republishes automatically.
- **Large dataset files** live on [GitHub Releases](https://github.com/Andrechek-Lab/Andrechek-Lab/releases),
  not in this repository, so the repo stays small.
- Each page also has a clean markdown version (e.g. `/people.md`) that AI assistants
  and search crawlers can read — handy for a research lab that wants its work found.

## Running the site on your own computer (optional)

You do **not** need this to add yourself or edit content — but if you'd like to
preview changes locally first:

```bash
pnpm install     # one-time: install the tools (uses pnpm; see note below)
pnpm dev         # start a local preview at http://localhost:4321
pnpm validate    # run the same check the robot runs on your pull request
```

> Tools used: [Node.js](https://nodejs.org) (v20+) and [pnpm](https://pnpm.io).
> [CONTRIBUTING.md](./CONTRIBUTING.md) walks through installing them.

## License / content

Site code is maintained by the lab. Research content, images, and text are © the
Andrechek Lab, Michigan State University.
