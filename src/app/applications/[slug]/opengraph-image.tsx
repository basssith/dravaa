import { applications, findApp, slugOf } from '@/lib/applications';
import { ogCard, ogSize } from '@/lib/og';

export const alt = 'Drava application';
export const size = ogSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return applications.map((app) => ({ slug: slugOf(app) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const app = applications[findApp((await params).slug)] ?? applications[0];
  return ogCard({ eyebrow: `[${app.id}] ${app.category}`, title: app.name });
}
