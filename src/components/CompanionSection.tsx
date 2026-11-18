'use client';

import { useEffect, useRef } from 'react';
import { WordScrub } from './type';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-product context continuity'
];

export function CompanionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    if (!section || !leftCol || !rightCol) return;

    const listItems = rightCol.querySelectorAll<HTMLElement>('[data-point-item]');
    const leftWords = leftCol.querySelectorAll<HTMLElement>('.w-scrub');
    const rightWords = rightCol.querySelectorAll<HTMLElement>('.w-scrub');

    // Initially hide the right points and their individual separator lines
    gsap.set(listItems, { y: 35, opacity: 0 });

    if (leftWords.length > 0) {
      // 1. Initial state of all text (left & right): dim subtle green-grey
      gsap.set([leftWords, rightWords], { color: 'rgba(182, 255, 102, 0.22)', opacity: 0.35 });

      // 2. Timeline synchronized with scroll:
      // STEP 1: Left subheading words scrub through brand green to pure white
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: leftCol,
          start: 'top 70%',
          end: 'bottom 25%',
          scrub: 0.5,
        },
      });

      leftWords.forEach((w) => {
        tl.to(
          w,
          {
            color: '#b6ff66',
            opacity: 1,
            duration: 0.12,
            ease: 'power1.inOut',
          }
        ).to(
          w,
          {
            color: '#ffffff',
            opacity: 1,
            duration: 0.16,
            ease: 'power1.out',
          },
          '+=0.03'
        );
      });

      // STEP 2: Animate point-by-point sequentially (Point 1, then Point 2, then Point 3):
      // Each point and its dividing border line appear ONLY after the left text completes
      listItems.forEach((li) => {
        // Line & point appear
        tl.to(
          li,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
          '+=0.1'
        );

        // Words inside this point scrub sequentially
        const itemWords = li.querySelectorAll<HTMLElement>('.w-scrub');
        itemWords.forEach((rw) => {
          tl.to(
            rw,
            {
              color: '#b6ff66',
              opacity: 1,
              duration: 0.12,
              ease: 'power1.inOut',
            }
          ).to(
            rw,
            {
              color: '#ffffff',
              opacity: 1,
              duration: 0.16,
              ease: 'power1.out',
            },
            '+=0.03'
          );
        });

        // Small pause between each point
        tl.to({}, { duration: 0.1 });
      });

      return () => {
        tl.kill();
      };
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      data-companion-card
      className="relative z-30 min-h-screen w-full bg-[#000000] text-white py-section lg:py-28 overflow-hidden flex flex-col justify-between rounded-t-[36px] sm:rounded-t-[48px] border-t border-white/10 shadow-[0_-25px_80px_rgba(0,0,0,0.95)] will-change-transform"
    >
      {/* Background ambient subtle glow aligned with Drava green */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#b6ff66]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* --- TOP BAR: 04 COMPANION TAG --- */}
      <div className="wrap relative z-20 w-full pt-4">
        <div className="inline-flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
            04
          </span>
          <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
            COMPANION
          </span>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="wrap relative z-20 flex min-h-[65vh] flex-col justify-center my-auto">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* --- LEFT SIDE: TWO-LINE HEADLINE & SUBHEADING --- */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-display text-[clamp(2.4rem,1.9rem+2.8vw,4.6rem)] font-bold tracking-tight leading-[1.15] text-white">
              <span className="block text-white">
                Meet the{' '}
                <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-3 sm:px-5 py-0.5 sm:py-1 rounded-[6px] sm:rounded-[8px] tracking-normal whitespace-nowrap shadow-none align-baseline">
                  Drava
                </span>
              </span>
              <span className="block mt-2 text-white">
                companion.
              </span>
            </h2>

            {/* Refined subheading with scroll WordScrub */}
            <div className="mt-6 max-w-[50ch] text-[clamp(0.92rem,0.88rem+0.25vw,1.06rem)] leading-relaxed text-[#c8ccd6]">
              <WordScrub
                as="p"
                className="leading-relaxed"
                text="Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges products and guides zero-friction workflows in real time."
              />
            </div>
          </div>

          {/* --- RIGHT SIDE: 3 NUMBERED POINTS OFFSET DOWN FOR ASYMMETRICAL AESTHETIC BALANCE --- */}
          <div
            ref={rightColRef}
            className="lg:col-span-5 flex flex-col justify-center lg:pt-60 xl:pt-72"
          >
            <ol className="border-none">
              {COMPANION_ITEMS.map((item, i) => (
                <li
                  key={item}
                  data-point-item
                  className="py-6 sm:py-7 flex items-baseline gap-5 sm:gap-6 group transition-colors duration-300 cursor-default will-change-transform border-b border-white/10 first:border-t"
                >
                  <span className="inline-flex items-center justify-center font-mono text-xs font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-white/10 text-white/80 group-hover:bg-[#b6ff66] group-hover:text-black transition-all duration-300 select-none">
                    0{i + 1}
                  </span>
                  <div className="font-display text-[clamp(1.1rem,1rem+0.45vw,1.4rem)] font-semibold tracking-tight text-[#f0f2f5] leading-snug group-hover:text-[#b6ff66] transition-colors duration-300">
                    <WordScrub as="span" text={item} />
                  </div>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
}
