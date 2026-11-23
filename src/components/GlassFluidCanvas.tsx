'use client';

import { useEffect, useRef } from 'react';

/**
 * Pure Clear Water Drop Cursor:
 * Features a realistic, transparent surface-tension water bead:
 * - Clear refractive volume (no heavy white milkiness)
 * - Organic teardrop / dewdrop elongation along the direction of motion
 * - Realistic meniscus contact shadow right beneath the drop
 * - Dual bright specular glints (primary key light + secondary ground reflection)
 * - Subtle caustic rim and surface tension snap when stopping
 * - Text underneath stays 100% crisp and readable
 */
export function GlassFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const NUM_NODES = 12;
    interface WaterNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const nodes: WaterNode[] = [];
    let mouseX = -999;
    let mouseY = -999;
    let targetX = -999;
    let targetY = -999;

    for (let i = 0; i < NUM_NODES; i++) {
      nodes.push({
        x: mouseX,
        y: mouseY,
        vx: 0,
        vy: 0,
        // Water bead: rounded 22px dewdrop tapering to 5px trailing meniscus
        radius: Math.max(5, 22 * Math.pow(1 - i / NUM_NODES, 0.65))
      });
    }

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (mouseX < 0) {
        mouseX = targetX;
        mouseY = targetY;
        for (const node of nodes) {
          node.x = mouseX;
          node.y = mouseY;
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor lerp
      mouseX += (targetX - mouseX) * 0.35;
      mouseY += (targetY - mouseY) * 0.35;

      // Surface tension spring physics (rapid snap-back like pure water)
      let prevX = mouseX;
      let prevY = mouseY;

      for (let i = 0; i < NUM_NODES; i++) {
        const node = nodes[i];
        const damping = 0.58;
        const spring = 0.38 - (i / NUM_NODES) * 0.12;

        const dx = prevX - node.x;
        const dy = prevY - node.y;

        node.vx = (node.vx + dx * spring) * damping;
        node.vy = (node.vy + dy * spring) * damping;

        node.x += node.vx;
        node.y += node.vy;

        prevX = node.x;
        prevY = node.y;
      }

      const head = nodes[0];
      const headSpeed = Math.hypot(head.vx, head.vy);

      if (mouseX > 0 && mouseY > 0) {
        // --- 1. Water Drop Contact Shadow (Realistic meniscus shadow) ---
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < NUM_NODES - 1; i++) {
          const n1 = nodes[i];
          const n2 = nodes[i + 1];
          ctx.moveTo(n1.x, n1.y + 2);
          ctx.lineTo(n2.x, n2.y + 2);
          ctx.lineWidth = Math.max(n1.radius, n2.radius) * 1.85;
          ctx.lineCap = 'round';
        }
        ctx.shadowColor = 'rgba(15, 25, 35, 0.08)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.strokeStyle = 'rgba(20, 30, 40, 0.05)';
        ctx.stroke();
        ctx.restore();

        // --- 2. Water Surface Tension Caustic Rim (Subtle light refraction) ---
        const waterRims = [
          { dx: -1.2, dy: -1.0, color: 'rgba(120, 200, 255, 0.30)', blur: 4, widthMul: 1.85 }, // Water blue
          { dx: 1.0, dy: -1.0, color: 'rgba(182, 255, 102, 0.38)', blur: 4, widthMul: 1.82 },  // Drava green reflection
          { dx: 1.2, dy: 1.0, color: 'rgba(255, 255, 255, 0.45)', blur: 5, widthMul: 1.86 }   // Sunlight fringe
        ];

        for (const rim of waterRims) {
          ctx.save();
          ctx.beginPath();
          for (let i = 0; i < NUM_NODES - 1; i++) {
            const n1 = nodes[i];
            const n2 = nodes[i + 1];
            ctx.moveTo(n1.x + rim.dx, n1.y + rim.dy);
            ctx.lineTo(n2.x + rim.dx, n2.y + rim.dy);
            ctx.lineWidth = Math.max(n1.radius, n2.radius) * rim.widthMul;
            ctx.lineCap = 'round';
            ctx.strokeStyle = rim.color;
            ctx.shadowColor = rim.color;
            ctx.shadowBlur = rim.blur;
          }
          ctx.stroke();
          ctx.restore();
        }

        // --- 3. Clear Water Body (Transparent, crystal water envelope) ---
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < NUM_NODES - 1; i++) {
          const n1 = nodes[i];
          const n2 = nodes[i + 1];
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.lineWidth = Math.max(n1.radius, n2.radius) * 1.7;
          ctx.lineCap = 'round';
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();

        // --- 4. Water Droplet Internal Caustic Glow ---
        ctx.save();
        const dropGrd = ctx.createRadialGradient(
          head.x - head.radius * 0.25,
          head.y - head.radius * 0.25,
          1,
          head.x,
          head.y,
          head.radius
        );
        dropGrd.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        dropGrd.addColorStop(0.3, 'rgba(235, 248, 255, 0.35)');
        dropGrd.addColorStop(0.7, 'rgba(215, 240, 255, 0.12)');
        dropGrd.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = dropGrd;
        ctx.beginPath();
        ctx.arc(head.x, head.y, head.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // --- 5. Primary Specular Sun Highlight (Sharp white pin-point glint) ---
        ctx.save();
        const glintX = head.x - head.radius * 0.32;
        const glintY = head.y - head.radius * 0.32;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(glintX, glintY, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Secondary subtle counter-reflection (ground bounce light on water)
        const bounceX = head.x + head.radius * 0.28;
        const bounceY = head.y + head.radius * 0.28;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.arc(bounceX, bounceY, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Water meniscus curved reflection on moving
        if (headSpeed > 0.4) {
          const angle = Math.atan2(head.vy, head.vx);
          ctx.beginPath();
          ctx.arc(head.x, head.y, head.radius * 0.88, angle + Math.PI * 0.6, angle + Math.PI * 1.4);
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 4;
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 select-none"
    />
  );
}
