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
    lines.push({ p1: [cx - 0.16, 0.88, cz], p2: [cx + 0.16, 0.88, cz] });
    lines.push({ p1: [cx, 0.88, cz - 0.16], p2: [cx, 0.88, cz + 0.16] });
  });

  // Whiteboard / Display Screen on back wall
  const wbX1 = -1.1;
  const wbX2 = 1.1;
  const wbY1 = -0.55;
  const wbY2 = 0.25;
  const wbZ = -0.96;
  lines.push({ p1: [wbX1, wbY1, wbZ], p2: [wbX2, wbY1, wbZ] });
  lines.push({ p1: [wbX2, wbY1, wbZ], p2: [wbX2, wbY2, wbZ] });
  lines.push({ p1: [wbX2, wbY2, wbZ], p2: [wbX1, wbY2, wbZ] });
  lines.push({ p1: [wbX1, wbY2, wbZ], p2: [wbX1, wbY1, wbZ] });

  // Screen graph
  lines.push({ p1: [-0.9, 0.15, wbZ], p2: [-0.5, 0.15, wbZ] });
  lines.push({ p1: [-0.5, 0.15, wbZ], p2: [-0.1, -0.15, wbZ] });
  lines.push({ p1: [-0.1, -0.15, wbZ], p2: [0.5, -0.15, wbZ] });
  lines.push({ p1: [0.5, -0.15, wbZ], p2: [0.9, 0.05, wbZ] });

  // Server rack / Credenza
  const srX1 = -2.35;
  const srX2 = -2.1;
  const srY1 = 0.2;
  const srY2 = 0.88;
  const srZ1 = -0.5;
  const srZ2 = 1.6;
  lines.push({ p1: [srX1, srY1, srZ1], p2: [srX2, srY1, srZ1] });
  lines.push({ p1: [srX2, srY1, srZ1], p2: [srX2, srY1, srZ2] });
  lines.push({ p1: [srX2, srY1, srZ2], p2: [srX1, srY1, srZ2] });
  lines.push({ p1: [srX1, srY1, srZ2], p2: [srX1, srY1, srZ1] });
  lines.push({ p1: [srX2, srY2, srZ1], p2: [srX2, srY2, srZ2] });
  lines.push({ p1: [srX2, srY1, 0.2], p2: [srX2, srY2, 0.2] });
  lines.push({ p1: [srX2, srY1, 0.9], p2: [srX2, srY2, 0.9] });

  return lines;
}

/**
 * UnifiedHeroWireframeSection:
 * Unites Section 1 (Hero: "The Drava", "01 INTRO") and Section 2 (Intro: "WHAT WE DO")
 * onto ONE continuous, living 3D Canvas.
 *
 * - Initial state (scrollProgress = 0):
 *   You are looking at the ambient flowing Matrix binary stream in 3D with interactive mouse parallax & physics.
 *   Section 1 text ("01 INTRO" and "The Drava") sits at the bottom left.
 *
 * - As you scroll (0 -> 25%):
 *   Section 1 text seamlessly fades up and out.
 *   The camera moves forward INTO the exact same binary particles.
 *
 * - Mid scroll (25% -> 50%):
 *   The binary digits converge into the 3D room wireframe lines.
 *   "02 WHAT WE DO" tag reveals at top.
 *
 * - Late scroll (50% -> 100%):
 *   The 3 diagonal statements smoothly illuminate across the 3D space.
 *   Then releases smoothly into Section 3 (Products).
 */
