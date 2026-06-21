/**
 * Generates the social-share card at public/og.png — the image that shows when a
 * link to the site is pasted into iMessage, Slack, Bluesky, LinkedIn, etc.
 *
 * It's built entirely from the lab's identity: the name/institution/tagline come
 * from src/config/site.ts and the brand color from src/styles/global.css, so if
 * the institution ever changes you just rerun it — nothing here is hand-typed.
 *
 *   pnpm run og        # regenerate public/og.png, then commit the result
 *
 * Run on demand by a maintainer (it is NOT part of the normal build, so it never
 * fights contributors with surprise commits). Uses satori (HTML→SVG) + resvg
 * (SVG→PNG) with the site's own IBM Plex fonts, so text always renders correctly
 * regardless of which fonts a machine has installed.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../src/config/site.ts';

const root = new URL('..', import.meta.url);
const read = (rel: string) => readFileSync(new URL(rel, root));

// Brand color: the single source of truth is the --brand token in global.css.
const css = read('src/styles/global.css').toString();
const brand = css.match(/--brand:\s*(#[0-9a-fA-F]{3,8})/)?.[1] ?? '#18453b';

// A darker brand shade for a subtle gradient (multiply each channel toward black).
function shade(hex: string, factor: number): string {
  const n = hex.replace('#', '');
  const f = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  const [r, g, b] = [0, 2, 4].map((i) => Math.round(parseInt(f.slice(i, i + 2), 16) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

const fonts = [
  { name: 'IBM Plex Serif', weight: 600 as const, style: 'normal' as const, data: read('node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff') },
  { name: 'IBM Plex Serif', weight: 400 as const, style: 'normal' as const, data: read('node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-normal.woff') },
  { name: 'IBM Plex Mono', weight: 500 as const, style: 'normal' as const, data: read('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff') },
];

// Two-tone wordmark (last word lighter), mirroring the on-site Wordmark.
const parts = site.shortName.trim().split(/\s+/);
const secondary = parts.length > 1 ? parts.pop()! : '';
const primary = parts.join(' ');

// Minimal hyperscript helper (no JSX needed in a plain script).
type Node = { type: string; props: { style: Record<string, unknown>; children?: Node[] | string } };
const h = (style: Record<string, unknown>, children?: Node[] | string): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

const W = 1200;
const H = 630;

const tree = h(
  {
    width: W,
    height: H,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '76px 88px',
    color: '#ffffff',
    fontFamily: 'IBM Plex Serif',
    backgroundColor: brand,
    backgroundImage: `linear-gradient(135deg, ${brand} 0%, ${shade(brand, 0.6)} 100%)`,
  },
  [
    // Eyebrow: small square + institution, mono/uppercase (matches the site).
    h({ alignItems: 'center', gap: '18px' }, [
      h({ width: '18px', height: '18px', backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: '3px' }),
      h(
        { fontFamily: 'IBM Plex Mono', fontSize: '27px', fontWeight: 500, letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)' },
        site.institution
      ),
    ]),

    // Wordmark + tagline.
    h({ flexDirection: 'column' }, [
      h({ fontSize: '116px', fontWeight: 600, letterSpacing: '-3px', lineHeight: 1 }, [
        h({ color: '#ffffff' }, primary),
        ...(secondary ? [h({ color: 'rgba(255,255,255,0.66)', marginLeft: '26px' }, secondary)] : []),
      ]),
      h(
        { fontFamily: 'IBM Plex Serif', fontWeight: 400, fontSize: '36px', lineHeight: 1.32, marginTop: '30px', maxWidth: '900px', color: 'rgba(255,255,255,0.88)' },
        site.tagline
      ),
    ]),

    // Footer: site URL + focus.
    h({ justifyContent: 'space-between', alignItems: 'flex-end' }, [
      h({ fontFamily: 'IBM Plex Mono', fontSize: '26px', color: 'rgba(255,255,255,0.74)' }, new URL(site.url).host),
      h({ fontFamily: 'IBM Plex Mono', fontSize: '22px', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }, site.focus),
    ]),
  ]
);

const svg = await satori(tree as Parameters<typeof satori>[0], { width: W, height: H, fonts });
const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
writeFileSync(new URL('public/og.png', root), png);
console.log(`Wrote public/og.png (${W}×${H}) for "${site.name} — ${site.institution}"`);
