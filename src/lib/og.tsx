import { ImageResponse } from 'next/og';
import { SMILE_EYES, SMILE_PATH } from './smile';

export const ogSize = { width: 1200, height: 630 };

/** Shared 1200×630 social card: dark panel, lime smile, big uppercase title. */
export function ogCard({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#0d0d0d', color: '#f2f2ee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 40, fontWeight: 700 }}>
          <svg width="56" height="54" viewBox="0 0 170 165" fill="#b6ff66">
            {SMILE_EYES.map(([x, y, s]) => (
              <rect key={x} x={x} y={y} width={s} height={s} rx="4" />
            ))}
            <path d={SMILE_PATH} />
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
