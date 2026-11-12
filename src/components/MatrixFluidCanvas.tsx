'use client';

import { useEffect, useRef } from 'react';

/**
 * MatrixFluidCanvas:
 * Interactive Matrix Binary (0 and 1) grid in black & grey tones with fluid physics.
 * - Digital stream of binary digits ('0' and '1') in shades of black, dark grey, and charcoal.
 * - Interactive mouse/touch fluid simulation:
 *   When the cursor moves across the canvas, digits get pushed away, swirl, and ripple smoothly
 *   like particles suspended in liquid, then gently spring back to their stream paths.
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

    // Fluid pointer state
    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      radius: 140,
      active: false,
    };

    interface BinaryParticle {
      char: string;
      originX: number;
      originY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      speed: number;
      opacity: number;
      baseColor: string; // shades of black & grey
      size: number;
      changeTimer: number;
    }

    let particles: BinaryParticle[] = [];

    // High-visibility palette for #393b3d background: clean greys and whites
    const greyShades = [
      'rgba(240, 245, 250, ', // near white
      'rgba(215, 222, 230, ', // light silver
      'rgba(185, 195, 205, ', // medium silver grey
      'rgba(145, 155, 165, ', // slate grey
      'rgba(25, 28, 30, ',    // deep charcoal accent
    ];

    const initParticles = () => {
      particles = [];
      const colSpacing = 36; // larger spacing for big digits
      const rowSpacing = 42;
      const cols = Math.ceil(width / colSpacing);
      const rows = Math.ceil(height / rowSpacing);

      for (let c = 0; c < cols; c++) {
        const x = c * colSpacing + (Math.random() - 0.5) * 8;
        for (let r = 0; r < rows; r++) {
          const y = r * rowSpacing + (Math.random() - 0.5) * 8;
          const char = Math.random() > 0.5 ? '1' : '0';
          const shade = greyShades[Math.floor(Math.random() * greyShades.length)];
          const baseOpacity = 0.25 + Math.random() * 0.55;

          particles.push({
            char,
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            speed: 0.35 + Math.random() * 0.7,
            opacity: baseOpacity,
            baseColor: shade,
            size: 20 + Math.random() * 4,
            changeTimer: Math.floor(Math.random() * 200),
          });
        }
      }
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

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (mouse.prevX !== -1000) {
        mouse.vx = (currentX - mouse.prevX) * 0.4;
        mouse.vy = (currentY - mouse.prevY) * 0.4;
      }
      mouse.prevX = mouse.x = currentX;
      mouse.prevY = mouse.y = currentY;
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    // Render loop with fluid physics
    const render = () => {
      // Natural dampening of mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.font = '700 20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const radiusSq = mouse.radius * mouse.radius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Random matrix digit flip
        p.changeTimer++;
        if (p.changeTimer > 180) {
          p.char = p.char === '1' ? '0' : '1';
          p.changeTimer = 0;
        }

        // Fluid downward matrix drift
        p.originY += p.speed;
        if (p.originY > height + 20) {
          p.originY = -20;
          p.y = -20;
        }

        // Interaction with mouse (fluid push & swirl)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius);
            
            // Push away (fluid displacement)
            const pushX = (dx / dist) * force * 12;
            const pushY = (dy / dist) * force * 12;

            // Swirl / vorticity (fluid curl effect)
            const swirlX = -(dy / dist) * force * (mouse.vx * 0.5 + 2);
            const swirlY = (dx / dist) * force * (mouse.vy * 0.5 + 2);

            p.vx += pushX + swirlX * 0.3;
            p.vy += pushY + swirlY * 0.3;
          }
        }

        // Spring force returning particle smoothly to its downward stream position
        const targetX = p.originX;
        const targetY = p.originY;

        const homeDx = targetX - p.x;
        const homeDy = targetY - p.y;

        p.vx += homeDx * 0.045; // spring tension
        p.vy += homeDy * 0.045;

        // Fluid drag / viscosity
        p.vx *= 0.88;
        p.vy *= 0.88;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Dynamic opacity based on fluid velocity (moving digits glow slightly more)
        const vel = Math.hypot(p.vx, p.vy);
        const dynamicAlpha = Math.min(p.opacity + vel * 0.08, 0.85);

        ctx.fillStyle = `${p.baseColor}${dynamicAlpha})`;
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
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

