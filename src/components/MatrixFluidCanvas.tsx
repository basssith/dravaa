'use client';

import { useEffect, useRef } from 'react';
import { RAIN_FLIP_EVERY, RAIN_FONT, rainCells, type RainCell } from '@/lib/rain';
import { SMILE_EYES, SMILE_PATH } from '@/lib/smile';

/**
 * MatrixFluidCanvas:
 * Interactive Matrix Binary (0 and 1) grid in black & grey tones with fluid physics.
 * - Digital stream of binary digits ('0' and '1') in shades of black, dark grey, and charcoal.
 * - The cursor becomes the Drava smile: digits falling near it flow into the top of the logo
 *   and pour back out where the smile ends, then keep falling.
 */
export function MatrixFluidCanvas() {
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
    let animId = 0;

    // Drava smile cursor (px). Digits falling within CAPTURE above the logo are pulled into its top;
    // inside SWALLOW they enter, travel for TRAVEL frames, and pour out of the smile's end.
    // Tuned so digits passing within ~90px of the logo flow through it and farther ones only bend.
    const LOGO_W = 72;
    const CAPTURE = 150;
    const SWALLOW = 22;
    const PULL = 2.2;
    const TRAVEL = 8;
    const LIME = 'rgba(182, 255, 102, ';
    const logoScale = LOGO_W / 170; // the smile's viewBox is 170×165
    const logo = new Path2D(SMILE_PATH);
    for (const [x, y, s] of SMILE_EYES) logo.roundRect(x, y, s, s, 4);

    const pointer = { clientX: 0, clientY: 0, active: false };
    const head = { x: 0, y: 0, shown: false }; // logo position, eased toward the pointer
    let gulp = 0; // brief swell each time a digit is swallowed

    interface BinaryParticle extends RainCell {
      homeX: number; // its own column, restored each time it rains in from the top again
      hidden: number; // frames left inside the logo
      glow: number; // lime afterglow after leaving the logo
      originX: number; // stream position the digit springs toward
      originY: number;
      vx: number;
      vy: number;
    }

    let particles: BinaryParticle[] = [];

    // Same grid, colours and speeds as the wireframe section's rain (lib/rain.ts).
    const initParticles = () => {
      particles = rainCells(width, height).map((c) => ({
        ...c,
        homeX: c.x,
        hidden: 0,
        glow: 0,
        originX: c.x,
        originY: c.y,
        vx: 0,
        vy: 0
      }));
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Viewport coords; converted every frame so the logo stays put while the page scrolls.
    // Only active over the section this canvas sits in (not the header or menu floating above it).
    const onPointerMove = (e: PointerEvent) => {
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.active = !!container.parentElement?.contains(e.target as Node);
    };

    // Fires when the mouse leaves the window or a finger lifts.
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const root = document.documentElement;
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave);

    const render = () => {
      const rect = container.getBoundingClientRect();
      const px = pointer.clientX - rect.left;
      const py = pointer.clientY - rect.top;
      if (pointer.active && !head.shown) {
        head.x = px; // appear right under the pointer instead of sliding in from the old spot
        head.y = py;
      }
      head.shown = pointer.active;
      head.x += (px - head.x) * 0.3;
      head.y += (py - head.y) * 0.3;
      gulp *= 0.9;
      const s = logoScale * (1 + gulp * 0.12); // swells slightly as it swallows
      const fromLogo = (lx: number, ly: number): [number, number] => [head.x + (lx - 85) * s, head.y + (ly - 82.5) * s];
      const [ix, iy] = fromLogo(66, 6); // intake: top of the logo, between the eyes

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.font = RAIN_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Inside the logo: travelling from the intake to the smile's end, then poured back out.
        if (p.hidden > 0) {
          if (--p.hidden === 0) {
            const [ex, ey] = fromLogo(50, 118 + Math.random() * 32); // just past the smile's end cap
            p.x = ex;
            p.y = ey;
            p.vx = -(1.5 + Math.random() * 2.5); // poured out to the left, then falls with the stream
            p.vy = Math.random();
            p.originX = ex - (10 + Math.random() * 40);
            p.originY = ey;
            p.glow = 1;
          }
          continue;
        }

        // Random matrix digit flip
        p.flipTimer++;
        if (p.flipTimer > RAIN_FLIP_EVERY) {
          p.char = p.char === '1' ? '0' : '1';
          p.flipTimer = 0;
        }

        // Fluid downward matrix drift
        p.originY += p.speed;
        if (p.originY > height + 20) {
          p.originY = -20;
          p.y = -20;
          p.originX = p.x = p.homeX; // back in its own column
        }

        // Suction from the top only: above the intake, pull the digit in and loosen its spring back
        // to the stream, so the closer it gets the less it can escape. Digits pouring out of the
        // smile's end are below the intake, so they are never sucked straight back in.
        let spring = 0.045;
        let fade = 1;
        let color = p.glow > 0.3 ? LIME : p.color;
        p.glow *= 0.97;
        if (head.shown && p.y < iy) {
          const dx = ix - p.x;
          const dy = iy - p.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < SWALLOW) {
            p.hidden = TRAVEL;
            gulp = Math.min(1, gulp + 0.08);
            continue;
          }
          if (d < CAPTURE) {
            const pull = 1 - d / CAPTURE; // 0 at the edge, 1 at the logo
            p.vx += (dx / d) * pull * pull * PULL;
            p.vy += (dy / d) * pull * pull * PULL;
            spring *= 1 - pull;
            fade = Math.min(1, (d - SWALLOW) / 40); // dissolve as it enters
            color = LIME; // turns Drava lime on its way in
          }
        }

        // Spring toward the stream position; the digit keeps falling meanwhile.
        p.vx += (p.originX - p.x) * spring;
        p.vy += (p.originY - p.y) * spring;

        // Fluid drag / viscosity
        p.vx *= 0.88;
        p.vy *= 0.88;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Dynamic opacity based on fluid velocity (moving digits glow slightly more)
        const vel = Math.hypot(p.vx, p.vy);
        const dynamicAlpha = Math.min(p.opacity + vel * 0.08, 0.85);

        ctx.fillStyle = `${color}${dynamicAlpha * fade})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      // The smile itself, centred on the pointer, drawn over the digits passing behind it.
      if (head.shown) {
        ctx.save();
        ctx.translate(head.x - 85 * s, head.y - 82.5 * s);
        ctx.scale(s, s);
        ctx.shadowColor = 'rgba(182, 255, 102, 0.55)';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#b6ff66';
        ctx.fill(logo);
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none"
    >
      {/* No fade at the bottom: the wireframe section continues the same rain (lib/rain.ts). */}
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

