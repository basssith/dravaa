'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface Line3D {
  p1: [number, number, number];
  p2: [number, number, number];
}

function buildInteriorWireframe(): Line3D[] {
  const lines: Line3D[] = [];

  // Floor & Ceiling perimeter
  lines.push({ p1: [-2.2, 0.9, -1.0], p2: [2.2, 0.9, -1.0] });
  lines.push({ p1: [2.2, 0.9, -1.0], p2: [2.5, 0.9, 3.0] });
  lines.push({ p1: [-2.2, 0.9, -1.0], p2: [-2.5, 0.9, 3.0] });

  lines.push({ p1: [-2.2, -1.1, -1.0], p2: [2.2, -1.1, -1.0] });
  lines.push({ p1: [2.2, -1.1, -1.0], p2: [2.5, -1.1, 3.0] });
  lines.push({ p1: [-2.2, -1.1, -1.0], p2: [-2.5, -1.1, 3.0] });

  // Columns
  lines.push({ p1: [-2.2, -1.1, -1.0], p2: [-2.2, 0.9, -1.0] });
  lines.push({ p1: [2.2, -1.1, -1.0], p2: [2.2, 0.9, -1.0] });
  lines.push({ p1: [-2.5, -1.1, 3.0], p2: [-2.5, 0.9, 3.0] });
  lines.push({ p1: [2.5, -1.1, 3.0], p2: [2.5, 0.9, 3.0] });

  // Windows & Partitions
  for (let z = -0.5; z <= 2.2; z += 0.9) {
    const x = -2.2 - (z + 1.0) * 0.08;
    lines.push({ p1: [x, -1.1, z], p2: [x, 0.9, z] });
    lines.push({ p1: [x, -0.1, z], p2: [x, -0.1, z + 0.9] });
  }

  for (let z = -0.5; z <= 2.2; z += 0.9) {
    const x = 2.2 + (z + 1.0) * 0.08;
    lines.push({ p1: [x, -1.1, z], p2: [x, 0.9, z] });
    lines.push({ p1: [x, 0.0, z], p2: [x, 0.0, z + 0.9] });
  }

  // Ceiling baffles & Luminaires
  for (let z = -0.5; z <= 2.5; z += 0.75) {
    lines.push({ p1: [-2.0, -1.1, z], p2: [2.0, -1.1, z] });
  }
  lines.push({ p1: [-0.8, -1.1, -1.0], p2: [-0.8, -1.1, 2.8] });
  lines.push({ p1: [0.8, -1.1, -1.0], p2: [0.8, -1.1, 2.8] });

  lines.push({ p1: [-1.0, -0.85, 0.2], p2: [1.0, -0.85, 0.2] });
  lines.push({ p1: [-1.0, -0.85, 1.4], p2: [1.0, -0.85, 1.4] });
  lines.push({ p1: [-1.0, -1.1, 0.2], p2: [-1.0, -0.85, 0.2] });
  lines.push({ p1: [1.0, -1.1, 0.2], p2: [1.0, -0.85, 0.2] });
  lines.push({ p1: [-1.0, -1.1, 1.4], p2: [-1.0, -0.85, 1.4] });
  lines.push({ p1: [1.0, -1.1, 1.4], p2: [1.0, -0.85, 1.4] });

  // Boardroom Table
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

  // Chairs
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

  // Screen & Console
  const scrX1 = -1.3;
  const scrX2 = 1.3;
  const scrY1 = -0.7;
  const scrY2 = 0.05;
  const scrZ = -0.98;

  lines.push({ p1: [scrX1, scrY1, scrZ], p2: [scrX2, scrY1, scrZ] });
  lines.push({ p1: [scrX2, scrY1, scrZ], p2: [scrX2, scrY2, scrZ] });
  lines.push({ p1: [scrX2, scrY2, scrZ], p2: [scrX1, scrY2, scrZ] });
  lines.push({ p1: [scrX1, scrY2, scrZ], p2: [scrX1, scrY1, scrZ] });

  lines.push({ p1: [-1.5, 0.52, -0.85], p2: [1.5, 0.52, -0.85] });
  lines.push({ p1: [1.5, 0.52, -0.85], p2: [1.5, 0.88, -0.85] });
  lines.push({ p1: [1.5, 0.88, -0.85], p2: [-1.5, 0.88, -0.85] });
  lines.push({ p1: [-1.5, 0.88, -0.85], p2: [-1.5, 0.52, -0.85] });

  return lines;
}

