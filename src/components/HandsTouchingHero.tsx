'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * HandsTouchingHero:
 * Completely off-screen start and finish with 100% hidden fingertips:
 * - Resting position is translated completely off-screen (-120% / +120%) so NO fingertips or hand pixels are visible at the beginning or when retreating.
 * - Both hands glide smoothly in from completely outside the viewport toward the center.
 * - Dynamically computes the exact meeting apex based on viewport width:
 *   - On mobile/small screens, scales the arms proportionally (52vw, min-w-[210px] to prevent massive overflow)
 *   - Adjusts apex offset so fingertips reach together / touch right at the center line on mobile just like desktop!
 * - Smoothly glides back completely outside the viewport before seamlessly looping.
 * - 100% shock-free, slow and graceful continuous loop.
 */
export function HandsTouchingHero() {
  const humanRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;
    const CYCLE_DURATION = 9400; // 9.4s slow cinematic loop

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % CYCLE_DURATION;
      const t = elapsed / 1000; // time in seconds (0.0 to 9.4)

      const humanEl = humanRef.current;
      const robotEl = robotRef.current;

      if (!humanEl || !robotEl) {
        animId = requestAnimationFrame(animate);
        return;
      }

      // Check current window width
      const vw = window.innerWidth;
      const isMobile = vw < 640;

      // On mobile, arm container width is ~52vw.
      // Finger tip touches right at center (50vw):
      // human arm starts at left:0, width ~52vw.
      // Apex translation of ~ -1.5% to -2% brings right edge right to 50% vw.
      // On mobile, fine-tuned to ensure fingertips touch right at center!
      const humanApexX = isMobile ? -0.8 : -1.5;
      const robotApexX = isMobile ? 0.8 : 1.5;
      const offscreenOffset = 120; // 120% translation ensures 100% invisible offscreen

      // 0.0s – 4.4s: Inward diagonal reach from completely outside to center
      // 4.4s – 4.8s: Apex hover (fingertips touching / reaching center)
      // 4.8s – 9.2s: Smooth retreat completely outside the viewport
      // 9.2s – 9.4s: Clean off-screen breath before loop restarts
      if (t < 4.4) {
        const p = t / 4.4;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;

        const humanX = (1 - ease) * -offscreenOffset + ease * humanApexX;
        const humanY = (1 - ease) * -50;
        const humanRot = (1 - ease) * -7;

        const robotX = (1 - ease) * offscreenOffset + ease * robotApexX;
        const robotY = (1 - ease) * -50;
        const robotRot = (1 - ease) * 7;

        humanEl.style.transform = `translate3d(${humanX}%, ${humanY}px, 0) rotate(${humanRot}deg)`;
        robotEl.style.transform = `translate3d(${robotX}%, ${robotY}px, 0) rotate(${robotRot}deg)`;
      } else if (t < 4.8) {
        // Apex hover: fingertips touching at center
        humanEl.style.transform = `translate3d(${humanApexX}%, 0px, 0) rotate(0deg)`;
        robotEl.style.transform = `translate3d(${robotApexX}%, 0px, 0) rotate(0deg)`;
      } else if (t < 9.2) {
        const p = (t - 4.8) / 4.4;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;

        const humanX = humanApexX - ease * (offscreenOffset + humanApexX);
        const humanY = ease * -50;
        const humanRot = ease * -7;

        const robotX = robotApexX + ease * (offscreenOffset - robotApexX);
        const robotY = ease * -50;
        const robotRot = ease * 7;

        humanEl.style.transform = `translate3d(${humanX}%, ${humanY}px, 0) rotate(${humanRot}deg)`;
        robotEl.style.transform = `translate3d(${robotX}%, ${robotY}px, 0) rotate(${robotRot}deg)`;
      } else {
        // Fully outside the viewport
        humanEl.style.transform = `translate3d(-${offscreenOffset}%, -50px, 0) rotate(-7deg)`;
        robotEl.style.transform = `translate3d(${offscreenOffset}%, -50px, 0) rotate(7deg)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden select-none"
    >
      {/* --- LEFT SIDE: HUMAN ARM ---
          On mobile: w-[52vw] min-w-[200px] sm:min-w-[320px] lg:w-[51vw] lg:min-w-[360px]
          Ensures arms scale responsively so fingers reach each other in the center on all mobile screen widths.
      */}
      <div
        ref={humanRef}
        className="absolute top-[38%] sm:top-[36%] lg:top-[38%] left-0 w-[52vw] min-w-[200px] sm:min-w-[320px] lg:w-[51vw] lg:min-w-[360px] pointer-events-none z-30 origin-left will-change-transform"
        style={{ transform: 'translate3d(-120%, -50px, 0) rotate(-7deg)' }}
      >
        <Image
          src="/assets/tight_human_arm.png"
          alt=""
          width={524}
          height={250}
          priority
          className="h-auto w-full object-contain object-left pointer-events-none select-none"
        />
      </div>

      {/* --- RIGHT SIDE: ROBOTIC ARM --- */}
      <div
        ref={robotRef}
        className="absolute top-[37.4%] sm:top-[35.5%] lg:top-[37%] right-0 w-[52vw] min-w-[200px] sm:min-w-[320px] lg:w-[51vw] lg:min-w-[360px] pointer-events-none z-30 origin-right will-change-transform"
        style={{ transform: 'translate3d(120%, -50px, 0) rotate(7deg)' }}
      >
        <Image
          src="/assets/tight_robot_arm.png"
          alt=""
          width={788}
          height={290}
          priority
          className="h-auto w-full object-contain object-right pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
