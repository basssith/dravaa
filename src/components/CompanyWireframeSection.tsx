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

    // Full-screen matrix binary grid (EXACT match to landing page MatrixFluidCanvas)
    interface GridBinaryParticle {
      char: string;
      originX: number;
      originY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      speed: number;
      opacity: number;
      baseColor: string;
      isGreen: boolean;
      changeTimer: number;
    }

    let gridParticles: GridBinaryParticle[] = [];

    const initParticles = () => {
      gridParticles = [];
      const colSpacing = 36; // exact spacing as landing page
      const rowSpacing = 42;
      const cols = Math.ceil(width / colSpacing);
      const rows = Math.ceil(height / rowSpacing);

      for (let c = 0; c < cols; c++) {
        const x = c * colSpacing + (Math.random() - 0.5) * 8;
        for (let r = 0; r < rows; r++) {
          const y = r * rowSpacing + (Math.random() - 0.5) * 8;
          const char = Math.random() > 0.5 ? '1' : '0';

          // 25% neon green #b6ff66 and 75% crisp white/silver, exact match to landing page
          const isGreen = Math.random() < 0.25;
          const baseColor = isGreen ? 'rgba(182, 255, 102, ' : 'rgba(235, 240, 248, ';
          const baseOpacity = isGreen ? 0.75 + Math.random() * 0.25 : 0.45 + Math.random() * 0.45;

          gridParticles.push({
            char,
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            speed: 0.55 + Math.random() * 0.85,
            opacity: baseOpacity,
            baseColor,
            isGreen,
            changeTimer: Math.floor(Math.random() * 200),
          });
        }
      }
    };

    // 3D wireframe interior anchor vertices
    interface WireVertex {
      x: number;
      y: number;
      z: number;
      char: string;
      timer: number;
    }
    const wireVertices: WireVertex[] = [];
    wireframeLines.forEach((line) => {
      wireVertices.push({
        x: line.p1[0],
        y: line.p1[1],
        z: line.p1[2],
        char: Math.random() > 0.5 ? '1' : '0',
        timer: Math.floor(Math.random() * 100),
      });
      wireVertices.push({
        x: line.p2[0],
        y: line.p2[1],
        z: line.p2[2],
        char: Math.random() > 0.5 ? '1' : '0',
        timer: Math.floor(Math.random() * 100),
      });
    });

    let scrollProgress = 0;
    let targetProgress = 0;

    // Mouse & Fluid physics state
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
    let targetRotY = 0;
    let targetRotX = 0;
    let currRotY = 0;
    let currRotX = 0;

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

      // 3D camera parallax tilt
      const normX = currentX / width - 0.5;
      const normY = currentY / height - 0.5;
      targetRotY = normX * 0.45;
      targetRotX = -normY * 0.25;
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
      targetRotY = 0;
      targetRotX = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

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

      // Always render at the EXACT same 20px monospace font size as landing page
      ctx.font = '700 20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const radiusSq = mouse.radius * mouse.radius;

      // 1. Full-screen binary matrix (downward flow, identical size & colors to landing page)
      for (let i = 0; i < gridParticles.length; i++) {
        const p = gridParticles[i];

        // Random matrix digit flip
        p.changeTimer++;
        if (p.changeTimer > 180) {
          p.char = p.char === '1' ? '0' : '1';
          p.changeTimer = 0;
        }

        // Fluid downward matrix drift (strictly flowing down)
        p.originY += p.speed;
        if (p.originY > height + 25) {
          p.originY = -25;
          p.y = -25;
        }

        // Interaction with mouse (fluid push & swirl)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius);

            // Push away
            const pushX = (dx / dist) * force * 12;
            const pushY = (dy / dist) * force * 12;

            // Swirl
            const swirlX = -(dy / dist) * force * (mouse.vx * 0.5 + 2);
            const swirlY = (dx / dist) * force * (mouse.vy * 0.5 + 2);

            p.vx += pushX + swirlX * 0.3;
            p.vy += pushY + swirlY * 0.3;
          }
        }

        // Spring force returning particle smoothly to stream position
        const targetX = p.originX;
        const targetY = p.originY;
        const homeDx = targetX - p.x;
        const homeDy = targetY - p.y;

        p.vx += homeDx * 0.045;
        p.vy += homeDy * 0.045;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        // Dynamic opacity based on fluid velocity
        const vel = Math.hypot(p.vx, p.vy);
        const dynamicAlpha = Math.min(p.opacity + vel * 0.08, 0.95);

        ctx.fillStyle = `${p.baseColor}${dynamicAlpha})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      // 2. 3D Architectural wireframe lines emergence on scroll
      if (morphFactor > 0.08) {
        const wireAlpha = Math.min(0.65, (morphFactor - 0.08) * 1.6);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(182, 255, 102, ${wireAlpha * 0.55})`;

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

        // Key wireframe node accents (rendered in exact 20px size)
        wireVertices.forEach((wv) => {
          wv.timer++;
          if (wv.timer > 100) {
            wv.char = wv.char === '1' ? '0' : '1';
            wv.timer = 0;
          }
          const [px, py, dist, visible] = project(wv.x, wv.y, wv.z, cameraPitch, cameraYaw, cameraZ);
          if (visible && px >= -30 && px <= width + 30 && py >= -30 && py <= height + 30) {
            ctx.fillStyle = `rgba(182, 255, 102, ${wireAlpha * 0.95})`;
            ctx.fillText(wv.char, px, py);
          }
        });
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      pinTrigger.kill();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
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
            className="tag text-[#888c94] tracking-widest uppercase text-xs sm:text-sm font-mono border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md bg-black/50"
          >
            [01] What we do
          </p>
        </div>

        {/* 1. LEFT SIDE ABOVE: First Two Lines */}
        <div
          data-block="1"
          className="self-start max-w-[40ch] text-left pt-4 lg:pt-6 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold uppercase tracking-tight leading-[1.12] text-white">
            <span className="block">Connecting everything,</span>
            <span className="block text-[#c8ccd6]">designing for clarity,</span>
          </h2>
        </div>

        {/* 2. CENTER: Second Two Lines */}
        <div
          data-block="2"
          className="self-center max-w-[42ch] text-center my-auto py-6 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold uppercase tracking-tight leading-[1.12] text-white">
            <span className="block">bringing it all</span>
            <span className="block text-[#c8ccd6]">into one unified space.</span>
          </h2>
        </div>

        {/* 3. RIGHT SIDE DOWN: Third Two Lines (with Green Rectangle for DRAVA) */}
        <div
          data-block="3"
          className="self-end max-w-[42ch] text-right pb-4 lg:pb-6 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold uppercase tracking-tight leading-[1.12] text-white">
            <span className="block">
              The new era of{' '}
              <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-3 sm:px-4 py-0.5 rounded-[6px] tracking-normal align-middle whitespace-nowrap shadow-none leading-tight ml-1">
                DRAVA
              </span>
            </span>
            <span className="block text-[#c8ccd6] mt-1">— where work flows effortlessly.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
