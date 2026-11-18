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

  // Ceiling baffles & Luminaires: perfectly connected to ceiling corner longitudinal rails (x = -2.2 and 2.2)
  for (let z = -0.5; z <= 2.5; z += 0.75) {
    const leftX = -2.2 - (z + 1.0) * 0.075;
    const rightX = 2.2 + (z + 1.0) * 0.075;
    lines.push({ p1: [leftX, -1.1, z], p2: [rightX, -1.1, z] });
  }

  // Ceiling longitudinal inner lighting rails
  lines.push({ p1: [-0.9, -1.1, -1.0], p2: [-0.9, -1.1, 2.8] });
  lines.push({ p1: [0.9, -1.1, -1.0], p2: [0.9, -1.1, 2.8] });

  // Suspended linear light fixture (pendant frame connected cleanly to ceiling)
  lines.push({ p1: [-0.9, -0.85, 0.2], p2: [0.9, -0.85, 0.2] });
  lines.push({ p1: [-0.9, -0.85, 1.6], p2: [0.9, -0.85, 1.6] });
  lines.push({ p1: [-0.9, -0.85, 0.2], p2: [-0.9, -0.85, 1.6] });
  lines.push({ p1: [0.9, -0.85, 0.2], p2: [0.9, -0.85, 1.6] });

  // Vertical suspension rods from ceiling (-1.1) to pendant light (-0.85)
  lines.push({ p1: [-0.9, -1.1, 0.2], p2: [-0.9, -0.85, 0.2] });
  lines.push({ p1: [0.9, -1.1, 0.2], p2: [0.9, -0.85, 0.2] });
  lines.push({ p1: [-0.9, -1.1, 1.6], p2: [-0.9, -0.85, 1.6] });
  lines.push({ p1: [0.9, -1.1, 1.6], p2: [0.9, -0.85, 1.6] });

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

    const rawCandidatePoints: [number, number, number][] = [];

    // Step 1: Sample points along wireframe lines with consistent rhythmic step
    wireframeLines.forEach((line) => {
      const [x1, y1, z1] = line.p1;
      const [x2, y2, z2] = line.p2;
      const len = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
      const step = 0.55;
      const count = Math.max(1, Math.round(len / step));

      for (let i = 0; i <= count; i++) {
        const t = i / count;
        rawCandidatePoints.push([
          x1 + (x2 - x1) * t,
          y1 + (y2 - y1) * t,
          z1 + (z2 - z1) * t,
        ]);
      }
    });

    // Step 2: Strict spatial distance filter to eliminate duplicates, overlapping vertices, and clusters
    const MIN_NODE_DISTANCE = 0.48;
    const uniqueWireframeNodes: [number, number, number][] = [];

    for (const pt of rawCandidatePoints) {
      const [x, y, z] = pt;
      const isTooClose = uniqueWireframeNodes.some(([vx, vy, vz]) => {
        const dx = x - vx;
        const dy = y - vy;
        const dz = z - vz;
        return dx * dx + dy * dy + dz * dz < MIN_NODE_DISTANCE * MIN_NODE_DISTANCE;
      });

      if (!isTooClose) {
        uniqueWireframeNodes.push(pt);
      }
    }

    const particles: MorphBinaryParticle[] = uniqueWireframeNodes.map((node3d, idx) => ({
      char: idx % 2 === 0 ? '1' : '0',
      // Distributed across the entire full page width and height during the initial stream:
      streamX: (Math.random() - 0.5) * 11.0,
      streamY: (Math.random() - 0.5) * 7.5,
      speedY: 0.003 + Math.random() * 0.006,
      tx3d: node3d[0],
      ty3d: node3d[1],
      tz3d: node3d[2],
      isBright: idx % 4 === 0, // Clean, balanced green accent rhythm
      flipTimer: Math.floor(Math.random() * 120),
    }));

    // Ambient floating particles distributed across full page width and height
    const freeParticles: Array<{
      x: number;
      y: number;
      z: number;
      vy: number;
      char: string;
      isGreen: boolean;
      opacity: number;
    }> = [];

    for (let i = 0; i < 220; i++) {
      freeParticles.push({
        x: (Math.random() - 0.5) * 12.0,
        y: (Math.random() - 0.5) * 8.0,
        z: -1.5 + Math.random() * 5.0,
        vy: -0.0015 - Math.random() * 0.003,
        char: Math.random() > 0.5 ? '1' : '0',
        isGreen: Math.random() < 0.22,
        opacity: 0.3 + Math.random() * 0.45,
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
    // 0 -> 28%: Wireframe assemble & exploration
    // 28% -> 44%: Left-side top block appears
    // 44% -> 60%: Center block appears
    // 60% -> 76%: Right-side bottom block appears (with DRAVA)
    // 76% -> 100%: Camera zooms deeply into the room portal / black screen, and smoothly brings the next section into view
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=240%',
      pin: true,
      scrub: 1.0,
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
          end: '+=240%',
          scrub: 1.0,
        },
      });

      // Initially all content is hidden while exploring the pure binary wireframe
      tl.set([tag, block1, block2, block3], { opacity: 0, y: 30 });

      // Step 1: Tag appears
      tl.to(tag, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.20);

      // Step 2: Left-side top 2 lines appear
      tl.to(block1, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.30);

      // Step 3: Center 2 lines appear
      tl.to(block2, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.45);

      // Step 4: Right-side bottom 2 lines appear (with green DRAVA box)
      tl.to(block3, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.60);

      // Step 5: As camera plunges into the black screen (0.75 -> 0.95), fade out all 02 text blocks cleanly
      tl.to([tag, block1, block2, block3], { opacity: 0, y: -40, duration: 0.8, ease: 'power2.in' }, 0.75);
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

      // Morph factor: completes earlier so room wireframe is fully visible while text reads
      const morphFactor = Math.min(1, Math.max(0, scrollProgress * 3.5));

      // Dive animation into the black screen (0.72 -> 0.95)
      // Camera plunges deeply through the room portal into the black screen, accelerating forward
      let cameraZ = 2.8 - Math.min(0.72, scrollProgress) * 1.5;
      let cameraPitch = currRotX - Math.min(0.72, scrollProgress) * 0.12;
      let diveFade = 1;

      if (scrollProgress > 0.72) {
        const diveProgress = Math.min(1, (scrollProgress - 0.72) / 0.23); // 0 -> 1
        // Rapid exponential zoom forward into the black screen
        cameraZ -= diveProgress * diveProgress * 4.8;
        // Fade lines out as camera goes beyond the front portal into darkness
        diveFade = Math.max(0, 1 - diveProgress * 1.8);
      }

      const cameraYaw = currRotY * diveFade;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      if (morphFactor > 0.35 && diveFade > 0.01) {
        // Brighter wireframe lines with crisp, vivid contrast
        const wireAlpha = Math.min(0.88, (morphFactor - 0.35) * 1.6) * diveFade;
        ctx.lineWidth = 1.15;
        ctx.strokeStyle = `rgba(220, 238, 255, ${wireAlpha})`;

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

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Wireframe binary points:
      // While in the free stream / transition (morphFactor < 0.65), maintain the exact same size as the landing page (~20px-24px).
      // Only once the room wireframe forms and locks into place (morphFactor > 0.65 -> 1.0) do they transition down to small size (~9.5px).
      const roomLockFactor = Math.min(1, Math.max(0, (morphFactor - 0.65) / 0.35));

      particles.forEach((pt) => {
        if (morphFactor < 0.95) {
          pt.flipTimer++;
          if (pt.flipTimer > 140) {
            pt.char = pt.char === '1' ? '0' : '1';
            pt.flipTimer = 0;
          }
        }

        pt.streamY += pt.speedY;
        if (pt.streamY > 3.8) pt.streamY = -3.8;

        const curX = pt.streamX * (1 - morphFactor) + pt.tx3d * morphFactor;
        const curY = pt.streamY * (1 - morphFactor) + pt.ty3d * morphFactor;
        const curZ = (1 - morphFactor) * 0.5 + pt.tz3d * morphFactor;

        const [px, py, dist, visible] = project(curX, curY, curZ, cameraPitch, cameraYaw, cameraZ);
        if (visible && px >= -80 && px <= width + 80 && py >= -80 && py <= height + 80) {
          // In the beginning stream, size is kept normal (~18px-20px),
          // then smoothly settles into the comfortable readable size (~12px) after the room wireframe forms.
          const baseSize = 19 * (1 - roomLockFactor) + 12 * roomLockFactor;
          const minSize = Math.round(15 * (1 - roomLockFactor) + 10 * roomLockFactor);
          const maxSize = Math.round(22 * (1 - roomLockFactor) + 13 * roomLockFactor);
          const fontSize = Math.max(minSize, Math.min(maxSize, Math.round(baseSize * (2.6 / dist))));
          
          ctx.font = `400 ${fontSize}px var(--font-inter), system-ui, -apple-system, sans-serif`;
          
          // Clean node knockout: prevent wireframe lines from slicing through character glyphs
          if (roomLockFactor > 0.3) {
            ctx.fillStyle = `rgba(0, 0, 0, ${0.9 * roomLockFactor})`;
            ctx.beginPath();
            ctx.arc(px, py, fontSize * 0.55, 0, Math.PI * 2);
            ctx.fill();
          }

          // Full solid brightness for binary numbers on the wireframe
          const depthAlpha = Math.max(0.68, Math.min(1.0, 2.8 / dist)) * diveFade;
          ctx.fillStyle = pt.isBright
            ? `rgba(182, 255, 102, ${Math.min(1, 0.98 * depthAlpha)})`
            : `rgba(150, 155, 165, ${Math.min(1, 0.92 * depthAlpha)})`;
          ctx.fillText(pt.char, px, py);
        }
      });

      // Full-screen ambient binary numbers: Normal font weight and comfortable scale across full viewport
      if (morphFactor < 0.8) {
        const ambientAlpha = Math.max(0, 1 - morphFactor / 0.8);
        freeParticles.forEach((fp) => {
          fp.y += fp.vy;
          if (fp.y < -4.0) fp.y = 4.0;

          const [px, py, dist, visible] = project(fp.x, fp.y, fp.z, cameraPitch, cameraYaw, cameraZ);
          if (visible && px >= -80 && px <= width + 80 && py >= -80 && py <= height + 80) {
            const fontSize = Math.max(15, Math.min(22, Math.round(18 * (2.6 / dist))));
            ctx.font = `400 ${fontSize}px var(--font-inter), system-ui, -apple-system, sans-serif`;
            ctx.fillStyle = fp.isGreen
              ? `rgba(182, 255, 102, ${0.80 * ambientAlpha})`
              : `rgba(150, 155, 165, ${0.72 * ambientAlpha})`;
            ctx.fillText(fp.char, px, py);
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
        {/* Seamless blend gradient from Section 1 */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-transparent to-[#000000] pointer-events-none" />
      </div>

      {/* Content wrapper with stepped diagonal layout: Left top -> Center -> Right bottom */}
      <div
        ref={textWrapperRef}
        className="wrap relative z-10 flex flex-col justify-between min-h-[82vh] w-full px-gutter pointer-events-auto"
      >
        {/* Top bar with Tag: Green box for 02, no brackets, uppercase WHAT WE DO */}
        <div className="flex items-center justify-between w-full pt-4">
          <div data-tag className="inline-flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
              02
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
              WHAT WE DO
            </span>
          </div>
        </div>

        {/* 1. LEFT SIDE ABOVE: First Two Lines */}
        <div
          data-block="1"
          className="self-start max-w-[34ch] text-left pt-2 lg:pt-4 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.25rem,0.95rem+1.1vw,2.15rem)] font-bold tracking-tight leading-[1.2] text-white">
            <span className="block text-white">Connecting everything,</span>
            <span className="block text-white">designing for clarity,</span>
          </h2>
        </div>

        {/* 2. CENTER: Second Two Lines */}
        <div
          data-block="2"
          className="self-center max-w-[36ch] text-center my-auto py-4 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.25rem,0.95rem+1.1vw,2.15rem)] font-bold tracking-tight leading-[1.2] text-white">
            <span className="block text-white">Bringing it all</span>
            <span className="block text-white">into one unified space.</span>
          </h2>
        </div>

        {/* 3. RIGHT SIDE DOWN: Third Two Lines (with Green Rectangle for Drava) */}
        <div
          data-block="3"
          className="self-end max-w-[36ch] text-right pb-4 lg:pb-6 will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.25rem,0.95rem+1.1vw,2.15rem)] font-bold tracking-tight leading-[1.2] text-white">
            <span className="block text-white">
              The new era of{' '}
              <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-2.5 sm:px-3 py-0.5 rounded-[5px] tracking-normal align-middle whitespace-nowrap shadow-none leading-tight ml-1 text-[0.88em]">
                Drava
              </span>
            </span>
            <span className="block text-white mt-1">— where work flows effortlessly.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
