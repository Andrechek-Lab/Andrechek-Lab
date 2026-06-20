import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections for the Andrechek Lab site.
 *
 * Each item below is one markdown file in src/content/<collection>/. The
 * `schema` blocks describe the fields each file must have; if a file is missing
 * a required field or has a typo, the site build fails with a clear message
 * (this is the safety net that catches mistakes in pull requests).
 *
 * See docs/editing-content.md for the plain-English guide to editing these.
 */

// --- People: PI, current trainees, and alumni -------------------------------
const people = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/people' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      // Which section of the People page this person appears in.
      group: z.enum(['pi', 'current', 'alumni']),
      // Role/title, e.g. "Professor", "Graduate Researcher". Optional for alumni.
      title: z.string().optional(),
      // Photo lives next to this markdown file; reference it as ./photo.jpg
      photo: image().optional(),
      email: z.string().email().optional(),
      // Lower numbers sort first within a group.
      order: z.number().default(100),
      // Alumni only: where they are now, e.g. "Assistant Professor, Salk Institute".
      currentPosition: z.string().optional(),
    }),
});

// --- Research areas ---------------------------------------------------------
const research = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/research' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      // One- or two-sentence summary shown before the "Read more" body.
      summary: z.string(),
      order: z.number().default(100),
    }),
});

// --- Publications -----------------------------------------------------------
const publications = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    // Journal + citation, e.g. "Sci Rep. 2021;11(1):9502."
    venue: z.string(),
    year: z.number().int(),
    url: z.string().url(),
    featured: z.boolean().default(false),
  }),
});

// --- News coverage & lab events ---------------------------------------------
const news = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['coverage', 'event']),
    // Coverage links out to the article; events usually have no link.
    url: z.string().url().optional(),
    source: z.string().optional(),
  }),
});

// --- Supplemental datasets (downloads grouped by manuscript) ----------------
const datasets = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/datasets' }),
  schema: z.object({
    // Manuscript this group of files belongs to.
    title: z.string(),
    authors: z.string(),
    order: z.number().default(100),
    files: z.array(
      z.object({
        label: z.string(),
        description: z.string().optional(),
        // Stable site path, e.g. /data/pathway-signatures.zip — the Worker
        // redirects these to the actual file (see worker/downloads.ts).
        href: z.string(),
        size: z.string().optional(), // human-readable, e.g. "383 MB"
      })
    ),
  }),
});

// --- Home page (single file: src/content/home/home.md) ----------------------
const home = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/home' }),
  schema: ({ image }) =>
    z.object({
      headline: z.string(),
      intro: z.string(),
      slides: z
        .array(z.object({ image: image(), caption: z.string() }))
        .default([]),
    }),
});

export const collections = { people, research, publications, news, datasets, home };
