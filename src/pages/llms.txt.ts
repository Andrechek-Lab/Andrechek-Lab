import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { getCopy } from '../lib/copy';

/** llms.txt — advertises the markdown twins of each page for AI agents.
 *  Page descriptions come from the per-page copy (src/content/pages/*.yaml),
 *  so they stay in sync with the site. https://llmstxt.org/ */

// id → the .md twin filename + the link label shown in llms.txt.
const PAGES = [
  { id: 'index', file: 'index.md', label: 'Home' },
  { id: 'people', file: 'people.md', label: 'People' },
  { id: 'research', file: 'research.md', label: 'Research' },
  { id: 'publications', file: 'publications.md', label: 'Publications' },
  { id: 'data', file: 'data.md', label: 'Supplemental Data' },
  { id: 'news', file: 'news.md', label: 'News & Events' },
  { id: 'contact', file: 'contact.md', label: 'Contact' },
];

export const GET: APIRoute = async () => {
  const base = site.url;
  const links = await Promise.all(
    PAGES.map(async ({ id, file, label }) => {
      const desc = (await getCopy(id)).meta ?? '';
      return `- [${label}](${base}/${file})${desc ? `: ${desc}` : ''}`;
    })
  );
  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'Each page below links to its markdown version (cleaner for language models).',
    '',
    '## Pages',
    ...links,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
