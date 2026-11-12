'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { cn } from '@/lib/ui';

type Mode = 'idle' | 'hover' | 'view';

/**
 * Precision Dual-Ring Crosshair Cursor:
 * - Inner sharp pinpoint dot with instant tracking
 * - Outer smooth magnetic ring with spring physics
 * - Subtle precision reticle lines on interactive elements
 * - Expanding accented "VIEW" badge on media/cards
 * - Crisp mix-blend-difference inversion over both black and white surfaces
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('idle');
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let lastElement: Element | null = null;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Instant pinpoint tracking for inner dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onPointerOver = (e: PointerEvent) => {
      const t = (e.target as Element).closest('a, button, input, [data-cursor]');
      setMode(!t ? 'idle' : t.closest('[data-cursor="view"]') ? 'view' : 'hover');
      if (t && t !== lastElement) {
        sound.playHover();
      }
      lastElement = t;
    };

    const onPointerDown = () => setClicking(true);
    const onPointerUp = () => setClicking(false);

    // Smooth spring physics for outer ring
    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      gsap.ticker.remove(tick);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* 1. Inner Instant Pinpoint Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-300 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-transform duration-75',
          clicking ? 'size-1.5' : 'size-1'
        )}
      />

      {/* 2. Outer Smooth Magnetic Precision Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-300 grid place-items-center rounded-full border border-white/60 mix-blend-difference transition-[width,height,margin,border-color,background-color] duration-300 ease-expo',
          mode === 'idle' && '-m-[16px] size-8',
          mode === 'hover' && '-m-[24px] size-12 border-white bg-white/10',
          mode === 'view' && '-m-[44px] size-[88px] border-accent bg-accent text-ink mix-blend-normal',
          clicking && 'scale-90'
        )}
      >
        <span
          className={cn(
            'text-[10px] font-mono tracking-widest font-bold uppercase transition-opacity duration-200',
            mode === 'view' ? 'opacity-100' : 'opacity-0'
          )}
        >
          VIEW
        </span>
      </div>
    </>
  );
}
