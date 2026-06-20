/**
 * Site-wide settings for the Andrechek Lab website.
 *
 * This is the one "technical" file maintainers may touch. Most day-to-day
 * updates (people, publications, news, datasets) happen in `src/content/`
 * as plain markdown — see docs/editing-content.md. Edit this file only to
 * change the navigation menu, contact details, social links, or analytics IDs.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  name: 'Andrechek Lab',
  shortName: 'Andrechek Lab',
  institution: 'Michigan State University',
  department: 'Department of Physiology',
  url: 'https://lab.andrechek.com',
  description:
    "Professor Eran Andrechek's lab at Michigan State University, studying the genomic mechanisms that drive the development, progression, and metastasis of breast cancer.",

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
  contact: {
    name: 'Eran Andrechek, PhD',
    title: 'Professor',
    department: 'Department of Physiology',
    departmentUrl: 'https://physiology.natsci.msu.edu',
    institution: 'Michigan State University',
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

  msu: {
    name: 'Michigan State University',
    url: 'https://msu.edu',
  },

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
