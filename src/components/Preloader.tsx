'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReduced } from '@/lib/gsap';
import { Smile } from './icons';
import { useUI } from './UIProvider';

/**
 * First visit per session: dark screen with a 000→100 counter, then slides up.
 * The inline boot script in layout.tsx adds html.is-first before paint, so repeat
 * visits never see it flash.
 */
export function Preloader() {
  const { setIntroDone } = useUI();
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    try {
      sessionStorage.setItem('drava-visited', '1');
    } catch {
      /* storage blocked */
    }
    const finish = () => {
      html.classList.remove('is-first');
      setGone(true);
    };
    if (!html.classList.contains('is-first') || prefersReduced()) {
      finish();
      setIntroDone(true);
      return;
    }
    const c = { v: 0 };
    const tl = gsap
      .timeline({ onComplete: finish })
      .to(c, {
        v: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(c.v)).padStart(3, '0');
        }
      })
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.15')
      .add(() => setIntroDone(true), '-=0.5');
    return () => {
      tl.kill();
    };
  }, [setIntroDone]);

  if (gone) return null;
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-200 hidden grid-rows-[1fr_auto] bg-ink p-gutter text-paper [html.is-first_&]:grid"
    >
      <div className="flex items-center gap-3 place-self-center font-display text-h4 font-bold tracking-tight">
        <Smile className="w-12 fill-accent" />
        <span>drava</span>
      </div>
      <div ref={count} className="t-mega justify-self-end tabular-nums">
        000
      </div>
    </div>
  );
}
