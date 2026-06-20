import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

/**
 * Generates a clean markdown "twin" of each page (e.g. /people.md alongside
 * /people). The Cloudflare Worker serves these to AI crawlers via content
 * negotiation; humans get the normal HTML. Built from the same content
 * collections as the HTML pages, so the two never drift apart.
 */

const PAGES = ['index', 'people', 'research', 'publications', 'news', 'data', 'contact'] as const;
const base = site.url;
const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

export const getStaticPaths = (() => PAGES.map((page) => ({ params: { page } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const builders: Record<string, () => Promise<string>> = {
    index: buildIndex,
    people: buildPeople,
    research: buildResearch,
    publications: buildPublications,
    news: buildNews,
    data: buildData,
    contact: buildContact,
  };
  const build = builders[params.page as string];
  const body = build ? await build() : '# Not found\n';
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

async function buildIndex(): Promise<string> {
  const home = (await getCollection('home'))[0];
  return [
    `# ${site.name} — ${site.institution}`,
    '',
    home.data.intro.trim(),
    '',
    '## Sections',
    `- [People](${base}/people)`,
    `- [Research](${base}/research)`,
    `- [Publications](${base}/publications)`,
    `- [Supplemental Data](${base}/data)`,
    `- [News & Events](${base}/news)`,
    `- [Contact](${base}/contact)`,
    '',
  ].join('\n');
}

async function buildPeople(): Promise<string> {
  const people = await getCollection('people');
  const pi = people.filter((p) => p.data.group === 'pi').sort(byOrder);
  const current = people.filter((p) => p.data.group === 'current').sort(byOrder);
  const alumni = people.filter((p) => p.data.group === 'alumni').sort(byOrder);
  const out: string[] = ['# People — Andrechek Lab', ''];

  for (const p of pi) {
    out.push(`## ${p.data.name}`);
    out.push(`*${p.data.title} · ${site.department}, ${site.institution}*`);
    if (p.data.email) out.push(`Email: ${p.data.email}`);
    if (p.body?.trim()) out.push('', p.body.trim());
    out.push('');
  }

  out.push('## Current trainees', '');
  for (const p of current) {
    out.push(`### ${p.data.name}`);
    if (p.data.title) out.push(`*${p.data.title}*`);
    if (p.body?.trim()) out.push('', p.body.trim());
    out.push('');
  }

  out.push('## Alumni', '');
  for (const p of alumni) {
    out.push(`- **${p.data.name}**${p.data.currentPosition ? ` — ${p.data.currentPosition}` : ''}`);
  }
  out.push('');
  return out.join('\n');
}

async function buildResearch(): Promise<string> {
  const areas = (await getCollection('research')).sort(byOrder);
  const out: string[] = ['# Research — Andrechek Lab', ''];
  for (const a of areas) {
    out.push(`## ${a.data.title}`, '', a.data.summary.trim());
    if (a.body?.trim()) out.push('', a.body.trim());
    out.push('');
  }
  return out.join('\n');
}

async function buildPublications(): Promise<string> {
  const pubs = (await getCollection('publications')).sort((a, b) => b.data.year - a.data.year);
  const out: string[] = ['# Publications — Andrechek Lab', ''];
  for (const p of pubs) {
    out.push(`- [${p.data.title}](${p.data.url}) — ${p.data.authors}. ${p.data.venue}`);
  }
  out.push('', `Full list: https://www.ncbi.nlm.nih.gov/pubmed/?term=andrechek`, '');
  return out.join('\n');
}

async function buildNews(): Promise<string> {
  const all = (await getCollection('news')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(d);
  const out: string[] = ['# News & Events — Andrechek Lab', '', '## News coverage', ''];
  for (const n of all.filter((x) => x.data.type === 'coverage')) {
    out.push(`- ${fmt(n.data.date)} — ${n.data.url ? `[${n.data.title}](${n.data.url})` : n.data.title}`);
  }
  out.push('', '## Lab events', '');
  for (const n of all.filter((x) => x.data.type === 'event')) {
    out.push(`- ${fmt(n.data.date)} — ${n.data.title}`);
  }
  out.push('');
  return out.join('\n');
}

async function buildData(): Promise<string> {
  const groups = (await getCollection('datasets')).sort(byOrder);
  const out: string[] = [
    '# Supplemental Data — Andrechek Lab',
    '',
    'Supplemental methods and data for Andrechek Lab manuscripts, shared for transparency and reproducibility.',
    '',
  ];
  for (const g of groups) {
    out.push(`## ${g.data.title}`, `*${g.data.authors}*`, '');
    for (const f of g.data.files) {
      const url = f.href.startsWith('http') ? f.href : base + f.href;
      out.push(`- [${f.label}](${url})${f.size ? ` (${f.size})` : ''}${f.description ? ` — ${f.description}` : ''}`);
    }
    out.push('');
  }
  return out.join('\n');
}

async function buildContact(): Promise<string> {
  const c = site.contact;
  return [
    '# Contact — Andrechek Lab',
    '',
    `**${c.name}**`,
    `${c.title} · ${c.department}, ${c.institution}`,
    '',
    ...c.address,
    '',
    `Email: ${c.email}`,
    ...c.phones.map((p) => `${p.label}: ${p.number}`),
    '',
  ].join('\n');
}
