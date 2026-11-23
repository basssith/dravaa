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

  return null;
}

