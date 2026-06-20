import type { APIRoute } from 'astro';
import { site } from '../config/site';

/** llms.txt — advertises the markdown twins of each page for AI agents.
 *  https://llmstxt.org/ */
export const GET: APIRoute = async () => {
  const base = site.url;
  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'Each page below links to its markdown version (cleaner for language models).',
    '',
    '## Pages',
    `- [Home](${base}/index.md): Lab overview and mission`,
    `- [People](${base}/people.md): Principal investigator, current trainees, and alumni`,
    `- [Research](${base}/research.md): Research areas in breast cancer genomics`,
    `- [Publications](${base}/publications.md): Selected publications`,
    `- [Supplemental Data](${base}/data.md): Downloadable datasets and methods`,
    `- [News & Events](${base}/news.md): Press coverage and lab events`,
    `- [Contact](${base}/contact.md): Contact information`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
