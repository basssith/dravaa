'use client';

import { useEffect, useRef } from 'react';
import { WordScrub } from '@/components/type';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface Line3D {
  p1: [number, number, number];
  p2: [number, number, number];
}

function buildInteriorWireframe(): Line3D[] {
  const lines: Line3D[] = [];

  // 1. Room Boundary (Walls, Floor, Ceiling)
  // Floor perimeter
  lines.push({ p1: [-2.2, 0.9, -1.0], p2: [2.2, 0.9, -1.0] });
  lines.push({ p1: [2.2, 0.9, -1.0], p2: [2.5, 0.9, 3.0] });
  lines.push({ p1: [-2.2, 0.9, -1.0], p2: [-2.5, 0.9, 3.0] });

  // Ceiling perimeter
  lines.push({ p1: [-2.2, -1.1, -1.0], p2: [2.2, -1.1, -1.0] });
  lines.push({ p1: [2.2, -1.1, -1.0], p2: [2.5, -1.1, 3.0] });
  lines.push({ p1: [-2.2, -1.1, -1.0], p2: [-2.5, -1.1, 3.0] });

  // Vertical corner pillars
  lines.push({ p1: [-2.2, -1.1, -1.0], p2: [-2.2, 0.9, -1.0] });
  lines.push({ p1: [2.2, -1.1, -1.0], p2: [2.2, 0.9, -1.0] });
  lines.push({ p1: [-2.5, -1.1, 3.0], p2: [-2.5, 0.9, 3.0] });
  lines.push({ p1: [2.5, -1.1, 3.0], p2: [2.5, 0.9, 3.0] });

  // Wall window mullions (left wall)
  for (let z = -0.5; z <= 2.2; z += 0.9) {
    const x = -2.2 - (z + 1.0) * 0.08;
    lines.push({ p1: [x, -1.1, z], p2: [x, 0.9, z] });
    lines.push({ p1: [x, -0.1, z], p2: [x, -0.1, z + 0.9] });
  }

  // Right glass partition wall
  for (let z = -0.5; z <= 2.2; z += 0.9) {
    const x = 2.2 + (z + 1.0) * 0.08;
    lines.push({ p1: [x, -1.1, z], p2: [x, 0.9, z] });
    lines.push({ p1: [x, 0.0, z], p2: [x, 0.0, z + 0.9] });
  }

  // Ceiling grid acoustic baffles
  for (let z = -0.5; z <= 2.5; z += 0.75) {
    lines.push({ p1: [-2.0, -1.1, z], p2: [2.0, -1.1, z] });
  }
  lines.push({ p1: [-0.8, -1.1, -1.0], p2: [-0.8, -1.1, 2.8] });
  lines.push({ p1: [0.8, -1.1, -1.0], p2: [0.8, -1.1, 2.8] });

  // Suspended linear LED luminaire
  lines.push({ p1: [-1.0, -0.85, 0.2], p2: [1.0, -0.85, 0.2] });
  lines.push({ p1: [-1.0, -0.85, 1.4], p2: [1.0, -0.85, 1.4] });
  lines.push({ p1: [-1.0, -1.1, 0.2], p2: [-1.0, -0.85, 0.2] });
  lines.push({ p1: [1.0, -1.1, 0.2], p2: [1.0, -0.85, 0.2] });
  lines.push({ p1: [-1.0, -1.1, 1.4], p2: [-1.0, -0.85, 1.4] });
  lines.push({ p1: [1.0, -1.1, 1.4], p2: [1.0, -0.85, 1.4] });

  // 2. Large Central Executive Conference Table
  const tableTopY = 0.38;
  const tableZ1 = 0.1;
  const tableZ2 = 2.1;
  const tableW = 1.05;

  lines.push({ p1: [-tableW, tableTopY, tableZ1], p2: [tableW, tableTopY, tableZ1] });
  lines.push({ p1: [tableW, tableTopY, tableZ1], p2: [tableW, tableTopY, tableZ2] });
  lines.push({ p1: [tableW, tableTopY, tableZ2], p2: [-tableW, tableTopY, tableZ2] });
  lines.push({ p1: [-tableW, tableTopY, tableZ2], p2: [-tableW, tableTopY, tableZ1] });

  lines.push({ p1: [-tableW + 0.08, tableTopY, tableZ1 + 0.1], p2: [tableW - 0.08, tableTopY, tableZ1 + 0.1] });
  lines.push({ p1: [tableW - 0.08, tableTopY, tableZ1 + 0.1], p2: [tableW - 0.08, tableTopY, tableZ2 - 0.1] });
  lines.push({ p1: [tableW - 0.08, tableTopY, tableZ2 - 0.1], p2: [-tableW + 0.08, tableTopY, tableZ2 - 0.1] });
  lines.push({ p1: [-tableW + 0.08, tableTopY, tableZ2 - 0.1], p2: [-tableW + 0.08, tableTopY, tableZ1 + 0.1] });

  // Table Legs
  lines.push({ p1: [-tableW + 0.12, tableTopY, tableZ1 + 0.12], p2: [-tableW + 0.12, 0.9, tableZ1 + 0.12] });
  lines.push({ p1: [tableW - 0.12, tableTopY, tableZ1 + 0.12], p2: [tableW - 0.12, 0.9, tableZ1 + 0.12] });
  lines.push({ p1: [-tableW + 0.12, tableTopY, tableZ2 - 0.12], p2: [-tableW + 0.12, 0.9, tableZ2 - 0.12] });
  lines.push({ p1: [tableW - 0.12, tableTopY, tableZ2 - 0.12], p2: [tableW - 0.12, 0.9, tableZ2 - 0.12] });

  // 3. Ergonomic Office Chairs around the table
  const chairPositions: [number, number][] = [
    [-tableW - 0.35, 0.55],
    [-tableW - 0.35, 1.55],
    [tableW + 0.35, 0.55],
    [tableW + 0.35, 1.55],
  ];

  chairPositions.forEach(([cx, cz]) => {
    const seatY = 0.48;
    const backY = 0.15;
    const cw = 0.22;
    lines.push({ p1: [cx - cw, seatY, cz - cw], p2: [cx + cw, seatY, cz - cw] });
    lines.push({ p1: [cx + cw, seatY, cz - cw], p2: [cx + cw, seatY, cz + cw] });
    lines.push({ p1: [cx + cw, seatY, cz + cw], p2: [cx - cw, seatY, cz + cw] });
    lines.push({ p1: [cx - cw, seatY, cz + cw], p2: [cx - cw, seatY, cz - cw] });

    const bx = cx > 0 ? cx + cw : cx - cw;
    lines.push({ p1: [bx, seatY, cz - cw], p2: [bx, backY, cz - cw] });
    lines.push({ p1: [bx, backY, cz - cw], p2: [bx, backY, cz + cw] });
    lines.push({ p1: [bx, backY, cz + cw], p2: [bx, seatY, cz + cw] });

    lines.push({ p1: [cx, seatY, cz], p2: [cx, 0.88, cz] });
    lines.push({ p1: [cx - 0.2, 0.88, cz], p2: [cx + 0.2, 0.88, cz] });
    lines.push({ p1: [cx, 0.88, cz - 0.2], p2: [cx, 0.88, cz + 0.2] });
  });

  // 4. Back Wall Presentation Display
  const scrX1 = -1.3;
  const scrX2 = 1.3;
  const scrY1 = -0.7;
  const scrY2 = 0.05;
  const scrZ = -0.98;

  lines.push({ p1: [scrX1, scrY1, scrZ], p2: [scrX2, scrY1, scrZ] });
  lines.push({ p1: [scrX2, scrY1, scrZ], p2: [scrX2, scrY2, scrZ] });
  lines.push({ p1: [scrX2, scrY2, scrZ], p2: [scrX1, scrY2, scrZ] });
  lines.push({ p1: [scrX1, scrY2, scrZ], p2: [scrX1, scrY1, scrZ] });

  // Console underneath screen
  lines.push({ p1: [-1.5, 0.52, -0.85], p2: [1.5, 0.52, -0.85] });
  lines.push({ p1: [1.5, 0.52, -0.85], p2: [1.5, 0.88, -0.85] });
  lines.push({ p1: [1.5, 0.88, -0.85], p2: [-1.5, 0.88, -0.85] });
  lines.push({ p1: [-1.5, 0.88, -0.85], p2: [-1.5, 0.52, -0.85] });

  // Architectural Floor Tiles Grid
  for (let z = -0.5; z <= 2.8; z += 0.55) {
    lines.push({ p1: [-2.1, 0.9, z], p2: [2.1, 0.9, z] });
  }

  return lines;
}

