# Editing site content

All the content you'll normally change lives in `src/content/`, as plain markdown
files — **one file per item**. To add something, copy the `_example.md` file in the
relevant folder, rename it, and fill it in. To edit something, open its file and
change the fields. To remove something, delete its file.

You can edit these files three ways:
- **On github.com** — click a file, then the ✏️ pencil icon. Good for quick text edits.
- **On your computer** — see [CONTRIBUTING.md](../CONTRIBUTING.md) for the full setup.
- Either way, your change goes through a pull request and an automatic check before
  it's published. If the check fails, **the live site is unaffected** — you just fix
  the file and push again.

> **About the `---` lines and indentation.** The block between the two `---` lines at
> the top of each file is called *frontmatter*. It's a list of `field: value` pairs.
> Keep the field names exactly as shown, and if a value contains a colon `:` or
> starts with a special character, wrap it in "double quotes". That's the #1 cause of
> a failed check.

---

## People — `src/content/people/`

One file per person. Photos go in the **same folder** and are referenced with `./`.
See [CONTRIBUTING.md](../CONTRIBUTING.md) for the step-by-step.

| Field | Required? | Notes |
| --- | --- | --- |
| `name` | yes | Full name, e.g. `Jane Doe` |
| `group` | yes | `pi`, `current`, or `alumni` |
| `title` | for pi/current | Role, e.g. `Graduate Researcher`, `Undergraduate Researcher`, `Professor` |
| `photo` | optional | `./your-photo.jpg` — the file must be in this folder |
| `email` | optional | Shown as a link |
| `order` | optional | Lower numbers appear first within a group (PI = 1, current trainees ~10–20, alumni ~30+) |
| `currentPosition` | alumni only | Where they are now, e.g. `Postdoc, Some University` |

The text below the frontmatter is the person's bio/blurb. Alumni usually have no
photo and no blurb — just `name`, `group`, and `currentPosition`.

## Publications — `src/content/publications/`

One file per paper (the filename doesn't appear on the site; papers are sorted
newest-first by `year`).

| Field | Required? | Notes |
| --- | --- | --- |
| `title` | yes | Paper title. Wrap in "quotes" if it contains a colon. |
| `authors` | yes | Author list as you want it shown |
| `venue` | yes | Journal + citation, e.g. `Sci Rep. 2021;11(1):9502.` (quote it — it has colons) |
| `year` | yes | A number, e.g. `2021` |
| `url` | yes | Link to the paper (PubMed, journal, etc.) |
| `featured` | optional | `true` pins it to the top |

## News & events — `src/content/news/`

One file per item. Sorted automatically newest-first.

| Field | Required? | Notes |
| --- | --- | --- |
| `title` | yes | Headline. Quote it if it has a colon, apostrophe, or `?`. |
| `date` | yes | `YYYY-MM-DD`, e.g. `2025-09-01` |
| `type` | yes | `coverage` (press/articles) or `event` (lab milestones) |
| `url` | optional | Link for press coverage; omit for events |
| `source` | optional | Outlet name, e.g. `MSUToday` |

## Research areas — `src/content/research/`

One file per research area, each with an image (in the same folder).

| Field | Required? | Notes |
| --- | --- | --- |
| `title` | yes | Area name |
| `image` | yes | `./some-image.jpg` in this folder |
| `summary` | yes | One or two sentences shown before "Read more" |
| `order` | optional | Controls the order on the page |

The text below the frontmatter is the longer description (shown under "Read more").

## Home page — `src/content/home/home.md`

A single file controlling the homepage:

- `headline` — the big heading.
- `intro` — the mission paragraph under it.
- `slides` — the rotating photo slideshow. Each slide is an `image:` (a file in this
  folder) and a `caption:`. Add or remove slides by editing this list.

## Supplemental datasets — `src/content/datasets/`

This is the one type with an extra step, because the files are large. The dataset
**files** are stored on GitHub Releases (not in this repo); the markdown file here
just lists them and links to them.

To add or update a dataset:

1. Upload the file(s) to the GitHub Release — see
   [docs/infrastructure.md](./infrastructure.md#publishing-datasets) (this is an
   admin task).
2. Edit (or copy) a file in `src/content/datasets/`. Each file is one manuscript:

   ```yaml
   ---
   title: Title of the manuscript
   authors: Author A, Author B
   order: 3
   files:
     - label: Friendly name of the file
       description: Optional one-line description.
       href: /data/Your_File_Name.zip   # must match the uploaded filename
       size: 12 MB
   ---
   Optional intro paragraph about this manuscript's data.
   ```

   The `href` is always `/data/<exact-file-name>` — our site automatically redirects
   that to the actual file on the Release.

---

## Site-wide settings — `src/config/site.ts`

This is the one file that isn't markdown. It holds the **navigation menu, contact
details, social links, and analytics IDs**. It changes rarely. It's plain to edit
(just text between quotes), but if you're unsure, ask an admin —
[docs/maintainers.md](./maintainers.md) covers it.
