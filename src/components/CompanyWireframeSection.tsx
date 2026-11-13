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
 * CompanyWireframeSection (OPTION C):
 * Continuous experience where the initial landing page has the fluid interactive binary numbers,
 * and as you scroll, the camera seamlessly travels through the binary field, transforming into
 * the 3D room wireframe and revealing the "WHAT WE DO" section without any cut.
 */
export function CompanyWireframeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const whatWeDoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const whatWeDo = whatWeDoRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const wireframeLines = buildInteriorWireframe();

    // Mouse interactive fluid state
    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      radius: 150,
      active: false,
    };

    interface MorphParticle {
      char: string;
      // 2D matrix stream origin and dynamic position
      originX: number;
      originY: number;
      cur2dX: number;
      cur2dY: number;
      vx: number;
      vy: number;
      speed: number;
      baseColor: string;
      baseOpacity: number;
      // 3D wireframe destination point
      tx3d: number;
      ty3d: number;
      tz3d: number;
      isBright: boolean;
      changeTimer: number;
    }

    const morphParticles: MorphParticle[] = [];

    // Map wireframe points to particles that start as the 2D fluid matrix stream
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

        const isGreen = Math.random() < 0.25;
        const baseColor = isGreen ? 'rgba(182, 255, 102, ' : 'rgba(235, 240, 248, ';
        const baseOpacity = isGreen ? 0.85 : 0.65;

        morphParticles.push({
          char: Math.random() > 0.5 ? '1' : '0',
          originX: 0, // calculated on resize
          originY: 0,
          cur2dX: 0,
          cur2dY: 0,
          vx: 0,
          vy: 0,
          speed: 0.35 + Math.random() * 0.7,
          baseColor,
          baseOpacity,
          tx3d: px,
          ty3d: py,
          tz3d: pz,
          isBright: isGreen,
          changeTimer: Math.floor(Math.random() * 200),
        });
      }
    });

    // Ambient floating stream particles to keep hero rich and continuous
    const ambientParticles: Array<{
      x: number;
      y: number;
      z: number;
      vy: number;
      char: string;
      isGreen: boolean;
      opacity: number;
      cur2dX: number;
      cur2dY: number;
      vx: number;
      vy2d: number;
    }> = [];

    for (let i = 0; i < 95; i++) {
      ambientParticles.push({
        x: (Math.random() - 0.5) * 8.5,
        y: (Math.random() - 0.5) * 6.0,
        z: -1.2 + Math.random() * 4.8,
        vy: -0.0015 - Math.random() * 0.003,
        char: Math.random() > 0.5 ? '1' : '0',
        isGreen: Math.random() < 0.25,
        opacity: 0.35 + Math.random() * 0.45,
        cur2dX: 0,
        cur2dY: 0,
        vx: 0,
        vy2d: 0,
      });
    }

    let scrollProgress = 0;
    let targetProgress = 0;
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

      const normX = currentX / rect.width - 0.5;
      const normY = currentY / rect.height - 0.5;
      targetRotY = normX * 0.4;
      targetRotX = -normY * 0.2;
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

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Distribute morph particles evenly across viewport for the initial 2D hero fluid stream
      morphParticles.forEach((p, idx) => {
        p.originX = (idx * 37 + 19) % width;
        p.originY = ((idx * 43) % height) + (Math.random() - 0.5) * 20;
        p.cur2dX = p.originX;
        p.cur2dY = p.originY;
      });

      ambientParticles.forEach((p, idx) => {
        p.cur2dX = (idx * 41 + 10) % width;
        p.cur2dY = (idx * 51 + 25) % height;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // MASTER PINNED TIMELINE FOR SEAMLESS PROGRESSION:
    // 0% -> Hero is displayed with fluid interactive binary numbers
    // 0% -> 22% -> Hero text smoothly fades out upward as camera dollys into stream
    // 22% -> 55% -> Exact same binary numbers morph and lock into 3D wireframe room
    // 55% -> 100% -> "02 WHAT WE DO" statements reveal sequentially over the constructed room
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

    if (hero) {
      masterTl.to(
        hero,
        {
          opacity: 0,
          y: -70,
          duration: 0.20,
          ease: 'power2.inOut',
          pointerEvents: 'none',
        },
        0
      );
    }

    if (whatWeDo) {
      const tag = whatWeDo.querySelector<HTMLElement>('[data-tag]');
      const block1 = whatWeDo.querySelector<HTMLElement>('[data-block="1"]');
      const block2 = whatWeDo.querySelector<HTMLElement>('[data-block="2"]');
      const block3 = whatWeDo.querySelector<HTMLElement>('[data-block="3"]');

      masterTl.set([tag, block1, block2, block3], { opacity: 0, y: 30 });

      masterTl.to(tag, { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.26);
      masterTl.to(block1, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.40);
      masterTl.to(block2, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.60);
      masterTl.to(block3, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.80);
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
      // Natural dampening of mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      scrollProgress += (targetProgress - scrollProgress) * 0.08;
      currRotY += (targetRotY - currRotY) * 0.05;
      currRotX += (targetRotX - currRotX) * 0.05;

      // Morph factor: 0 at landing hero, smoothly assembles into room
      const morphProgress = Math.max(0, (scrollProgress - 0.12) / 0.58);
      const morphFactor = Math.min(1, Math.max(0, morphProgress));

      const cameraZ = 3.2 - scrollProgress * 1.9;
      const cameraPitch = currRotX - scrollProgress * 0.12;
      const cameraYaw = currRotY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Draw wireframe structure lines when morphed enough
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

      const radiusSq = mouse.radius * mouse.radius;
      const roomLockFactor = Math.min(1, Math.max(0, (morphFactor - 0.65) / 0.35));

      // 1. Morph Particles: Start with 2D fluid interactive physics at landing, and smoothly blend into 3D wireframe room
      for (let i = 0; i < morphParticles.length; i++) {
        const p = morphParticles[i];

        // Random digit flip
        p.changeTimer++;
        if (p.changeTimer > 180) {
          p.char = p.char === '1' ? '0' : '1';
          p.changeTimer = 0;
        }

        // Fluid downward drift in 2D mode
        p.originY += p.speed;
        if (p.originY > height + 20) {
          p.originY = -20;
          p.cur2dY = -20;
        }

        // Mouse interaction on the landing page (push & swirl)
        if (mouse.active && morphFactor < 0.6) {
          const dx = p.cur2dX - mouse.x;
          const dy = p.cur2dY - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = 1 - dist / mouse.radius;
            const pushX = (dx / dist) * force * 12;
            const pushY = (dy / dist) * force * 12;
            const swirlX = -(dy / dist) * force * (mouse.vx * 0.5 + 2);
            const swirlY = (dx / dist) * force * (mouse.vy * 0.5 + 2);

            p.vx += pushX + swirlX * 0.3;
            p.vy += pushY + swirlY * 0.3;
          }
        }

        // Spring force returning particle smoothly to stream position
        const homeDx = p.originX - p.cur2dX;
        const homeDy = p.originY - p.cur2dY;
        p.vx += homeDx * 0.045;
        p.vy += homeDy * 0.045;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.cur2dX += p.vx;
        p.cur2dY += p.vy;

        // 3D projection for this particle's target position
        const [target3dX, target3dY, dist, visible] = project(
          p.tx3d,
          p.ty3d,
          p.tz3d,
          cameraPitch,
          cameraYaw,
          cameraZ
        );

        if (visible || morphFactor < 0.5) {
          // Smooth interpolation from 2D screen coordinate to 3D projected coordinate
          const renderX = p.cur2dX * (1 - morphFactor) + target3dX * morphFactor;
          const renderY = p.cur2dY * (1 - morphFactor) + target3dY * morphFactor;

          const baseSize = 20 * (1 - roomLockFactor) + 12.5 * roomLockFactor;
          const fontSize = Math.max(11, Math.min(22, Math.round(baseSize * (2.6 / (dist || 2.6)))));

          ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

          const vel = Math.hypot(p.vx, p.vy);
          const alpha = Math.min(p.baseOpacity + vel * 0.08, 0.95);

          ctx.fillStyle = `${p.baseColor}${alpha})`;
          ctx.fillText(p.char, renderX, renderY);
        }
      }

      // 2. Ambient stream particles in 3D depth to maintain continuous matrix ambiance
      if (morphFactor < 0.85) {
        const ambientAlpha = Math.max(0, 1 - morphFactor / 0.85);
        ambientParticles.forEach((fp) => {
          fp.y += fp.vy;
          if (fp.y < -2.6) fp.y = 2.6;

          const [px, py, dist, visible] = project(fp.x, fp.y, fp.z, cameraPitch, cameraYaw, cameraZ);
          if (visible && px >= -30 && px <= width + 30 && py >= -30 && py <= height + 30) {
            const fontSize = Math.max(16, Math.min(22, Math.round(20 * (2.6 / dist))));
            ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
            ctx.fillStyle = fp.isGreen
              ? `rgba(182, 255, 102, ${0.85 * ambientAlpha})`
              : `rgba(215, 225, 240, ${0.70 * ambientAlpha})`;
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
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero-intro"
      className="relative z-10 h-screen w-full bg-[#000000] text-white overflow-hidden select-none"
    >
      {/* --- SINGLE UNIFIED CONTINUOUS CANVAS --- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* --- LANDING HERO (INITIAL VIEWPORT): "01 INTRO" & "The Drava" --- */}
      <div
        ref={heroRef}
        className="absolute inset-0 z-10 flex flex-col justify-end px-gutter pb-4 sm:pb-6 lg:pb-8 pointer-events-none"
      >
        <div className="relative z-10 mt-auto flex flex-col items-start gap-2 sm:gap-3 pb-2 sm:pb-4 pointer-events-auto">
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

      {/* --- WHAT WE DO SECTION (APPEARS ON SCROLL AS WIREFRAME FORMS) --- */}
      <div
        ref={whatWeDoRef}
        className="wrap absolute inset-0 z-10 flex flex-col justify-between py-12 lg:py-16 min-h-full w-full px-gutter pointer-events-none"
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

        {/* 3. RIGHT SIDE DOWN: Third Two Lines (with Green Rectangle for Drava) */}
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
