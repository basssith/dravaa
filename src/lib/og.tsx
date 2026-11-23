import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

/** Shared 1200×630 social card: dark panel, lime smile, big uppercase title. */
export function ogCard({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#0d0d0d', color: '#f2f2ee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 40, fontWeight: 700 }}>
          <svg width="56" height="54" viewBox="0 0 170 165" fill="#b6ff66">
            <rect x="14" y="10" width="40" height="40" rx="4" />
            <rect x="77" y="10" width="40" height="40" rx="4" />
            <path d="M118 50h40A104 104 0 0 1 54 154v-40a64 64 0 0 0 64-64z" />
          </svg>
          drava
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 26, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(242,242,238,0.6)' }}>{eyebrow}</div>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4, textTransform: 'uppercase' }}>
            <span style={{ background: '#b6ff66', color: '#0d0d0d', padding: '0 16px', borderRadius: 12 }}>{title}</span>
          </div>
        </div>
      </div>
    ),
    ogSize
  );
}
