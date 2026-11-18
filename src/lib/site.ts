/** Public origin for absolute URLs (OG images, sitemap). Netlify sets URL; SITE_URL overrides it. */
export const SITE_URL = process.env.SITE_URL ?? process.env.URL ?? 'http://localhost:3060';

export const EMAIL = 'hello@drava.technology';

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/applications' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '#contact' }
] as const;

export const SOCIALS = [
  ['Instagram', 'https://www.instagram.com/thewhitetusker_official'],
  ['LinkedIn', 'https://www.linkedin.com/company/whitetusker/'],
  ['X', 'https://x.com/White__Tusker']
] as const;