export function CompanyWireframeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const textWrapper = textWrapperRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const wireframeLines = buildInteriorWireframe();

    interface MorphBinaryParticle {
      char: string;
      streamX: number;
      streamY: number;
      speedY: number;
      tx3d: number;
      ty3d: number;
      tz3d: number;
      isBright: boolean;
      flipTimer: number;
    }

    const particles: MorphBinaryParticle[] = [];

    wireframeLines.forEach((line) => {
      const [x1, y1, z1] = line.p1;
      const [x2, y2, z2] = line.p2;
      const len = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
      const step = 0.22;
      const count = Math.max(1, Math.floor(len / step));

      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        const pz = z1 + (z2 - z1) * t;

        particles.push({
          char: Math.random() > 0.5 ? '1' : '0',
          streamX: (Math.random() - 0.5) * 4.2,
          streamY: (Math.random() - 0.5) * 3.5,
          speedY: 0.003 + Math.random() * 0.006,
          tx3d: px,
          ty3d: py,
          tz3d: pz,
          isBright: Math.random() < 0.22,
          flipTimer: Math.floor(Math.random() * 120),
        });
      }
    });

    // Screen-filling matrix binary field + wireframe morph particles
    const freeParticles: Array<{
      x: number;
      y: number;
      z: number;
      vy: number;
      char: string;
      isGreen: boolean;
      opacity: number;
    }> = [];

    for (let i = 0; i < 450; i++) {
      freeParticles.push({
        x: (Math.random() - 0.5) * 8.5,
        y: (Math.random() - 0.5) * 5.5,
        z: -1.2 + Math.random() * 4.8,
        vy: -0.003 - Math.random() * 0.005,
        char: Math.random() > 0.5 ? '1' : '0',
        isGreen: Math.random() < 0.25,
        opacity: 0.35 + Math.random() * 0.55,
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

    // PINNED SCROLL TIMELINE:
    // 0 -> 35%: Wireframe assemble & exploration
    // 35% -> 55%: Left-side top block appears
    // 55% -> 75%: Center block appears
    // 75% -> 100%: Right-side bottom block appears (with DRAVA)
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=280%',
      pin: true,
      scrub: 1.2,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    if (textWrapper) {
      const tag = textWrapper.querySelector<HTMLElement>('[data-tag]');
      const block1 = textWrapper.querySelector<HTMLElement>('[data-block="1"]');
      const block2 = textWrapper.querySelector<HTMLElement>('[data-block="2"]');
      const block3 = textWrapper.querySelector<HTMLElement>('[data-block="3"]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=280%',
          scrub: 1.2,
        },
      });

      // Initially all content is hidden while exploring the pure binary wireframe
      tl.set([tag, block1, block2, block3], { opacity: 0, y: 30 });

      // Step 1: Tag appears
      tl.to(tag, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.25);

      // Step 2: Left-side top 2 lines appear
      tl.to(block1, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.38);

      // Step 3: Center 2 lines appear
      tl.to(block2, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.58);

      // Step 4: Right-side bottom 2 lines appear (with green DRAVA box)
      tl.to(block3, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.78);
    }

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
      scrollProgress += (targetProgress - scrollProgress) * 0.08;
      currRotY += (targetRotY - currRotY) * 0.05;
      currRotX += (targetRotX - currRotX) * 0.05;

      const morphFactor = Math.min(1, Math.max(0, scrollProgress * 3.0));

      const cameraZ = 2.8 - scrollProgress * 1.5;
      const cameraPitch = currRotX - scrollProgress * 0.12;
      const cameraYaw = currRotY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      if (morphFactor > 0.45) {
        const wireAlpha = Math.min(0.4, (morphFactor - 0.45) * 1.2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(70, 75, 85, ${wireAlpha})`;

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
      }

      ctx.font = '700 18px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Wireframe binary points matching exact landing page size (20px font), color and prominence
      particles.forEach((pt) => {
        pt.flipTimer++;
        if (pt.flipTimer > 90) {
          pt.char = pt.char === '1' ? '0' : '1';
          pt.flipTimer = 0;
        }

        pt.streamY += pt.speedY;
        if (pt.streamY > 2.2) pt.streamY = -2.2;

        const curX = pt.streamX * (1 - morphFactor) + pt.tx3d * morphFactor;
        const curY = pt.streamY * (1 - morphFactor) + pt.ty3d * morphFactor;
        const curZ = (1 - morphFactor) * 0.5 + pt.tz3d * morphFactor;

        const [px, py, dist, visible] = project(curX, curY, curZ, cameraPitch, cameraYaw, cameraZ);
        if (visible && px >= -30 && px <= width + 30 && py >= -30 && py <= height + 30) {
          const fontSize = Math.max(18, Math.min(26, Math.round(20 * (2.8 / dist))));
          ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          ctx.fillStyle = pt.isBright
            ? 'rgba(182, 255, 102, 0.95)'
            : 'rgba(235, 240, 248, 0.92)';
          ctx.fillText(pt.char, px, py);
        }
      });

      // Full-screen ambient binary numbers with exact landing page size (20px) and colors
      freeParticles.forEach((fp) => {
        fp.y += fp.vy;
        if (fp.y < -2.6) fp.y = 2.6;

        const [px, py, dist, visible] = project(fp.x, fp.y, fp.z, cameraPitch, cameraYaw, cameraZ);
        if (visible && px >= -30 && px <= width + 30 && py >= -30 && py <= height + 30) {
          const fontSize = Math.max(18, Math.min(26, Math.round(20 * (2.8 / dist))));
          ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          ctx.fillStyle = fp.isGreen
            ? 'rgba(182, 255, 102, 0.92)'
            : 'rgba(235, 240, 248, 0.90)';
          ctx.fillText(fp.char, px, py);
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      pinTrigger.kill();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="intro"
      className="relative z-10 min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between py-12 lg:py-16 overflow-hidden"
    >
      {/* 3D Wireframe Interior Binary Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* Content wrapper with stepped diagonal layout: Left top -> Center -> Right bottom */}
      <div
        ref={textWrapperRef}
        className="wrap relative z-10 flex flex-col justify-between min-h-[82vh] w-full px-gutter pointer-events-auto"
      >
        {/* Top bar with Tag */}
        <div className="flex items-center justify-between w-full pt-4">
          <p
            data-tag
            className="tag text-[#888c94] tracking-widest text-xs sm:text-sm font-mono border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md bg-black/50"
          >
            [01] What we do
          </p>
        </div>

        {/* 1. LEFT SIDE ABOVE: First Two Lines */}
        <div
          data-block="1"
          className="self-start max-w-[40ch] text-left pt-4 lg:pt-6 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold tracking-tight leading-[1.12] text-white">
            <span className="block">Connecting everything,</span>
            <span className="block text-[#c8ccd6]">designing for clarity,</span>
          </h2>
        </div>

        {/* 2. CENTER: Second Two Lines */}
        <div
          data-block="2"
          className="self-center max-w-[42ch] text-center my-auto py-6 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold tracking-tight leading-[1.12] text-white">
            <span className="block">Bringing it all</span>
            <span className="block text-[#c8ccd6]">into one unified space.</span>
          </h2>
        </div>

        {/* 3. RIGHT SIDE DOWN: Third Two Lines (with Green Rectangle for Drava) */}
        <div
          data-block="3"
          className="self-end max-w-[42ch] text-right pb-4 lg:pb-6 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold tracking-tight leading-[1.12] text-white">
            <span className="block">
              The new era of{' '}
              <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-3 sm:px-4 py-0.5 rounded-[6px] tracking-normal align-middle whitespace-nowrap shadow-none leading-tight ml-1">
                Drava
              </span>
            </span>
            <span className="block text-[#c8ccd6] mt-1">— where work flows effortlessly.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
