'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * EyeBlinkTransition:
 * Creates an organic "blinking of an eye" transition when scrolling between major sections:
 * - Upper and lower dark eyelid shutters snap shut from the top and bottom of the viewport,
 *   momentarily blacking out the screen for a split fraction of a second (like a rapid blink),
 *   then open smoothly to reveal the new space and background color.
 */
export function EyeBlinkTransition() {
  const topLidRef = useRef<HTMLDivElement>(null);
  const bottomLidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topLid = topLidRef.current;
    const bottomLid = bottomLidRef.current;
    if (!topLid || !bottomLid) return;

    // Trigger 1: Crossing from Landing Page into the 2nd Screen (#intro)
    const introEl = document.getElementById('intro');
    if (introEl) {
      ScrollTrigger.create({
        trigger: introEl,
        start: 'top 85%',
        onEnter: () => triggerBlink(),
        onLeaveBack: () => triggerBlink(),
      });
    }

    // Trigger 2: Crossing from #applications into #approach (4th Screen)
    const approachEl = document.getElementById('approach');
    if (approachEl) {
      ScrollTrigger.create({
        trigger: approachEl,
        start: 'top 85%',
        onEnter: () => triggerBlink(),
        onLeaveBack: () => triggerBlink(),
      });
    }

    const triggerBlink = () => {
      // Fast, organic eyelid snap shut and reopen (approx 0.38 seconds total)
      const tl = gsap.timeline();
      tl.to([topLid, bottomLid], {
        scaleY: 1,
        duration: 0.16,
        ease: 'power3.in',
      })
      .to([topLid, bottomLid], {
        scaleY: 0,
        duration: 0.22,
        ease: 'power3.out',
      });
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* Top Eyelid */}
      <div
        ref={topLidRef}
        className="absolute top-0 left-0 w-full h-[51%] bg-[#000000] origin-top will-change-transform"
        style={{ transform: 'scaleY(0)' }}
      />
      {/* Bottom Eyelid */}
      <div
        ref={bottomLidRef}
        className="absolute bottom-0 left-0 w-full h-[51%] bg-[#000000] origin-bottom will-change-transform"
        style={{ transform: 'scaleY(0)' }}
      />
    </div>
  );
}
