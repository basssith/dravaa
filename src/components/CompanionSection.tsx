'use client';

import { useEffect, useRef, useState } from 'react';
import { SnakeLine } from '@/components/SnakeLine';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-application context continuity'
];

/**
 * CompanionSection:
 * Clean, minimal, high-impact scroll narrative without robot, card, or smile logo:
 * - Stage 1: As you scroll in, "MEET THE DRAVA COMPANION." pins in view.
 * - Stage 2: The 3 numbered points (01, 02, 03) glide and fade in sequentially with high-contrast typography.
 * - Stage 3: The section smoothly glides up as the user scrolls into the ticker banner ("Let's make technology feel effortless").
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

  // Progression:
  // 0.0 to 0.65: 3 numbered points glide in sequentially
  const itemsProgress = Math.min(1, Math.max(0, scrollProgress / 0.65));

  // 0.70 to 1.0: Whole section smoothly glides up and out into the marquee banner
  const exitProgress = Math.min(1, Math.max(0, (scrollProgress - 0.7) / 0.3));
  const exitEase = Math.pow(exitProgress, 2);
  const exitTranslateY = -exitEase * 140;
  const exitOpacity = 1 - exitProgress * 0.95;

  return (
    <div
      ref={containerRef}
      id="approach"
      className="relative h-[200vh] w-full"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Animated Green Wave Line */}
        <SnakeLine variant="approach" />

        {/* Content wrapper with smooth exit transition */}
        <div
          className="wrap relative z-10 w-full transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate3d(0, ${exitTranslateY}px, 0)`,
            opacity: exitOpacity
          }}
        >
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* --- LEFT COLUMN: HEADLINE & LEAD TEXT --- */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <p className="tag mb-4">[02] Approach</p>
              <h2 className="font-display text-[clamp(2.5rem,2.2rem+3vw,5rem)] font-bold uppercase tracking-tight leading-[1.02] text-ink">
                MEET THE <br />
                DRAVA <br />
                <span className="inline-block bg-[#b6ff66] text-black px-3 sm:px-4 py-0.5 rounded-[6px] shadow-[0_4px_20px_rgba(182,255,102,0.35)]">
                  COMPANION.
                </span>
              </h2>

              <p className="mt-6 max-w-[48ch] text-[clamp(1rem,0.95rem+0.3vw,1.18rem)] leading-relaxed text-ink-2">
                Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges
                applications and guides zero-friction workflows in real time.
              </p>
            </div>

            {/* --- RIGHT COLUMN: SEQUENTIAL 3 NUMBERED POINTS --- */}
            <div className="lg:col-span-7 flex flex-col justify-center pt-2 lg:pt-8">
              <ol className="border-t border-line divide-y divide-line">
                {COMPANION_ITEMS.map((item, i) => {
                  const itemThreshold = i * 0.28;
                  const itemP = Math.min(1, Math.max(0, (itemsProgress - itemThreshold) / 0.32));
                  const itemEase = 1 - Math.pow(1 - itemP, 3);
                  const itemTranslateX = (1 - itemEase) * 36; // slides in from right

                  return (
                    <li
                      key={item}
                      className="py-6 sm:py-8 flex items-baseline gap-5 sm:gap-7 transition-all duration-300 will-change-transform"
                      style={{
                        transform: `translate3d(${itemTranslateX}px, 0, 0)`,
                        opacity: itemP
                      }}
                    >
                      <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-accent bg-black px-2.5 py-1 rounded-[4px]">
                        0{i + 1}
                      </span>
                      <span className="font-display text-[clamp(1.15rem,1.05rem+0.6vw,1.6rem)] font-semibold tracking-tight text-ink leading-snug">
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
