/** Public origin for absolute URLs (OG images, sitemap). Set SITE_URL in the Cloudflare build variables. */
export const SITE_URL = process.env.SITE_URL ?? process.env.URL ?? 'http://localhost:3000';

// TODO: replace placeholder contact details with real ones.
export const EMAIL = 'hello@example.com';
export const PRESS = 'press@example.com';

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Applications', href: '/applications' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '#contact' }
] as const;

export const SOCIALS = [
  ['Instagram', 'https://instagram.com'],
  ['LinkedIn', 'https://linkedin.com'],
  ['X', 'https://x.com'],
  ['YouTube', 'https://youtube.com']
] as const;
