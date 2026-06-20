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
    { label: 'Supplemental Data', href: '/data' },
    { label: 'News & Events', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ] as NavItem[],

  // Principal investigator contact block (shown on the Contact page + footer).
  contact: {
    name: 'Eran Andrechek, PhD',
    title: 'Professor',
    department: 'Department of Physiology',
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
