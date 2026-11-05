import type { MetadataRoute } from 'next';

const BASE = process.env.URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${BASE}/sitemap.xml` };
}
