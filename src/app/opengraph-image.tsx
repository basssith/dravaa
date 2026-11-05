import { ogCard, ogSize } from '@/lib/og';

export const alt = 'Drava — Connecting everything into one space';
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({ eyebrow: 'Technology should make life feel easier', title: 'One space.' });
}
