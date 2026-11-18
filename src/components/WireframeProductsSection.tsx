'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { WordScrub } from './type';
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

  // Ceiling baffles & Luminaires: connected flush to outer rails
  for (let z = -0.5; z <= 2.5; z += 0.75) {
    const leftX = -2.2 - (z + 1.0) * 0.075;
    const rightX = 2.2 + (z + 1.0) * 0.075;
    lines.push({ p1: [leftX, -1.1, z], p2: [rightX, -1.1, z] });
  }

  // Ceiling longitudinal inner lighting rails
  lines.push({ p1: [-0.9, -1.1, -1.0], p2: [-0.9, -1.1, 2.8] });
  lines.push({ p1: [0.9, -1.1, -1.0], p2: [0.9, -1.1, 2.8] });

  // Suspended linear light fixture
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

    lines.push({ p1: [cx + (cx < 0 ? -cw : cw), seatY, cz - cw], p2: [cx + (cx < 0 ? -cw : cw), backY, cz - cw] });
    lines.push({ p1: [cx + (cx < 0 ? -cw : cw), seatY, cz + cw], p2: [cx + (cx < 0 ? -cw : cw), backY, cz + cw] });
    lines.push({ p1: [cx + (cx < 0 ? -cw : cw), backY, cz - cw], p2: [cx + (cx < 0 ? -cw : cw), backY, cz + cw] });

    lines.push({ p1: [cx, seatY, cz], p2: [cx, 0.88, cz] });
    lines.push({ p1: [cx - 0.2, 0.88, cz], p2: [cx + 0.2, 0.88, cz] });
    lines.push({ p1: [cx, 0.88, cz - 0.2], p2: [cx, 0.88, cz + 0.2] });
  });

  return lines;
}

interface BinaryPoint {
  streamX: number;
  streamY: number;
  streamZ: number;
  speedY: number;
  tx3d: number;
  ty3d: number;
  tz3d: number;
  char: '0' | '1';
  flipTimer: number;
  flipInterval: number;
  isBright: boolean;
}

interface FreeParticle {
  x: number;
  y: number;
  z: number;
  vy: number;
  char: '0' | '1';
  flipTimer: number;
  flipInterval: number;
  isGreen: boolean;
}

