'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * HandsTouchingHero:
 * Completely off-screen start and finish with 100% hidden fingertips:
 * - Resting position is translated -115% / +115% off-screen so NO fingertips or hand pixels are visible at the beginning or when retreating.
 * - Both hands glide smoothly in from completely outside the viewport toward the center.
 * - Near-miss proximity: fingers reach close without touching.
 * - Smoothly glide back completely outside the viewport until 100% off-screen before seamlessly looping.
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

      // Kinematic trajectory:
      // Off-screen boundary is -115% (left) and 115% (right) -> ensures 100% hidden fingertips
      // Apex position is -1.5% (left) and +1.5% (right) -> ~20px gap without touching
      // 0.0s – 4.4s: Inward diagonal reach from completely outside to center
      // 4.4s – 4.8s: Apex hover (fingertips close, no touch)
      // 4.8s – 9.2s: Smooth retreat completely outside the viewport
      // 9.2s – 9.4s: Clean off-screen breath before loop restarts
      if (t < 4.4) {
        const p = t / 4.4;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;

        const humanX = (1 - ease) * -115 - ease * 1.5;
        const humanY = (1 - ease) * -50;
        const humanRot = (1 - ease) * -7;

        const robotX = (1 - ease) * 115 + ease * 1.5;
        const robotY = (1 - ease) * -50;
        const robotRot = (1 - ease) * 7;

        humanEl.style.transform = `translate3d(${humanX}%, ${humanY}px, 0) rotate(${humanRot}deg)`;
        robotEl.style.transform = `translate3d(${robotX}%, ${robotY}px, 0) rotate(${robotRot}deg)`;
      } else if (t < 4.8) {
        // Apex hover: fingertips close without touching
        humanEl.style.transform = 'translate3d(-1.5%, 0px, 0) rotate(0deg)';
        robotEl.style.transform = 'translate3d(1.5%, 0px, 0) rotate(0deg)';
      } else if (t < 9.2) {
        const p = (t - 4.8) / 4.4;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;

        const humanX = -1.5 - ease * (115 - 1.5);
        const humanY = ease * -50;
        const humanRot = ease * -7;

        const robotX = 1.5 + ease * (115 - 1.5);
        const robotY = ease * -50;
        const robotRot = ease * 7;

        humanEl.style.transform = `translate3d(${humanX}%, ${humanY}px, 0) rotate(${humanRot}deg)`;
        robotEl.style.transform = `translate3d(${robotX}%, ${robotY}px, 0) rotate(${robotRot}deg)`;
      } else {
        // Fully outside the viewport
        humanEl.style.transform = 'translate3d(-115%, -50px, 0) rotate(-7deg)';
        robotEl.style.transform = 'translate3d(115%, -50px, 0) rotate(7deg)';
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
          Initial rest position is -115%, completely outside the viewport with 0 visible pixels.
      */}
      <div
        ref={humanRef}
        className="absolute top-[38%] sm:top-[36%] lg:top-[38%] left-0 w-[51vw] min-w-[360px] pointer-events-none z-30 origin-left will-change-transform"
        style={{ transform: 'translate3d(-115%, -50px, 0) rotate(-7deg)' }}
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

      {/* --- RIGHT SIDE: ROBOTIC ARM ---
          Initial rest position is +115%, completely outside the viewport with 0 visible pixels.
      */}
      <div
        ref={robotRef}
        className="absolute top-[37%] sm:top-[35%] lg:top-[37%] right-0 w-[51vw] min-w-[360px] pointer-events-none z-30 origin-right will-change-transform"
        style={{ transform: 'translate3d(115%, -50px, 0) rotate(7deg)' }}
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
