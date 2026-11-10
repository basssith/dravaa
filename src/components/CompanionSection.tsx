'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Smile } from '@/components/icons';
import { SnakeLine } from '@/components/SnakeLine';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-application context continuity'
];

/**
 * CompanionInteractiveSection:
 * Implements the scroll-driven pinned narrative:
 * 1. Pinned container (180vh scroll track so user has complete control over stages).
 * 2. Stage 1 (0% - 35%):
 *    - "MEET THE DRAVA COMPANION." headline is visible.
 *    - The rounded rectangle card with the luminous green Smile Logo smoothly glides up from below, scales, and fits neatly into position.
 * 3. Stage 2 (35% - 70%):
 *    - Card is firmly docked in place on the left.
 *    - The 3 numbered items (01, 02, 03) glide and fade in sequentially with high-contrast typography.
 * 4. Stage 3 (70% - 100%):
 *    - The pinned card & companion panel smoothly translate upwards, clearing the screen as the user scrolls into the ticker banner ("Let's make technology feel effortless").
 */
export function CompanionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Progress through the pinned section: 0 when top touches top of viewport, 1 when track ends
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Compute animated transitions based on scroll progress:
  // Phase 1 (0.0 to 0.35): Card entrance and docking
  const cardEntryProgress = Math.min(1, Math.max(0, scrollProgress / 0.35));
  // Smooth cubic ease out
  const cardEase = 1 - Math.pow(1 - cardEntryProgress, 3);
  const cardTranslateY = (1 - cardEase) * 140; // slides in from 140px below
  const cardScale = 0.88 + cardEase * 0.12;
  const cardOpacity = Math.min(1, cardEntryProgress * 1.8);

  // Phase 2 (0.35 to 0.70): Sequential reveal of the 3 points
  const itemsProgress = Math.min(1, Math.max(0, (scrollProgress - 0.35) / 0.35));

  // Phase 3 (0.75 to 1.0): Entire scene glides up and out
  const exitProgress = Math.min(1, Math.max(0, (scrollProgress - 0.75) / 0.25));
  const exitEase = Math.pow(exitProgress, 2);
  const exitTranslateY = -exitEase * 180; // glides up 180px
  const exitOpacity = 1 - exitProgress * 0.9;

  return (
    <div
      ref={containerRef}
      id="approach"
      className="relative h-[220vh] w-full"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Animated Snake Line in background */}
        <SnakeLine variant="approach" />

        {/* Content wrapper with exit transition */}
        <div
          className="wrap relative z-10 w-full transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate3d(0, ${exitTranslateY}px, 0)`,
            opacity: exitOpacity
          }}
        >
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* --- LEFT COLUMN: RECTANGLE CARD WITH GREEN SMILE LOGO & 3D ACCENTS --- */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div
                className="relative w-full max-w-[380px] sm:max-w-[420px] transition-transform duration-75 will-change-transform"
                style={{
                  transform: `translate3d(0, ${cardTranslateY}px, 0) scale(${cardScale})`,
                  opacity: cardOpacity
                }}
              >
                {/* Outer 3D Card Shell matching the reference */}
                <div className="relative aspect-[3/4] w-full rounded-[36px] p-[3px] bg-gradient-to-b from-[#1a1f26] via-[#101318] to-[#0a0d12] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden group">
                  {/* Inner Dark Beveled Face */}
                  <div className="relative h-full w-full rounded-[33px] bg-[#0c0f14] overflow-hidden flex flex-col items-center justify-center p-8">
                    {/* Background subtle radial illumination */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(182,255,102,0.18),transparent_65%)] pointer-events-none" />

                    {/* Minimal Grid overlay inside card */}
                    <div
                      className="absolute inset-0 opacity-[0.08] pointer-events-none"
                      style={{
                        backgroundImage: `linear-gradient(to right, #b6ff66 1px, transparent 1px), linear-gradient(to bottom, #b6ff66 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                      }}
                    />

                    {/* Camera / Sensor notch at top */}
                    <div className="absolute top-5 flex items-center gap-1.5 opacity-60">
                      <span className="size-2 rounded-full bg-accent animate-pulse" />
                      <span className="size-1.5 rounded-full bg-white/40" />
                    </div>

                    {/* Luminous Green Smile Logo (Heart of the Companion) */}
                    <div className="relative z-10 flex flex-col items-center my-auto">
                      <div className="relative grid place-items-center size-28 sm:size-32 rounded-3xl bg-black/40 border border-[#b6ff66]/20 shadow-[0_0_35px_rgba(182,255,102,0.25)]">
                        <Smile className="size-16 sm:size-20 fill-accent drop-shadow-[0_0_14px_rgba(182,255,102,0.8)] transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      
                      {/* Subtitle tag inside card */}
                      <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#b6ff66] font-semibold bg-[#b6ff66]/10 px-3 py-1 rounded-full border border-[#b6ff66]/25">
                        Drava Companion v2.0
                      </span>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-white/40">
                      <span>TELEMETRY ACTIVE</span>
                      <span className="text-[#b6ff66]">LIVE</span>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Geometric chips matching reference */}
                <div
                  aria-hidden="true"
                  className="absolute -top-4 -left-6 size-12 rounded-xl bg-accent/25 backdrop-blur-md border border-accent/40 shadow-lg -rotate-12 transition-transform duration-500 pointer-events-none hidden sm:block"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-4 -left-4 size-10 rounded-lg bg-[#b6ff66]/20 backdrop-blur-md border border-[#b6ff66]/30 shadow-lg rotate-45 transition-transform duration-500 pointer-events-none hidden sm:block"
                />
              </div>
            </div>

            {/* --- RIGHT COLUMN: HEADLINE, LEAD TEXT & SEQUENTIAL 3 NUMBERED POINTS --- */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Headline */}
              <div className="space-y-1">
                <h2 className="font-display text-[clamp(2.5rem,2rem+3.2vw,5.2rem)] font-bold uppercase tracking-tight leading-[1.02] text-ink">
                  MEET THE <br />
                  DRAVA <br />
                  <span className="inline-block bg-[#b6ff66] text-black px-3 sm:px-4 py-0.5 rounded-[6px] shadow-[0_4px_20px_rgba(182,255,102,0.35)]">
                    COMPANION.
                  </span>
                </h2>
              </div>

              {/* Subheading */}
              <p className="mt-6 max-w-[54ch] text-[clamp(1rem,0.95rem+0.3vw,1.18rem)] leading-relaxed text-ink-2">
                Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges
                applications and guides zero-friction workflows in real time.
              </p>

              {/* Sequential 3 Numbered Points */}
              <ol className="mt-8 sm:mt-10 border-t border-line divide-y divide-line">
                {COMPANION_ITEMS.map((item, i) => {
                  // Sequential staggered delay for the 3 points (0.0 to 1.0 across itemsProgress)
                  const itemThreshold = i * 0.28;
                  const itemActive = itemsProgress >= itemThreshold;
                  const itemP = Math.min(1, Math.max(0, (itemsProgress - itemThreshold) / 0.3));
                  const itemEase = 1 - Math.pow(1 - itemP, 3);
                  const itemTranslateX = (1 - itemEase) * 30; // slides in from right

                  return (
                    <li
                      key={item}
                      className="py-5 sm:py-6 flex items-baseline gap-4 sm:gap-6 transition-all duration-300 will-change-transform"
                      style={{
                        transform: `translate3d(${itemTranslateX}px, 0, 0)`,
                        opacity: itemP
                      }}
                    >
                      <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-accent bg-black px-2 py-0.5 rounded-[4px]">
                        0{i + 1}
                      </span>
                      <span className="font-display text-[clamp(1.1rem,1rem+0.5vw,1.45rem)] font-semibold tracking-tight text-ink leading-snug">
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
