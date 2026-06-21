/**
 * Site-wide identity for the Andrechek Lab website — the ONE place the lab's
 * core facts live, so they're written once and reused everywhere.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ Changing institution? Update the values in `site` below — the name,  │
 * │ URL, department, PI, focus, location. They flow into every page, the │
 * │ header/footer, the social-share card, the SEO tags, and the {tokens} │
 * │ used in the editable copy files (src/content/pages/*.yaml). Pair this│
 * │ with the brand color in src/styles/global.css and the favicon/og.png.│
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Page wording (headlines, ledes, eyebrows, taglines) lives in plain-text
 * data files — src/content/pages/*.yaml and src/content/{home,research,...}.
 * Those files reference the facts here with {tokens} (e.g. {institution}), so
 * you never retype the institution name in prose. See docs/editing-content.md.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  // ---- Identity (the facts reused across the whole site) ----
  name: 'Andrechek Lab',
  shortName: 'Andrechek Lab',
  pi: 'Eran Andrechek',
  institution: 'Michigan State University',
  institutionUrl: 'https://msu.edu',
  department: 'Department of Physiology',
  departmentUrl: 'https://physiology.natsci.msu.edu',
  /** Short research focus, used in prose + SEO, e.g. "breast cancer genomics". */
  focus: 'breast cancer genomics',
  /** City/state for the hero meta + SEO. */
  location: 'East Lansing, MI',
  /** One-line description of the lab's mission (footer + fallback meta). */
  tagline: 'Studying the genomic drivers of breast cancer development, progression, and metastasis.',

  url: 'https://lab.andrechek.com',
  description:
    "Professor Eran Andrechek's lab at Michigan State University, studying the genomic mechanisms that drive the development, progression, and metastasis of breast cancer.",

  /** Social-share image (Open Graph / Twitter). Regenerate with `pnpm run og`. */
  ogImage: '/og.png',

  // Top navigation, left to right.
  nav: [
    { label: 'Home', href: '/' },
    { label: 'People', href: '/people' },
    { label: 'Research', href: '/research' },
    { label: 'Publications', href: '/publications' },
    { label: 'Data', href: '/data' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ] as NavItem[],

  // Principal investigator contact block (shown on the Contact page + footer).
  // The department/institution come from the identity fields above.
  contact: {
    name: 'Eran Andrechek, PhD',
    title: 'Professor',
    address: ['2194 BPS Building', '567 Wilson Rd.', 'East Lansing, MI 48824'],
    email: 'andrech1@msu.edu',
    phones: [
      { label: 'Office', number: '517-884-5042' },
      { label: 'Lab', number: '517-884-5020' },
    ],
  },

  // Social / external links.
  social: {
    bluesky: 'https://bsky.app/profile/eranandrechek.bsky.social',
    linkedin: 'https://www.linkedin.com/in/eran-andrechek-b706154b',
    github: 'https://github.com/Andrechek-Lab',
  },
  // BlueSky handle used by the live-feed panel on the home page.
  blueskyHandle: 'eranandrechek.bsky.social',

  // Analytics. GA4 is Eran's existing Google Analytics property.
  // cloudflareToken is filled in after the Cloudflare Web Analytics site is
  // created (see docs/infrastructure.md). Leave blank to disable it.
  analytics: {
    ga4: 'G-WS5FVEQTZ7',
    cloudflareToken: '',
  },
} as const;

export type Site = typeof site;

/**
 * Tokens usable in the editable copy files (src/content/pages/*.yaml). A copy
 * string like "Research in the {lab} integrates bioinformatics…" is expanded
 * from the identity facts above, so the institution name lives in exactly one
 * place. Unknown tokens are left untouched (so stray braces don't disappear).
 */
const TOKENS: Record<string, string> = {
  lab: site.name,
  institution: site.institution,
  pi: site.pi,
  department: site.department,
  focus: site.focus,
  location: site.location,
  tagline: site.tagline,
};

/** Replace {token} placeholders in a string with the matching identity fact. */
export function fill(value: string): string {
  return value.replace(/\{(\w+)\}/g, (match, key) => (key in TOKENS ? TOKENS[key] : match));
}

/**
 * Append referral UTM params to an outbound link so the destination's analytics
 * can see (and credit) traffic coming from this site. Pair with
 * referrerpolicy="strict-origin-when-cross-origin" on the <a> so our domain is
 * also sent as the HTTP referrer.
 */
export function withReferral(url: string, campaign = 'site'): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', new URL(site.url).host);
  u.searchParams.set('utm_medium', 'referral');
  u.searchParams.set('utm_campaign', campaign);
  return u.toString();
}
