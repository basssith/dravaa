'use client';

import { useEffect, useRef } from 'react';

type Props = {
  /**
   * Variant path / styling:
   * 'intro': Weaving across the second section ([01] What we do)
   * 'approach': Weaving alongside the companion section ([03] Approach)
   */
  variant?: 'intro' | 'approach';
};

/**
 * Animated Ribbon Wave Line:
 * Matches the reference animation:
 * - Fluid undulating ribbon wave that travels horizontally across the viewport.
 * - Solid luminous green fill (#b6ff66) with soft rounded cap geometry.
 * - Layered with a subtle glow for depth on dark or light backgrounds.
 * - Dual motion: Organic ambient undulation + scroll-accelerated traversal.
 * - Completely non-blocking (pointer-events-none).
 */
export function SnakeLine({ variant = 'intro' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Resize handler with High-DPI support
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 200);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Scroll progress tracker
    let scrollProgress = 0;
    let targetScrollProgress = 0;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDist = windowH + rect.height;
      const currentDist = windowH - rect.top;
      const p = Math.max(0, Math.min(1, currentDist / totalDist));
      targetScrollProgress = p;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    scrollProgress = targetScrollProgress;

    // Animation state
    let rafId: number;
    let time = 0;

    // Config based on variant
    const isIntro = variant === 'intro';
    const ribbonThickness = isIntro ? 18 : 22; // Ribbon height in px

    const render = () => {
      time += 0.016;

      // Smooth scroll interpolation
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Traversal progression:
      // The wave travels continuously from left to right, boosted by scroll position
      // Loop cycle: 0 -> 1 -> 0 seamless infinite flow
      const scrollShift = scrollProgress * 1.5;
      const flowOffset = (time * 0.22 + scrollShift) % 2.5;

      // Base wave centerline function
      // Y position across normalized x (0 to 1)
      const getY = (normX: number, t: number) => {
        if (isIntro) {
          // Sweeps gracefully through the statement text
          // Waves from ~35% height to ~70% height
          const base = height * 0.52;
          const w1 = Math.sin(normX * Math.PI * 2.2 - t * 1.8) * (height * 0.18);
          const w2 = Math.cos(normX * Math.PI * 4.4 + t * 0.9) * (height * 0.08);
          const w3 = Math.sin(normX * Math.PI * 1.2 + t * 0.6) * (height * 0.05);
          return base + w1 + w2 + w3;
        } else {
          // Approach: flows through the middle-bottom beside the 3D companion
          const base = height * 0.48;
          const w1 = Math.sin(normX * Math.PI * 2.6 - t * 1.6) * (height * 0.22);
          const w2 = Math.cos(normX * Math.PI * 5.0 + t * 1.1) * (height * 0.09);
          const w3 = Math.sin(normX * Math.PI * 1.5 - t * 0.7) * (height * 0.06);
          return base + w1 + w2 + w3;
        }
      };

      // Draw 2 layers:
      // 1. Soft glowing aura underneath
      // 2. Crisp, solid luminous ribbon on top

      // A sliding wave pulse: span roughly 60% - 75% of container width
      const pulseLength = 0.68;
      // Leading head of the pulse
      const headX = (flowOffset * 1.4) - 0.2;
      const tailX = headX - pulseLength;

      // Step along x to build the top edge and bottom edge
      const stepPx = 4;
      const totalSteps = Math.ceil(width / stepPx);

      // Collect points for the active visible ribbon segment
      const topPoints: { x: number; y: number; alpha: number }[] = [];
      const botPoints: { x: number; y: number; alpha: number }[] = [];

      for (let i = 0; i <= totalSteps; i++) {
        const x = i * stepPx;
        const normX = x / width;

        // Is this point within the sliding ribbon segment?
        if (normX < tailX || normX > headX) continue;

        // Distance from tail (0 to 1)
        const rel = (normX - tailX) / pulseLength;

        // Smooth tapered ends at head and tail
        // Sin envelope gives rounded pill-like tips
        const taper = Math.sin(rel * Math.PI);
        const currentThickness = Math.max(1, ribbonThickness * Math.pow(taper, 0.45));

        const midY = getY(normX, time);
        const halfThick = currentThickness * 0.5;

        // Opacity smoothly drops at the very edges of the screen
        const screenMargin = 0.08;
        let edgeAlpha = 1;
        if (normX < screenMargin) edgeAlpha = normX / screenMargin;
        else if (normX > 1 - screenMargin) edgeAlpha = (1 - normX) / screenMargin;

        const alpha = Math.max(0, Math.min(1, taper * edgeAlpha));

        topPoints.push({ x, y: midY - halfThick, alpha });
        botPoints.push({ x, y: midY + halfThick, alpha });
      }

      if (topPoints.length > 2) {
        // Build the ribbon path
        ctx.save();

        // 1. Luminous Outer Glow Layer
        ctx.beginPath();
        ctx.moveTo(topPoints[0].x, topPoints[0].y);
        for (let i = 1; i < topPoints.length; i++) {
          ctx.lineTo(topPoints[i].x, topPoints[i].y);
        }
        for (let i = botPoints.length - 1; i >= 0; i--) {
          ctx.lineTo(botPoints[i].x, botPoints[i].y);
        }
        ctx.closePath();

        ctx.shadowColor = 'rgba(182, 255, 102, 0.85)';
        ctx.shadowBlur = 18;
        ctx.fillStyle = 'rgba(182, 255, 102, 0.35)';
        ctx.fill();

        // 2. Solid High-Contrast Ribbon Fill
        // Green gradient matching reference (#b6ff66 with subtle white core)
        const grad = ctx.createLinearGradient(
          topPoints[0].x,
          0,
          topPoints[topPoints.length - 1].x,
          0
        );
        grad.addColorStop(0, 'rgba(182, 255, 102, 0.05)');
        grad.addColorStop(0.15, 'rgba(182, 255, 102, 0.95)');
        grad.addColorStop(0.5, 'rgba(215, 255, 160, 1.0)');
        grad.addColorStop(0.85, 'rgba(182, 255, 102, 0.95)');
        grad.addColorStop(1, 'rgba(182, 255, 102, 0.05)');

        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(182, 255, 102, 0.6)';
        ctx.fillStyle = grad;
        ctx.fill();

        // 3. Crisp Inner Centerline Accent for dynamic sheen
        ctx.beginPath();
        for (let i = 0; i < topPoints.length; i++) {
          const midX = topPoints[i].x;
          const midY = (topPoints[i].y + botPoints[i].y) * 0.5;
          if (i === 0) ctx.moveTo(midX, midY);
          else ctx.lineTo(midX, midY);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full pointer-events-none"
        style={{ mixBlendMode: 'normal' }}
      />
    </div>
  );
}
