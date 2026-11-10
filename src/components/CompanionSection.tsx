'use client';

import { useEffect, useRef } from 'react';
import { SnakeLine } from '@/components/SnakeLine';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-application context continuity'
];

interface Particle {
  x: number;
  y: number;
  alpha: number;
  scale: number;
  rot: number;
}

/**
 * CompanionSection (4th Screen):
 * Requirements:
 * 1. Background: Solid dark/black (#0a0c0e) with precision white architectural grid overlay.
 * 2. Layout (Swapped sides):
 *    - LEFT SIDE: Main content
 *      Line 1: "MEET THE DRAVA" (white font)
 *      Line 2: "COMPANION." (WHITE font inside a full green rectangle highlight box)
 *      Subheading: Refined, compact typography underneath.
 *    - RIGHT SIDE: 3 Numbered points
 *      Numbered with normal grey font (no box around numbers).
 * 3. Interactive Cursor Smile Logo Trail:
 *    - No black enclosing box around the sticker — raw, pure green Drava Smile logo mark.
 *    - Normal prominent size (approx 36px - 44px).
 *    - Cursor trail: Whenever the cursor moves across this section (especially when moved fast),
 *      it spawns glowing green smile logos that linger smoothly and fade out organically everywhere the cursor moves!
 */
export function CompanionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    const canvas = canvasRef.current;
    if (!sec || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = sec.offsetWidth);
    let height = (canvas.height = sec.offsetHeight);

    const onResize = () => {
      if (!sec || !canvas) return;
      width = canvas.width = sec.offsetWidth;
      height = canvas.height = sec.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const particles: Particle[] = [];
    let lastX = -1000;
    let lastY = -1000;
    let animId: number;

    // Draw the Drava Smile logo mark directly onto 2D canvas with high performance
    // Smile shape coordinates normalized to 40x40
    const drawSmile = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      scale: number,
      alpha: number,
      rotation: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(scale, scale);
      context.globalAlpha = alpha;

      // Radiant green glow
      context.shadowColor = '#b6ff66';
      context.shadowBlur = 14;
      context.fillStyle = '#b6ff66';

      // Draw Drava Smile Logo Geometry:
      // Two square eyes + a quarter-circle curve smile
      const s = 0.22; // scale factor
      context.translate(-18, -18);

      // Eye 1
      context.beginPath();
      context.roundRect(14 * s, 10 * s, 40 * s, 40 * s, 4 * s);
      context.fill();

      // Eye 2
      context.beginPath();
      context.roundRect(77 * s, 10 * s, 40 * s, 40 * s, 4 * s);
      context.fill();

      // Quarter-circle mouth: M118 50h40A104 104 0 0 1 54 154v-40a64 64 0 0 0 64-64z
      context.beginPath();
      context.moveTo(118 * s, 50 * s);
      context.lineTo(158 * s, 50 * s);
      context.arc(54 * s, 50 * s, 104 * s, 0, Math.PI / 2, false);
      context.lineTo(54 * s, 114 * s);
      context.arc(54 * s, 50 * s, 64 * s, Math.PI / 2, 0, true);
      context.closePath();
      context.fill();

      context.restore();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = sec.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dist = Math.hypot(x - lastX, y - lastY);

      // When moving (especially moving fast), spawn particles along the path
      if (dist > 18) {
        particles.push({
          x,
          y,
          alpha: 1.0,
          scale: 0.95 + Math.random() * 0.25,
          rot: (Math.random() - 0.5) * 0.3
        });
        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= 0.016; // smooth organic fade out
        p.scale += 0.003; // subtle expanding breath

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          drawSmile(ctx, p.x, p.y, p.scale, p.alpha, p.rot);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative z-10 min-h-screen w-full bg-[#0a0c0e] text-white py-section lg:py-36 overflow-hidden transition-colors duration-700"
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

      {/* 5. Interactive Green Smile Cursor Canvas (Particles trail on fast movement without any black shape) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none"
      />

      {/* --- MAIN CONTENT GRID (SWAPPED SIDES) --- */}
      <div className="wrap relative z-10 flex min-h-[75vh] flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* --- LEFT SIDE: TWO-LINE HEADLINE & REDUCED SUBHEADING ---
              Line 1: MEET THE DRAVA (white)
              Line 2: COMPANION. (WHITE font inside a FULL RECTANGLE green box)
          */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-display text-[clamp(2.4rem,1.9rem+2.8vw,4.8rem)] font-bold uppercase tracking-tight leading-[1.08] text-white">
              <span className="block text-white">MEET THE DRAVA</span>
              <span className="inline-block mt-3 bg-[#b6ff66] text-white px-5 sm:px-6 py-2 rounded-[6px] shadow-[0_6px_30px_rgba(182,255,102,0.45)]">
                COMPANION.
              </span>
            </h2>

            {/* Slightly reduced, refined subheading */}
            <p className="mt-6 max-w-[50ch] text-[clamp(0.92rem,0.88rem+0.25vw,1.06rem)] leading-relaxed text-[#a0a5b0]">
              Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges
              applications and guides zero-friction workflows in real time.
            </p>
          </div>

          {/* --- RIGHT SIDE: 3 NUMBERED POINTS ---
              Normal grey font numbers (no box around numbers), high-contrast text
          */}
          <div className="lg:col-span-5 flex flex-col justify-center">
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

        </div>
      </div>
    </section>
  );
}
