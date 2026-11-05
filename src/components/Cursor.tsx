'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { cn } from '@/lib/ui';

type Mode = 'idle' | 'hover' | 'view';

/** Lagging dot that grows on links and becomes a lime "View" disc over [data-cursor="view"]. Mouse only. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('idle');

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);
    let x = -100, y = -100, rx = x, ry = y;
    let last: Element | null = null;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest('a, button, input, [data-cursor]');
      setMode(!t ? 'idle' : t.closest('[data-cursor="view"]') ? 'view' : 'hover');
      if (t && t !== last) sound.playHover();
      last = t;
    };
    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      gsap.ticker.remove(tick);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={ring}
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed top-0 left-0 z-300 grid place-items-center rounded-full transition-[width,height,margin,background-color] duration-500 ease-expo',
        mode === 'idle' && '-m-[5px] size-2.5 bg-white mix-blend-difference',
        mode === 'hover' && '-m-[22px] size-11 bg-white mix-blend-difference',
        mode === 'view' && '-m-12 size-24 bg-accent text-ink'
      )}
    >
      <span className={cn('label font-semibold transition-opacity', mode === 'view' ? 'opacity-100' : 'opacity-0')}>View</span>
    </div>
  );
}
