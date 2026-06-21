import { getEntry } from 'astro:content';
import { fill } from '../config/site';

/**
 * Loads the editable copy for a page (src/content/pages/<id>.yaml) and expands
 * every {token} in it from the identity facts in src/config/site.ts. Pages call
 * `const copy = await getCopy('research')` and read `copy.title`, `copy.lede`, …
 *
 * Keeping the prose in plain-text data files (with tokens for shared facts) means
 * the lab edits wording without touching code, and the institution name is never
 * retyped. See docs/editing-content.md.
 */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Recursively replace tokens in every string within a copy object. */
function deepFill<T>(value: T): T {
  if (typeof value === 'string') return fill(value) as T;
  if (Array.isArray(value)) return value.map(deepFill) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepFill(v);
    return out as T;
  }
  return value;
}

export type PageCopy = {
  meta?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  actions?: { label: string; href: string }[];
  badges?: string[];
  sections?: Record<string, { eyebrow?: string; title?: string }>;
  links?: Record<string, { label: string; href: string }>;
  text?: Record<string, string>;
};

export async function getCopy(id: string): Promise<PageCopy> {
  const entry = await getEntry('pages', id);
  return deepFill((entry?.data ?? {}) as Json) as PageCopy;
}
