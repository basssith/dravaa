'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReduced } from '@/lib/gsap';
import { Smile } from './icons';
import { useUI } from './UIProvider';

/**
 * First visit per session: sleek dark screen with animated logo and name, then slides up.
 * The inline boot script in layout.tsx adds html.is-first before paint, so repeat
 * visits never see it flash.
 */
export function Preloader() {
  const { setIntroDone } = useUI();
  const root = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
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

    const tl = gsap.timeline({ onComplete: finish });

    // Initial state: logo and text hidden with subtle scale & blur
    gsap.set(logoRef.current, { scale: 0.8, opacity: 0, rotate: -8 });
    gsap.set(textRef.current, { opacity: 0, x: -20, filter: 'blur(8px)' });
    gsap.set(glowRef.current, { scale: 0.5, opacity: 0 });

    // Step 1: Glow burst behind the logo
    tl.to(
      glowRef.current,
      {
        scale: 1.5,
        opacity: 0.6,
        duration: 1.0,
        ease: 'power2.out',
      },
      0.1
    );

    // Step 2: Smile icon pops in smoothly with elastic rotation & glow
    tl.to(
      logoRef.current,
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.9,
        ease: 'back.out(1.6)',
      },
      0.2
    );

    // Step 3: 'drava' text slides in, unblurs and illuminates
    tl.to(
      textRef.current,
      {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
      },
      0.45
    );

    // Step 4: Cohesive pulse / breath before transition
    tl.to(
      [logoRef.current, textRef.current],
      {
        scale: 1.06,
        duration: 0.45,
        ease: 'power1.inOut',
      },
      '+=0.2'
    );
    tl.to(
      [logoRef.current, textRef.current],
      {
        scale: 1,
        duration: 0.45,
        ease: 'power1.inOut',
      }
    );

    // Step 5: Screen slides up gracefully to reveal the site
    tl.to(
      root.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: 'expo.inOut',
      },
      '+=0.1'
    )
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
      className="fixed inset-0 z-200 hidden place-items-center bg-[#000000] p-gutter text-white [html.is-first_&]:grid will-change-transform overflow-hidden select-none"
    >
      {/* Ambient background glow behind the logo */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute size-[280px] rounded-full bg-[#b6ff66]/15 blur-[90px] will-change-transform"
      />

      {/* Centered Logo & Brand Name */}
      <div className="relative z-10 flex items-center gap-3.5 font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-bold tracking-tight">
        <div ref={logoRef} className="will-change-transform drop-shadow-[0_0_24px_rgba(182,255,102,0.45)]">
          <Smile className="w-12 sm:w-16 md:w-20 fill-[#b6ff66]" />
        </div>
        <span
          ref={textRef}
          className="will-change-transform text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.18)]"
        >
          drava
        </span>
      </div>
    </div>
  );
}