export function CompanyWireframeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const wireframeLines = buildInteriorWireframe();

    interface WireframePoint {
      x3d: number;
      y3d: number;
      z3d: number;
      char: string;
      alpha: number;
      color: string;
      flipTimer: number;
    }

    const binaryPoints: WireframePoint[] = [];

    wireframeLines.forEach((line) => {
      const [x1, y1, z1] = line.p1;
      const [x2, y2, z2] = line.p2;
      const len = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
      const step = 0.12;
      const count = Math.max(1, Math.floor(len / step));

      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        const pz = z1 + (z2 - z1) * t;

        const isBright = Math.random() < 0.22;
        binaryPoints.push({
          x3d: px,
          y3d: py,
          z3d: pz,
          char: Math.random() > 0.5 ? '1' : '0',
          alpha: isBright ? 0.8 : 0.4 + Math.random() * 0.35,
          color: isBright ? '#b6ff66' : '#888888',
          flipTimer: Math.floor(Math.random() * 120),
        });
      }
    });

    interface FreeBinaryParticle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      char: string;
      opacity: number;
      color: string;
    }

    const freeParticles: FreeBinaryParticle[] = [];
    for (let i = 0; i < 180; i++) {
      freeParticles.push({
        x: (Math.random() - 0.5) * 4.5,
        y: (Math.random() - 0.5) * 2.2,
        z: -0.8 + Math.random() * 3.6,
        vx: (Math.random() - 0.5) * 0.002,
        vy: -0.001 - Math.random() * 0.003,
        vz: (Math.random() - 0.5) * 0.002,
        char: Math.random() > 0.5 ? '1' : '0',
        opacity: 0.2 + Math.random() * 0.5,
        color: Math.random() < 0.15 ? '#b6ff66' : '#777777',
      });
    }

    let scrollProgress = 0;
    let targetProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currRotY = 0;
    let currRotX = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.25;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Smooth ScrollTrigger tracking with soft damping
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    const project = (
      x: number,
      y: number,
      z: number,
      rotX: number,
      rotY: number,
      cameraZ: number
    ): [number, number, number, boolean] => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const dist = z2 + cameraZ;
      if (dist <= 0.2) return [0, 0, 0, false];

      const fov = Math.min(width, height) * 0.85;
      const projX = width / 2 + (x1 / dist) * fov;
      const projY = height / 2 + (y2 / dist) * fov;

      return [projX, projY, dist, true];
    };

    const render = () => {
      // Butter-smooth interpolation for scroll camera & mouse pan
      scrollProgress += (targetProgress - scrollProgress) * 0.08;
      currRotY += (targetRotY - currRotY) * 0.05;
      currRotX += (targetRotX - currRotX) * 0.05;

      const cameraZ = 2.8 - scrollProgress * 1.5;
      const cameraPitch = currRotX - scrollProgress * 0.12;
      const cameraYaw = currRotY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(70, 75, 85, 0.4)';

      wireframeLines.forEach((line) => {
        const [x1, y1, z1] = line.p1;
        const [x2, y2, z2] = line.p2;

        const [px1, py1, d1, v1] = project(x1, y1, z1, cameraPitch, cameraYaw, cameraZ);
        const [px2, py2, d2, v2] = project(x2, y2, z2, cameraPitch, cameraYaw, cameraZ);

        if (v1 && v2) {
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        }
      });

      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      binaryPoints.forEach((pt) => {
        pt.flipTimer++;
        if (pt.flipTimer > 90) {
          pt.char = pt.char === '1' ? '0' : '1';
          pt.flipTimer = 0;
        }

        const [px, py, dist, visible] = project(pt.x3d, pt.y3d, pt.z3d, cameraPitch, cameraYaw, cameraZ);
        if (visible && px >= -20 && px <= width + 20 && py >= -20 && py <= height + 20) {
          const depthAlpha = Math.max(0.1, Math.min(1, (3.8 - dist) / 2.8));
          ctx.fillStyle = pt.color === '#b6ff66'
            ? `rgba(182, 255, 102, ${pt.alpha * depthAlpha})`
            : `rgba(200, 205, 215, ${pt.alpha * depthAlpha * 0.75})`;
          ctx.fillText(pt.char, px, py);
        }
      });

      freeParticles.forEach((fp) => {
        fp.y += fp.vy;
        if (fp.y < -1.4) fp.y = 1.2;

        const [px, py, dist, visible] = project(fp.x, fp.y, fp.z, cameraPitch, cameraYaw, cameraZ);
        if (visible) {
          ctx.fillStyle = fp.color === '#b6ff66'
            ? `rgba(182, 255, 102, ${fp.opacity * 0.8})`
            : `rgba(140, 145, 155, ${fp.opacity * 0.4})`;
          ctx.fillText(fp.char, px, py);
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      st.kill();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="intro"
      className="relative z-10 min-h-screen w-full bg-[#000000] text-white flex flex-col justify-center items-center py-section overflow-hidden"
    >
      {/* 3D Wireframe Interior Binary Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* Precision architectural dark grid & cross dots overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.14] select-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      {/* Statement Content appearing while scrolling with WordScrub, highlighting ONLY *Drava */}
      <div className="wrap relative z-10 flex flex-col items-center text-center px-4 max-w-[950px] mx-auto pointer-events-auto">
        <p className="tag mb-5 text-[#888c94] tracking-widest uppercase text-xs sm:text-sm font-mono border border-white/10 px-3.5 py-1 rounded-full backdrop-blur-md bg-black/40">
          [01] What we do
        </p>
        <WordScrub
          className="font-display text-[clamp(1.75rem,1.2rem+2.8vw,3.8rem)] font-bold uppercase tracking-tight leading-[1.14] text-white max-w-[26ch] mx-auto text-center"
          text="Connecting everything, designing for clarity, bringing it all into one unified space. The new era of *Drava — where work flows effortlessly."
        />
      </div>
    </section>
  );
}
