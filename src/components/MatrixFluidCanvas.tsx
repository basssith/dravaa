'use client';

import { useEffect, useRef } from 'react';
import { RAIN_FLIP_EVERY, RAIN_FONT, rainCells, type RainCell } from '@/lib/rain';
import { SMILE_EYES, SMILE_PATH } from '@/lib/smile';

/**
 * MatrixFluidCanvas:
 * Interactive Matrix Binary (0 and 1) grid in black & grey tones with fluid physics.
 * - Digital stream of binary digits ('0' and '1') in shades of black, dark grey, and charcoal.
 * - At the cursor, the rain digits nearby are sucked in and arrange themselves into the Drava smile.
 *   The logo is always built from whatever rain is local: as the stream keeps falling (even with the
 *   cursor idle) or the cursor moves, digits that drift out of reach go back to their place in the
 *   rain and fresh nearby ones are pulled in.
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

    // The digit-built Drava smile (px). A digit whose place in the rain is within CAPTURE of the cursor
    // fills one slot of a GRID-spaced layout of the logo; once its place has fallen or the cursor has
    // moved beyond RELEASE it goes back to its place (CAPTURE < RELEASE so edge digits don't flicker).
    // Slots spring at HOLD; all movement is capped at MAX_V. Simulated: 54 slots, formed in ~0.75s,
    // ~7 digits/s swapped while idle, rebuilt in place after a move with the old digits home in ~1s.
    const LOGO_W = 150;
    const GRID = 11;
    const CAPTURE = 190;
    const RELEASE = 230;
    const HOLD = 0.06;
    const MAX_V = 9;
    const LIME = 'rgba(182, 255, 102, ';
    const s = LOGO_W / 170; // the smile's viewBox is 170×165

    // Slots: grid points inside the real logo shape, as offsets from the logo's centre.
    const logo = new Path2D(SMILE_PATH);
    for (const [x, y, size] of SMILE_EYES) logo.roundRect(x, y, size, size, 4);
    const slots: { x: number; y: number; taken: boolean }[] = [];
    for (let ly = GRID / s / 2; ly < 165; ly += GRID / s) {
      for (let lx = GRID / s / 2; lx < 170; lx += GRID / s) {
        if (ctx.isPointInPath(logo, lx, ly)) slots.push({ x: (lx - 85) * s, y: (ly - 82.5) * s, taken: false });
      }
    }
    let free = slots.length;

    const pointer = { clientX: 0, clientY: 0, active: false };
    const head = { x: 0, y: 0, shown: false }; // logo centre, eased toward the pointer

    interface BinaryParticle extends RainCell {
      originX: number; // its place in the rain (keeps falling even while the digit is in the logo)
      originY: number;
      vx: number;
      vy: number;
      slot: number; // index into slots while it forms part of the logo, else -1
    }

    let particles: BinaryParticle[] = [];

    // Same grid, colours and speeds as the wireframe section's rain (lib/rain.ts).
    const initParticles = () => {
      particles = rainCells(width, height).map((c) => ({
        ...c,
        originX: c.x,
        originY: c.y,
        vx: 0,
        vy: 0,
        slot: -1
      }));
      slots.forEach((sl) => (sl.taken = false));
      free = slots.length;
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
        head.x = px; // form right under the pointer instead of sliding in from the old spot
        head.y = py;
      }
      head.shown = pointer.active;
      head.x += (px - head.x) * 0.3;
      head.y += (py - head.y) * 0.3;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.font = RAIN_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Random matrix digit flip (logo digits keep flickering too, so it reads as live binary)
        p.flipTimer++;
        if (p.flipTimer > RAIN_FLIP_EVERY) {
          p.char = p.char === '1' ? '0' : '1';
          p.flipTimer = 0;
        }

        // Its place in the rain keeps falling, whether or not the digit is part of the logo.
        p.originY += p.speed;

        // Part of the logo: spring to its slot until its place in the rain is out of reach (it fell
        // on, or the cursor moved, left, or sits at the bottom edge), then go back to that place.
        if (p.slot >= 0) {
          const out = Math.hypot(p.originX - head.x, p.originY - head.y) > RELEASE;
          if (head.shown && !out && p.originY <= height + 20) {
            const sl = slots[p.slot];
            p.vx = (p.vx + (head.x + sl.x - p.x) * HOLD) * 0.82;
            p.vy = (p.vy + (head.y + sl.y - p.y) * HOLD) * 0.82;
            const v = Math.hypot(p.vx, p.vy);
            if (v > MAX_V) {
              p.vx *= MAX_V / v;
              p.vy *= MAX_V / v;
            }
            p.x += p.vx;
            p.y += p.vy;
            ctx.fillStyle = `${LIME}0.95)`;
            ctx.fillText(p.char, p.x, p.y);
            continue;
          }
          slots[p.slot].taken = false;
          free++;
          p.slot = -1;
        }

        // Rain falling off the bottom starts again at the top of its column.
        if (p.originY > height + 20) {
          p.originY = -20;
          p.y = -20;
          p.x = p.originX;
        }

        // Suck digits whose place is near the cursor into the nearest empty slot of the logo; fade the
        // rest of the rain close to it so the digit-built logo stays readable.
        let fade = 1;
        if (head.shown) {
          const d = Math.hypot(p.x - head.x, p.y - head.y);
          if (free > 0 && Math.hypot(p.originX - head.x, p.originY - head.y) < CAPTURE) {
            let best = -1;
            let bestD = Infinity;
            for (let j = 0; j < slots.length; j++) {
              if (slots[j].taken) continue;
              const sd = Math.hypot(head.x + slots[j].x - p.x, head.y + slots[j].y - p.y);
              if (sd < bestD) {
                bestD = sd;
                best = j;
              }
            }
            slots[best].taken = true;
            free--;
            p.slot = best;
            continue; // starts moving next frame
          }
          fade = Math.min(1, Math.max(0, (d - 60) / 60));
        }

        // Spring toward its place in the rain (gliding home after leaving the logo), with drag.
        p.vx = (p.vx + (p.originX - p.x) * 0.045) * 0.88;
        p.vy = (p.vy + (p.originY - p.y) * 0.045) * 0.88;
        const v = Math.hypot(p.vx, p.vy);
        if (v > MAX_V) {
          p.vx *= MAX_V / v;
          p.vy *= MAX_V / v;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Dynamic opacity based on fluid velocity (moving digits glow slightly more)
        const vel = Math.hypot(p.vx, p.vy);
        const dynamicAlpha = Math.min(p.opacity + vel * 0.08, 0.85);

        ctx.fillStyle = `${p.color}${dynamicAlpha * fade})`;
        ctx.fillText(p.char, p.x, p.y);
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
