import type { MetadataRoute } from 'next';
import { applications, slugOf } from '@/lib/applications';

const BASE = process.env.URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/applications', '/about', ...applications.map((a) => `/applications/${slugOf(a)}`)];
  return pages.map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));
}
