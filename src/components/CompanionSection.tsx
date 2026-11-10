'use client';

import { useEffect, useRef, useState } from 'react';
import { SnakeLine } from '@/components/SnakeLine';
import { Smile } from '@/components/icons';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-application context continuity'
];

/**
 * CompanionSection (4th Screen):
 * Requirements:
 * 1. Background transition:
 *    - Scrolling into screen 4 transitions into a solid dark/black canvas (#0a0c0e) with a precision WHITE grid overlay (inverted technical grid).
 *    - Screen 4 glides up smoothly as you scroll into it.
 * 2. Layout & Typography:
 *    - Removed "[02] APPROACH".
 *    - 3 numbered points on the LEFT side with normal grey numbers (no box around the numbers).
 *    - "MEET THE DRAVA COMPANION." on the RIGHT side in exactly two lines:
 *      Line 1: "MEET THE DRAVA"
 *      Line 2: "COMPANION." with a bright green rectangle highlight box around "COMPANION.".
 *    - Reduced subheading size underneath the headline.
 * 3. Interactive Cursor Smile Logo:
 *    - On this 4th screen ONLY, a small green smile sticker/logo follows the cursor position and smoothly appears / disappears as the cursor moves over this section.
 */
export function CompanionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const smileCursorRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    const sec = sectionRef.current;
    const sticker = smileCursorRef.current;
    if (!sec || !sticker) return;

    let targetX = -100;
    let targetY = -100;
    let currX = -100;
    let currY = -100;
    let rafId: number;
    let idleTimer: NodeJS.Timeout;

    const onPointerMove = (e: PointerEvent) => {
      const rect = sec.getBoundingClientRect();
      // Check if cursor is inside this section
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetX = e.clientX;
        targetY = e.clientY;
        setCursorVisible(true);

        clearTimeout(idleTimer);
        // Gently fade out after 1.8s of inactivity, or reappears on motion
        idleTimer = setTimeout(() => {
          setCursorVisible(false);
        }, 1800);
      } else {
        setCursorVisible(false);
      }
    };

    const onPointerLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    sec.addEventListener('pointerleave', onPointerLeave);

    const loop = () => {
      currX += (targetX - currX) * 0.18;
      currY += (targetY - currY) * 0.18;

      if (sticker) {
        sticker.style.transform = `translate3d(${currX}px, ${currY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(idleTimer);
      window.removeEventListener('pointermove', onPointerMove);
      sec.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative z-10 min-h-screen w-full bg-[#0a0c0e] text-white py-section lg:py-32 overflow-hidden transition-colors duration-700"
    >
      {/* 1. Precision WHITE architectural grid on black background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] select-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.9) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px'
        }}
      />

      {/* 2. White cross-dot accent points */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.25] select-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 1.5px, transparent 1.5px)',
          backgroundSize: '112px 112px'
        }}
      />

      {/* 3. Subtle ambient luminous glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(182,255,102,0.1)_0%,transparent_70%)] blur-[60px]"
      />

      {/* 4. Animated Green Snake Line */}
      <SnakeLine variant="approach" />

      {/* 5. Interactive Cursor Green Smile Logo Sticker (Follows pointer and fades in/out) */}
      <div
        ref={smileCursorRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-300 ease-out will-change-transform ${
          cursorVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <div className="relative grid place-items-center size-10 rounded-2xl bg-[#0a0c0e]/90 border border-[#b6ff66]/70 shadow-[0_0_20px_rgba(182,255,102,0.65)] backdrop-blur-sm p-1.5">
          <Smile className="size-full fill-accent drop-shadow-[0_0_8px_rgba(182,255,102,0.9)]" />
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="wrap relative z-10 flex min-h-[75vh] flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* --- LEFT SIDE: 3 NUMBERED POINTS ---
              No box around numbers, clean grey numerals, high-contrast text
          */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center">
            <ol className="divide-y divide-white/10 border-t border-b border-white/10">
              {COMPANION_ITEMS.map((item, i) => (
                <li
                  key={item}
                  className="py-6 sm:py-7 flex items-baseline gap-5 sm:gap-6 group transition-colors duration-300"
                >
                  <span className="font-mono text-sm sm:text-base font-medium tracking-widest text-[#888c94] select-none">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[clamp(1.1rem,1rem+0.45vw,1.45rem)] font-semibold tracking-tight text-[#f0f2f5] leading-snug group-hover:text-accent transition-colors duration-300">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* --- RIGHT SIDE: TWO-LINE HEADLINE & REDUCED SUBHEADING ---
              Line 1: MEET THE DRAVA
              Line 2: COMPANION. (with bright green rectangle box)
          */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-display text-[clamp(2.4rem,1.9rem+2.8vw,4.8rem)] font-bold uppercase tracking-tight leading-[1.08] text-white">
              <span className="block">MEET THE DRAVA</span>
              <span className="inline-block mt-2 bg-[#b6ff66] text-black px-3.5 sm:px-5 py-1 rounded-[6px] shadow-[0_4px_25px_rgba(182,255,102,0.4)]">
                COMPANION.
              </span>
            </h2>

            {/* Slightly reduced, refined subheading */}
            <p className="mt-6 max-w-[50ch] text-[clamp(0.92rem,0.88rem+0.25vw,1.06rem)] leading-relaxed text-[#a0a5b0]">
              Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges
              applications and guides zero-friction workflows in real time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
