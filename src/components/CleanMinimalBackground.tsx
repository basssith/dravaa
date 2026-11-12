'use client';

import { useEffect, useRef } from 'react';

/**
 * CleanMinimalBackground:
 * A high-end architectural ambient background for the entire page:
 * - Subtle precision grid pattern (56px intervals with delicate line opacity)
 * - Soft reactive cursor fluid illumination (diffuse organic glow that follows user movement)
 * - Calibrated with Drava's clean paper palette (#f2f2ee) to ensure maximum contrast and clarity
 * - Zero lag: CSS background geometry + GPU-accelerated canvas light layer
 */
export function CleanMinimalBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animId: number;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const loop = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (el) {
        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Smooth, ambient fluid illumination following the cursor without grid lines */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[550px] h-[550px] rounded-full pointer-events-none transition-opacity duration-700 ease-out will-change-transform opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(182, 255, 102, 0.12) 0%, rgba(200, 240, 160, 0.05) 40%, transparent 70%)',
          filter: 'blur(35px)'
        }}
      />

      {/* Soft peripheral vignette preserving edge readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(242,242,238,0.4)_100%)]" />
    </div>
  );
}