export function WireframeProductsSection() {
  const masterContainerRef = useRef<HTMLElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [fullscreenApp, setFullscreenApp] = useState<(typeof applications)[number] | null>(null);

  const apps = applications.slice(0, 4);

  useEffect(() => {
    const masterContainer = masterContainerRef.current;
    const scene1 = scene1Ref.current;
    const scene2 = scene2Ref.current;
    const canvas = canvasRef.current;
    const textWrapper = textWrapperRef.current;
    if (!masterContainer || !scene1 || !scene2 || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    // Interaction & scroll progress tracking
    let targetProgress = 0;
    let scrollProgress = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currRotY = 0;
    let currRotX = 0;

    const wireframeLines = buildInteriorWireframe();

    // 1. POPULATE TASTEFUL, WELL-SPACED BINARY POINTS ON WIREFRAME
    // Balanced count: ~100 to 115 points so the wireframe remains clean, elegant and uncluttered
    const particles: BinaryPoint[] = [];

    wireframeLines.forEach((line) => {
      const dx = line.p2[0] - line.p1[0];
      const dy = line.p2[1] - line.p1[1];
      const dz = line.p2[2] - line.p1[2];
      const length = Math.hypot(dx, dy, dz);

      // Skip tiny line segments (<0.32) to prevent crowding on chair spokes and joints
      if (length < 0.32) return;

      // Elegant spacing: approximately 1 point per 0.85 unit of line length
      const count = Math.max(1, Math.round(length / 0.85));

      for (let s = 0; s < count; s++) {
        const t = (s + 0.5) / count;
        const tx = line.p1[0] + dx * t;
        const ty = line.p1[1] + dy * t;
        const tz = line.p1[2] + dz * t;

        particles.push({
          streamX: (Math.random() - 0.5) * 6.8,
          streamY: (Math.random() - 0.5) * 5.4,
          streamZ: -1.2 + Math.random() * 4.6,
          speedY: 0.004 + Math.random() * 0.007,
          tx3d: tx,
          ty3d: ty,
          tz3d: tz,
          char: Math.random() > 0.5 ? '1' : '0',
          flipTimer: Math.floor(Math.random() * 90),
          flipInterval: 50 + Math.floor(Math.random() * 120),
          isBright: Math.random() < 0.32,
        });
      }
    });

    // 2. FILL FULL SCREEN WITH RICH AMBIENT BINARY NUMBERS (240 PARTICLES COVERING ENTIRE VIEWPORT)
    const freeParticles: FreeParticle[] = [];
    const totalFree = 240;
    for (let i = 0; i < totalFree; i++) {
      freeParticles.push({
        x: (Math.random() - 0.5) * 7.6,
        y: (Math.random() - 0.5) * 6.0,
        z: -1.5 + Math.random() * 5.2,
        vy: -0.003 - Math.random() * 0.005,
        char: Math.random() > 0.5 ? '1' : '0',
        flipTimer: Math.floor(Math.random() * 90),
        flipInterval: 40 + Math.floor(Math.random() * 100),
        isGreen: Math.random() < 0.22,
      });
    }

    const onPointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = normX * 0.16;
      targetRotX = -normY * 0.12;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const handleResize = () => {
      const rect = scene1.getBoundingClientRect();
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

    // --- SETUP SCENE 2 ELEMENTS ---
    const panels = scene2.querySelectorAll<HTMLElement>('[data-product-slide]');
    const leftCol = scene2.querySelector<HTMLElement>('[data-left-col]');
    const introTag = leftCol?.querySelector<HTMLElement>('[data-intro-tag]');
    const introHeading = leftCol?.querySelector<HTMLElement>('[data-intro-heading]');
    const introDesc = leftCol?.querySelector<HTMLElement>('[data-intro-desc]');
    const introArrow = leftCol?.querySelector<HTMLElement>('[data-intro-arrow]');

    const slide0Num = panels[0]?.querySelector<HTMLElement>('[data-flow-num]');
    const slide0Img = panels[0]?.querySelector<HTMLElement>('[data-flow-img]');
    const slide0Details = panels[0]?.querySelector<HTMLElement>('[data-flow-details]');
    const slide0Divider = panels[0]?.querySelector<HTMLElement>('[data-flow-divider]');

    const isDesktop = window.innerWidth >= 1024;
    const initialOffset01 = isDesktop
      ? (window.innerWidth * 0.8) - ((window.innerWidth - Math.min(window.innerWidth - 64, 1152)) / 2 + 80)
      : 0;

    // Initial Scene 2 states:
    if (panels[0]) {
      gsap.set(panels[0], { xPercent: 0, opacity: 1, pointerEvents: 'auto' });
    }
    if (slide0Num) gsap.set(slide0Num, { x: initialOffset01, opacity: 1 });
    if (slide0Img) gsap.set(slide0Img, { x: 350, opacity: 0 });
    if (slide0Details) gsap.set(slide0Details, { x: 420, opacity: 0 });
    if (slide0Divider) gsap.set(slide0Divider, { x: 450, opacity: 0 });

    for (let i = 1; i < panels.length; i++) {
      gsap.set(panels[i], { xPercent: 120, opacity: 0, pointerEvents: 'none' });
    }

    // FIRST LOOK:
    // When entering this screen, ONLY the 03 PRODUCTS tag and resting 0/1 are visible!
    // The main heading, description, and arrow start hidden (opacity: 0, y: 35).
    if (introTag) gsap.set(introTag, { opacity: 1, y: 0 });
    if (introHeading) gsap.set(introHeading, { opacity: 0, y: 35 });
    if (introDesc) gsap.set(introDesc, { opacity: 0, y: 30 });
    if (introArrow) gsap.set(introArrow, { opacity: 0, scale: 0.8 });

    // --- MASTER TIMELINE (SCENE 1 + SCENE 2 IN ONE CONTINUOUS PIN) ---
    // Total scale: 100 units.
    // Extended pin distance (+=760%) for a slower, richer, cinematic transition!
    const masterTl = gsap.timeline({
      id: 'wireframe-products-scroll',
      scrollTrigger: {
        id: 'wireframe-products-trigger',
        trigger: masterContainer,
        start: 'top top',
        end: '+=760%',
        pin: true,
        scrub: 0.65,
        onUpdate: (self) => {
          targetProgress = self.progress;

          // Track active product index for indicators
          if (self.progress >= 0.44) {
            const p = (self.progress - 0.48) / 0.52;
            const idx = p < 0.12 ? 0 : Math.min(apps.length - 1, Math.floor((p - 0.12) / 0.25));
            setActiveIdx(Math.max(0, idx));
          } else {
            setActiveIdx(0);
          }
        },
      },
    });

    // 1. Initial Scene 1 States
    gsap.set(scene1, { opacity: 1, pointerEvents: 'auto' });
    gsap.set(scene2, { opacity: 0, pointerEvents: 'none' });

    if (textWrapper) {
      const tag = textWrapper.querySelector<HTMLElement>('[data-tag]');
      const block1 = textWrapper.querySelector<HTMLElement>('[data-block="1"]');
      const block2 = textWrapper.querySelector<HTMLElement>('[data-block="2"]');
      const block3 = textWrapper.querySelector<HTMLElement>('[data-block="3"]');

      if (tag && block1 && block2 && block3) {
        masterTl.set([tag, block1, block2, block3], { opacity: 0, y: 30 }, 0);

        // Sequence 02 Tag & Text blocks in Scene 1
        masterTl.to(tag, { opacity: 1, y: 0, duration: 3.5, ease: 'power2.out' }, 4);
        masterTl.to(block1, { opacity: 1, y: 0, duration: 4.5, ease: 'power2.out' }, 7);
        masterTl.to(block2, { opacity: 1, y: 0, duration: 4.5, ease: 'power2.out' }, 12);
        masterTl.to(block3, { opacity: 1, y: 0, duration: 4.5, ease: 'power2.out' }, 17);

        // Ample time to read all 3 statements in the wireframe room
        masterTl.to({}, { duration: 4 }, 21.5);

        // Fade out text cleanly as camera prepares to plunge into black screen
        masterTl.to([tag, block1, block2, block3], { opacity: 0, y: -25, duration: 3.5, ease: 'power2.in' }, 25.5);
      }
    }

    // 2. Cinematic In-Place Transition:
    // Scene 1 fades out into deep black (24 to 30).
    // When the camera moves from wireframe to this page, the FIRST LOOK is:
    // "03 PRODUCTS" tag (and resting 0/1 on the right).
    masterTl.to(scene1, { opacity: 0, duration: 6, ease: 'power1.inOut' }, 24);
    masterTl.set(scene1, { pointerEvents: 'none' }, 30);

    masterTl.fromTo(
      scene2,
      { opacity: 0, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 5, ease: 'power2.out' },
      26
    );
    masterTl.set(scene2, { pointerEvents: 'auto' }, 30);

    // Initial appearance of 03 PRODUCTS on entry
    if (introTag) {
      masterTl.fromTo(
        introTag,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 4, ease: 'power2.out' },
        27
      );
    }

    // 3. AFTER THAT SCROLL: The text content appears in scrolling animations:
    // Heading ("The product changes but the experience stays.") smoothly rises up and fades in
    if (introHeading) {
      masterTl.to(
        introHeading,
        {
          opacity: 1,
          y: 0,
          duration: 7,
          ease: 'power2.out',
        },
        33
      );
    }

    // Subtitle description rises up and fades in right after heading
    if (introDesc) {
      masterTl.to(
        introDesc,
        {
          opacity: 1,
          y: 0,
          duration: 6,
          ease: 'power2.out',
        },
        39
      );
    }

    // Forward arrow button reveals as intro text completes
    if (introArrow) {
      masterTl.to(
        introArrow,
        {
          opacity: 1,
          scale: 1,
          duration: 3,
          ease: 'back.out(1.5)',
        },
        44
      );
    }

    // Rest pause on completed intro text before product carousel takes over
    masterTl.to({}, { duration: 5 }, 48);

    // 4. ANIMATING PRODUCTS (Intro -> Product 01 Nex -> 02 -> 03 -> 04):
    // Segment 1 (53 -> 65): Left column glides out, Product 01 glides in smoothly like before
    if (leftCol) {
      masterTl.to(
        leftCol,
        {
          xPercent: -125,
          opacity: 0,
          duration: 9,
          ease: 'power2.inOut',
        },
        53
      );
    }
    if (slide0Num) {
      masterTl.to(
        slide0Num,
        {
          x: 0,
          duration: 9,
          ease: 'power2.inOut',
        },
        53
      );
    }
    if (slide0Img) {
      masterTl.to(slide0Img, { x: 0, opacity: 1, duration: 8, ease: 'power2.out' }, 54);
    }
    if (slide0Details) {
      masterTl.to(slide0Details, { x: 0, opacity: 1, duration: 8, ease: 'power2.out' }, 54.5);
    }
    if (slide0Divider) {
      masterTl.to(slide0Divider, { x: 0, opacity: 1, duration: 8, ease: 'power2.out' }, 55);
    }

    // Rest on Product 01
    masterTl.to({}, { duration: 3 }, 63);

    // Segments 2, 3, 4: Transitions between Products
    const stepTimes = [
      { start: 65, rest: 75 }, // Prod 01 -> Prod 02 (HMS)
      { start: 76, rest: 87 }, // Prod 02 -> Prod 03 (Vision)
      { start: 88, rest: 98 }, // Prod 03 -> Prod 04 (Simulator)
    ];

    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const times = stepTimes[i];
      if (!prev || !next || !times) continue;

      masterTl.to(
        prev,
        {
          xPercent: -130,
          opacity: 0,
          pointerEvents: 'none',
          duration: 9,
          ease: 'power2.inOut',
        },
        times.start
      );

      masterTl.fromTo(
        next,
        { xPercent: 120, opacity: 0, pointerEvents: 'none' },
        {
          xPercent: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 9,
          ease: 'power2.inOut',
        },
        times.start
      );

      masterTl.to({}, { duration: 3 }, times.rest);
    }

    // --- 3D CANVAS RENDER LOOP ---
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

      // Scale scrollProgress to Scene 1's domain (0 to 0.35)
      const scene1Prog = Math.min(1, Math.max(0, scrollProgress / 0.35));

      // Morph factor for wireframe assembly
      const morphFactor = Math.min(1, Math.max(0, scene1Prog * 3.5));

      // Slower, richer dive into the black screen (0.65 -> 1.0 of Scene 1)
      let cameraZ = 2.8 - scene1Prog * 1.5;
      let cameraPitch = currRotX - scene1Prog * 0.12;
      let diveFade = 1;

      if (scene1Prog > 0.65) {
        const diveProgress = (scene1Prog - 0.65) / 0.35; // 0 -> 1 over a wider range for a slower, richer feel
        cameraZ -= diveProgress * diveProgress * 4.8;
        diveFade = Math.max(0, 1 - Math.pow(diveProgress, 1.35) * 1.05);
      }

      const cameraYaw = currRotY * diveFade;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If Scene 1 is finished and completely black, skip wireframe drawing to save CPU/GPU
      if (scene1Prog < 1.0 || diveFade > 0.005) {
        ctx.save();
        ctx.scale(dpr, dpr);

        if (morphFactor > 0.35 && diveFade > 0.01) {
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

        const roomLockFactor = Math.min(1, Math.max(0, (morphFactor - 0.65) / 0.35));

        particles.forEach((pt) => {
          pt.flipTimer++;
          if (pt.flipTimer > pt.flipInterval) {
            pt.char = pt.char === '1' ? '0' : '1';
            pt.flipTimer = 0;
          }

          pt.streamY += pt.speedY;
          if (pt.streamY > 4.2) pt.streamY = -4.2;

          const curX = pt.streamX * (1 - morphFactor) + pt.tx3d * morphFactor;
          const curY = pt.streamY * (1 - morphFactor) + pt.ty3d * morphFactor;
          const curZ = pt.streamZ * (1 - morphFactor) + pt.tz3d * morphFactor;

          const [px, py, dist, visible] = project(curX, curY, curZ, cameraPitch, cameraYaw, cameraZ);
          if (visible && px >= -80 && px <= width + 80 && py >= -80 && py <= height + 80) {
            const baseSize = 18 * (1 - roomLockFactor) + 11.5 * roomLockFactor;
            const minSize = Math.round(14 * (1 - roomLockFactor) + 9.5 * roomLockFactor);
            const maxSize = Math.round(22 * (1 - roomLockFactor) + 13.5 * roomLockFactor);
            const fontSize = Math.max(minSize, Math.min(maxSize, Math.round(baseSize * (2.6 / dist))));

            ctx.font = `500 ${fontSize}px var(--font-inter), system-ui, -apple-system, sans-serif`;

            if (roomLockFactor > 0.25) {
              ctx.fillStyle = `rgba(0, 0, 0, ${0.88 * roomLockFactor})`;
              ctx.beginPath();
              ctx.arc(px, py, fontSize * 0.58, 0, Math.PI * 2);
              ctx.fill();
            }

            const depthAlpha = Math.max(0.65, Math.min(1.0, 2.9 / dist)) * diveFade;
            ctx.fillStyle = pt.isBright
              ? `rgba(182, 255, 102, ${Math.min(1, 0.98 * depthAlpha)})`
              : `rgba(170, 185, 205, ${Math.min(1, 0.92 * depthAlpha)})`;
            ctx.fillText(pt.char, px, py);
          }
        });

        // Ambient full-screen binary numbers (gently floating across the entire viewport)
        const ambientAlpha = Math.max(0.28, 0.78 * (1 - morphFactor * 0.55)) * diveFade;
        freeParticles.forEach((fp) => {
          fp.flipTimer++;
          if (fp.flipTimer > fp.flipInterval) {
            fp.char = fp.char === '1' ? '0' : '1';
            fp.flipTimer = 0;
          }

          fp.y += fp.vy;
          if (fp.y < -4.8) fp.y = 4.8;

          const [px, py, dist, visible] = project(fp.x, fp.y, fp.z, cameraPitch, cameraYaw, cameraZ);
          if (visible && px >= -80 && px <= width + 80 && py >= -80 && py <= height + 80) {
            const fontSize = Math.max(14, Math.min(22, Math.round(17 * (2.6 / dist))));
            ctx.font = `400 ${fontSize}px var(--font-inter), system-ui, -apple-system, sans-serif`;
            ctx.fillStyle = fp.isGreen
              ? `rgba(182, 255, 102, ${0.85 * ambientAlpha})`
              : `rgba(145, 160, 180, ${0.68 * ambientAlpha})`;
            ctx.fillText(fp.char, px, py);
          }
        });

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      masterTl.kill();
      ScrollTrigger.getById('wireframe-products-trigger')?.kill();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [apps.length]);

  return (
    <section
      ref={masterContainerRef}
      id="intro"
      className="relative z-10 w-full h-screen bg-[#000000] text-white overflow-hidden"
    >
      {/* =========================================================================
          SCENE 1: 02 WHAT WE DO (3D Wireframe Room & Sequential Text Animation)
          ========================================================================= */}
      <div
        ref={scene1Ref}
        className="absolute inset-0 w-full h-full flex flex-col justify-between py-12 lg:py-16 overflow-hidden pointer-events-auto"
      >
        {/* 3D Wireframe Canvas */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none">
          <canvas ref={canvasRef} className="block h-full w-full" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-transparent to-[#000000] pointer-events-none" />
        </div>

        {/* Content Wrapper */}
        <div
          ref={textWrapperRef}
          className="wrap relative z-10 flex flex-col justify-between min-h-[82vh] w-full px-gutter pointer-events-auto"
        >
          {/* Top Tag: 02 WHAT WE DO */}
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

          {/* 1. LEFT TOP */}
          <div data-block="1" className="self-start max-w-[34ch] text-left pt-2 lg:pt-4 will-change-transform">
            <h2 className="font-display text-[clamp(1.25rem,0.95rem+1.1vw,2.15rem)] font-bold tracking-tight leading-[1.2] text-white">
              <span className="block text-white">Connecting everything,</span>
              <span className="block text-white">designing for clarity,</span>
            </h2>
          </div>

          {/* 2. CENTER */}
          <div data-block="2" className="self-center max-w-[36ch] text-center my-auto py-4 will-change-transform">
            <h2 className="font-display text-[clamp(1.25rem,0.95rem+1.1vw,2.15rem)] font-bold tracking-tight leading-[1.2] text-white">
              <span className="block text-white">Bringing it all</span>
              <span className="block text-white">into one unified space.</span>
            </h2>
          </div>

          {/* 3. RIGHT BOTTOM (with Green Drava Badge) */}
          <div data-block="3" className="self-end max-w-[36ch] text-right pb-4 lg:pb-6 will-change-transform">
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
      </div>

      {/* =========================================================================
          SCENE 2: 03 PRODUCTS (Ecosystem Products Carousel)
          Appears in place right where Scene 1 ends (inside the black screen)
          NO DOWN-SCROLL, NO ANIMATING FROM DOWN!
          ========================================================================= */}
      <div
        ref={scene2Ref}
        id="applications"
        className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden pointer-events-none will-change-transform"
      >
        <div className="relative flex-1 flex flex-col lg:flex-row w-full h-full">
          {/* LEFT COLUMN: 60% Width Intro Content */}
          <div
            data-left-col
            className="w-full lg:w-[60%] h-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 xl:p-20 z-20 bg-[#000000] border-b lg:border-b-0 lg:border-r border-[#b6ff66]/40 select-none will-change-transform"
          >
            {/* Top Tag: 03 PRODUCTS */}
            <div className="pt-2">
              <div data-intro-tag className="inline-flex items-center gap-2.5 will-change-transform">
                <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                  03
                </span>
                <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
                  PRODUCTS
                </span>
              </div>
            </div>

            {/* Main Content with Animated Heading & Subtitle */}
            <div data-intro-content className="my-auto py-6 max-w-3xl will-change-transform">
              <h2
                data-intro-heading
                className="font-display text-[clamp(2.6rem,2.8rem+3.5vw,5.8rem)] font-bold tracking-tight leading-[1.04] text-white will-change-transform"
              >
                The product changes but the experience stays.
              </h2>

              <p
                data-intro-desc
                className="mt-8 text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-[48ch] font-normal will-change-transform"
              >
                Four intelligent systems engineered to unify every environment. One cohesive OS connecting hardware, spaces, and digital workflows.
              </p>
            </div>

            {/* Bottom Forward Arrow Button: Advance directly to 01 Product */}
            <div className="pb-2">
              <button
                data-intro-arrow
                type="button"
                onClick={() => {
                  const st = ScrollTrigger.getById('wireframe-products-trigger');
                  if (st) {
                    const targetScroll = st.start + (st.end - st.start) * 0.62;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                aria-label="Advance to first product (01 Nex)"
                className="group inline-flex items-center text-white hover:text-[#b6ff66] transition-colors duration-300 py-2 cursor-pointer focus:outline-none will-change-transform"
              >
                <Arrow className="size-8 sm:size-10 text-white group-hover:text-[#b6ff66] transition-all duration-300 group-hover:translate-x-2" />
              </button>
            </div>
          </div>

          {/* FULL-SCREEN PRODUCT STAGE: Active Products on Scroll */}
          <div
            data-product-stage
            className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center p-2 sm:p-4 lg:p-6 z-30 pointer-events-none"
          >
            {apps.map((app, i) => (
              <div
                key={app.id}
                data-product-slide
                className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-6 will-change-transform"
              >
                {/* Product Layout */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-7 xl:gap-9 w-full max-w-[95vw] 2xl:max-w-[1550px]">
                  {/* 1. NUMBER INDICATOR: 0 / digit */}
                  <div data-flow-num className="flex items-center select-none shrink-0 will-change-transform leading-none gap-2 sm:gap-2.5 pl-2 sm:pl-3 lg:pl-4 pr-2 sm:pr-3">
                    <span className="font-display font-black text-[clamp(4.8rem,7.5vw,11.8rem)] leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.14)]">
                      0
                    </span>
                    <span className="font-display font-light text-[clamp(4.5rem,7vw,11rem)] text-[#50555e] leading-none select-none">
                      /
                    </span>
                    <span className="font-display font-black text-[clamp(4.8rem,7.5vw,11.8rem)] leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.14)]">
                      {i + 1}
                    </span>
                  </div>

                  {/* 2. CENTER: Horizontal Screen Monitor */}
                  <div data-flow-img className="shrink-0 flex justify-center items-center will-change-transform pointer-events-auto">
                    <div className="relative aspect-[16/9] w-[330px] sm:w-[450px] md:w-[520px] lg:w-[500px] xl:w-[590px] 2xl:w-[680px] max-h-[60vh] rounded-2xl border-2 border-white/20 bg-[#0a0c0e] overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(255,255,255,0.06)] group/frame">
                      <TransitionLink
                        href={`/applications/${slugOf(app)}`}
                        className="group/img relative w-full h-full block cursor-pointer overflow-hidden"
                        aria-label={`View ${app.name} details`}
                      >
                        <Image
                          src={app.image}
                          alt={app.name}
                          fill
                          quality={100}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                          className="object-contain object-center w-full h-full transition-transform duration-700 group-hover/img:scale-[1.02]"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10 backdrop-blur-[2px]">
                          <span className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-6 text-small font-semibold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000] transform translate-y-2 group-hover/img:translate-y-0">
                            <span>View {app.name}</span>
                            <Arrow className="size-3.5 -rotate-45" />
                          </span>
                        </div>

                        {/* Fullscreen Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFullscreenApp(app);
                          }}
                          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-black/75 hover:bg-black/90 border border-white/20 text-white/80 hover:text-[#b6ff66] transition-all cursor-pointer backdrop-blur-sm"
                          aria-label={`View ${app.name} in fullscreen modal`}
                        >
                          <svg
                            className="size-3.5 fill-none stroke-current"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                          </svg>
                          <span>Fullscreen</span>
                        </button>
                      </TransitionLink>
                    </div>
                  </div>

                  {/* 3. CENTER-RIGHT: Product Details & Specifications with data-text-anim for staggered entrance */}
                  <div data-flow-details className="flex flex-col justify-center text-left space-y-3.5 w-full sm:w-[300px] lg:w-[320px] xl:w-[350px] shrink-0 will-change-transform pointer-events-auto">
                    {/* Step Number */}
                    <div data-text-anim className="font-mono text-xs sm:text-sm tracking-widest text-white/60 will-change-transform">
                      0{i + 1} / 0{apps.length}
                    </div>

                    {/* Product Name */}
                    <h3 data-text-anim className="font-display text-[clamp(2.2rem,1.9rem+1.6vw,3.3rem)] font-bold leading-none tracking-tight text-white will-change-transform">
                      {app.name}
                    </h3>

                    {/* Description */}
                    <p data-text-anim className="text-xs sm:text-sm lg:text-base leading-relaxed text-[#c8ccd6] will-change-transform">
                      {app.description}
                    </p>

                    {/* Specs Table */}
                    <div data-text-anim className="border-t border-b border-white/20 py-3 my-1 space-y-2 will-change-transform">
                      <div className="flex justify-between text-xs sm:text-sm font-mono text-white/80">
                        <span>Category</span>
                        <span className="text-white font-medium">{app.badge}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm font-mono text-white/80">
                        <span>System</span>
                        <span className="text-white font-medium">Drava OS</span>
                      </div>
                    </div>

                    {/* Explore CTA */}
                    <div data-text-anim className="will-change-transform">
                      <TransitionLink
                        href={`/applications/${slugOf(app)}`}
                        className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-6 text-small font-semibold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000] group mt-1"
                      >
                        <span>Explore {app.name}</span>
                        <Arrow className="size-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-current" />
                      </TransitionLink>
                    </div>
                  </div>

                  {/* 4. VERTICAL GREEN LINE DIVIDER */}
                  {i < apps.length - 1 && (
                    <div
                      data-flow-divider
                      style={{ backgroundColor: '#b6ff66' }}
                      className="hidden lg:block w-[1px] h-screen shrink-0 ml-5 lg:ml-7 xl:ml-10 will-change-transform shadow-[0_0_12px_rgba(182,255,102,0.4)]"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULLSCREEN POPUP MODAL */}
        {fullscreenApp && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200 pointer-events-auto"
            onClick={() => setFullscreenApp(null)}
          >
            <div
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#0a0c0e] border-2 border-white/20 rounded-2xl overflow-hidden p-4 sm:p-6 flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs sm:text-sm font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-[#b6ff66] font-bold">Product {fullscreenApp.id}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-white font-semibold">{fullscreenApp.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFullscreenApp(null)}
                  aria-label="Close fullscreen modal"
                  className="size-8 rounded-full border border-white/20 bg-white/5 hover:bg-[#b6ff66] hover:text-black flex items-center justify-center transition-colors cursor-pointer text-white"
                >
                  ✕
                </button>
              </div>

              {/* Modal Image Body */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[68vh] my-4 rounded-xl overflow-hidden bg-black/80">
                <Image
                  src={fullscreenApp.image}
                  alt={fullscreenApp.name}
                  fill
                  quality={100}
                  className="object-contain"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-white/10 text-xs sm:text-sm font-mono text-white/70">
                <p className="max-w-xl text-xs sm:text-sm text-[#c8ccd6]">{fullscreenApp.description}</p>
                <TransitionLink
                  href={`/applications/${slugOf(fullscreenApp)}`}
                  className="inline-flex min-h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-5 text-xs font-semibold tracking-wider uppercase text-white shadow-xl transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000] group"
                >
                  <span>Explore {fullscreenApp.name}</span>
                  <Arrow className="size-3 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-current" />
                </TransitionLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