export function CompanyWireframeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const heroText = heroTextRef.current;
    const introText = introTextRef.current;
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
      streamZ: number;
      speedY: number;
      tx3d: number;
      ty3d: number;
      tz3d: number;
      isBright: boolean;
      flipTimer: number;
      // Fluid interactive physics
      vx: number;
      vy: number;
    }

    const particles: MorphBinaryParticle[] = [];

    // Distribute wireframe target points
    wireframeLines.forEach((line) => {
      const [x1, y1, z1] = line.p1;
      const [x2, y2, z2] = line.p2;
      const len = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
      const step = 0.85;
      const count = Math.max(1, Math.round(len / step));

      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        const pz = z1 + (z2 - z1) * t;

        particles.push({
          char: Math.random() > 0.5 ? '1' : '0',
          streamX: (Math.random() - 0.5) * 6.5,
          streamY: (Math.random() - 0.5) * 5.0,
          streamZ: -0.5 + Math.random() * 3.5,
          speedY: 0.003 + Math.random() * 0.006,
          tx3d: px,
          ty3d: py,
          tz3d: pz,
          isBright: Math.random() < 0.25,
          flipTimer: Math.floor(Math.random() * 120),
          vx: 0,
          vy: 0,
        });
      }
    });

    // Ambient floating stream particles (creates the continuous Matrix field in the hero)
    const freeParticles: Array<{
      x: number;
      y: number;
      z: number;
      vy: number;
      char: string;
      isGreen: boolean;
      opacity: number;
      vx: number;
    }> = [];

    for (let i = 0; i < 90; i++) {
      freeParticles.push({
        x: (Math.random() - 0.5) * 8.5,
        y: (Math.random() - 0.5) * 6.0,
        z: -1.0 + Math.random() * 4.5,
        vy: -0.002 - Math.random() * 0.004,
        char: Math.random() > 0.5 ? '1' : '0',
        isGreen: Math.random() < 0.28,
        opacity: 0.35 + Math.random() * 0.5,
        vx: 0,
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
      targetRotY = mouseX * 0.35;
      targetRotX = -mouseY * 0.2;
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

    // MASTER PINNED SCROLL TRIGGER:
    // Spans 350vh:
    // 0 -> 20%: Hero Viewport (Hero text fades out, camera starts forward motion)
    // 20% -> 50%: Binary particles morph into the 3D room wireframe
    // 50% -> 100%: Section 2 Text ("WHAT WE DO" + 3 statements) reveal sequentially
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=380%',
      pin: true,
      scrub: 1.2,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=380%',
        scrub: 1.2,
      },
    });

    // 1. Hero text fades up and out smoothly in first 20% of scroll
    if (heroText) {
      masterTl.to(
        heroText,
        {
          opacity: 0,
          y: -80,
          scale: 0.95,
          duration: 0.22,
          ease: 'power2.inOut',
          pointerEvents: 'none',
        },
        0
      );
    }

    // 2. Section 2 elements reveal in sequence
    if (introText) {
      const tag = introText.querySelector<HTMLElement>('[data-tag]');
      const block1 = introText.querySelector<HTMLElement>('[data-block="1"]');
      const block2 = introText.querySelector<HTMLElement>('[data-block="2"]');
      const block3 = introText.querySelector<HTMLElement>('[data-block="3"]');

      masterTl.set([tag, block1, block2, block3], { opacity: 0, y: 30 });

      // Tag reveals around 32%
      masterTl.to(tag, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.28);
      // Left top 2 lines around 44%
      masterTl.to(block1, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.42);
      // Center lines around 62%
      masterTl.to(block2, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.60);
      // Right bottom lines around 80%
      masterTl.to(block3, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.78);
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

      // Morph factor: stays pure flowing matrix stream during hero (0 -> 0.15),
      // then progressively assembles into room wireframe (0.15 -> 0.65)
      const morphProgress = Math.max(0, (scrollProgress - 0.12) / 0.55);
      const morphFactor = Math.min(1, Math.max(0, morphProgress));

      // Camera smoothly dollys from initial hero distance (3.4) forward into room (1.3)
      const cameraZ = 3.4 - scrollProgress * 2.0;
      const cameraPitch = currRotX - scrollProgress * 0.12;
      const cameraYaw = currRotY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Draw wireframe structure lines once morphed enough
      if (morphFactor > 0.45) {
        const wireAlpha = Math.min(0.28, (morphFactor - 0.45) * 0.9);
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = `rgba(160, 180, 200, ${wireAlpha})`;

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

      const roomLockFactor = Math.min(1, Math.max(0, (morphFactor - 0.65) / 0.35));

      // 1. Draw Morphing Particles (They are the matrix stream at start, and the room at the end!)
      particles.forEach((pt) => {
        if (morphFactor < 0.95) {
          pt.flipTimer++;
          if (pt.flipTimer > 140) {
            pt.char = pt.char === '1' ? '0' : '1';
            pt.flipTimer = 0;
          }
        }

        pt.streamY += pt.speedY;
        if (pt.streamY > 2.5) pt.streamY = -2.5;

        const curX = pt.streamX * (1 - morphFactor) + pt.tx3d * morphFactor;
        const curY = pt.streamY * (1 - morphFactor) + pt.ty3d * morphFactor;
        const curZ = pt.streamZ * (1 - morphFactor) + pt.tz3d * morphFactor;

        const [px, py, dist, visible] = project(curX, curY, curZ, cameraPitch, cameraYaw, cameraZ);
        if (visible && px >= -40 && px <= width + 40 && py >= -40 && py <= height + 40) {
          const baseSize = 27 * (1 - roomLockFactor) + 12.5 * roomLockFactor;
          const minSize = Math.round(22 * (1 - roomLockFactor) + 10 * roomLockFactor);
          const maxSize = Math.round(32 * (1 - roomLockFactor) + 14 * roomLockFactor);
          const fontSize = Math.max(minSize, Math.min(maxSize, Math.round(baseSize * (2.6 / dist))));

          ctx.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

          const depthAlpha = Math.max(0.35, Math.min(0.95, 2.4 / dist));
          ctx.fillStyle = pt.isBright
            ? `rgba(182, 255, 102, ${0.95 * depthAlpha})`
            : `rgba(225, 235, 245, ${0.75 * depthAlpha})`;
          ctx.fillText(pt.char, px, py);
        }
      });

      // 2. Ambient matrix stream particles:
      // Abundant and alive during Hero and transition (morphFactor < 0.85)
      if (morphFactor < 0.85) {
        const ambientAlpha = Math.max(0, 1 - morphFactor / 0.85);
        freeParticles.forEach((fp) => {
          fp.y += fp.vy;
          if (fp.y < -3.0) fp.y = 3.0;

          const [px, py, dist, visible] = project(fp.x, fp.y, fp.z, cameraPitch, cameraYaw, cameraZ);
          if (visible && px >= -40 && px <= width + 40 && py >= -40 && py <= height + 40) {
            const fontSize = Math.max(20, Math.min(32, Math.round(26 * (2.6 / dist))));
            ctx.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
            ctx.fillStyle = fp.isGreen
              ? `rgba(182, 255, 102, ${0.88 * ambientAlpha})`
              : `rgba(215, 225, 240, ${0.75 * ambientAlpha})`;
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
      masterTl.kill();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero-wireframe"
      className="relative z-10 h-screen w-full bg-[#000000] text-white overflow-hidden select-none"
    >
      {/* --- SINGLE UNIFIED CONTINUOUS 3D CANVAS --- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* --- LAYER 1: SECTION 1 HERO OVERLAY (01 INTRO + The Drava) --- */}
      <div
        ref={heroTextRef}
        className="absolute inset-0 z-20 flex flex-col justify-end px-gutter pb-6 sm:pb-8 lg:pb-10 pointer-events-none will-change-transform"
      >
        <div className="flex flex-col items-start gap-2.5 sm:gap-3.5 pb-2 sm:pb-4 pointer-events-auto">
          <div className="inline-flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
              01
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
              INTRO
            </span>
          </div>

          <h1 className="font-display text-[clamp(3.5rem,2.2rem+6vw,8rem)] font-bold tracking-tight text-white leading-none">
            <span>The </span>
            <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-4 sm:px-6 py-1 sm:py-2 rounded-[8px] tracking-normal whitespace-nowrap shadow-none">
              Drava
            </span>
          </h1>
        </div>
      </div>

      {/* --- LAYER 2: SECTION 2 WHAT WE DO OVERLAY (02 WHAT WE DO + 3 diagonal blocks) --- */}
      <div
        ref={introTextRef}
        className="wrap absolute inset-0 z-20 flex flex-col justify-between py-12 lg:py-16 min-h-full w-full px-gutter pointer-events-none"
      >
        {/* Top bar with Tag: 02 WHAT WE DO */}
        <div className="flex items-center justify-between w-full pt-4">
          <div data-tag className="inline-flex items-center gap-2.5 pointer-events-auto">
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
          className="self-start max-w-[34ch] text-left pt-2 lg:pt-4 pointer-events-auto will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.25rem,0.95rem+1.1vw,2.15rem)] font-bold tracking-tight leading-[1.2] text-white">
            <span className="block text-white">Connecting everything,</span>
            <span className="block text-white">designing for clarity,</span>
          </h2>
        </div>

        {/* 2. CENTER: Second Two Lines */}
        <div
          data-block="2"
          className="self-center max-w-[36ch] text-center my-auto py-4 pointer-events-auto will-change-transform"
        >
          <h2 className="font-display text-[clamp(1.25rem,0.95rem+1.1vw,2.15rem)] font-bold tracking-tight leading-[1.2] text-white">
            <span className="block text-white">Bringing it all</span>
            <span className="block text-white">into one unified space.</span>
          </h2>
        </div>

        {/* 3. RIGHT SIDE DOWN: Third Two Lines */}
        <div
          data-block="3"
          className="self-end max-w-[36ch] text-right pb-4 lg:pb-6 pointer-events-auto will-change-transform"
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
