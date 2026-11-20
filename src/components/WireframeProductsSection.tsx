'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { WordScrub } from './type';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-product context continuity'
];

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

  // Left and Right Wall Outer Perimeter Rails taper from x = ±2.2 at z = -1.0 to x = ±2.5 at z = 3.0
  // Slope = (2.5 - 2.2) / (3.0 - (-1.0)) = 0.3 / 4.0 = 0.075 per z unit
  const leftWallX = (z: number) => -2.2 - (z + 1.0) * 0.075;
  const rightWallX = (z: number) => 2.2 + (z + 1.0) * 0.075;

  // Windows & Partitions (perfectly snapped to wall slope at both ends of each segment)
  for (let z = -0.5; z <= 2.2; z += 0.9) {
    const nextZ = Math.min(3.0, z + 0.9);
    const x1 = leftWallX(z);
    const x2 = leftWallX(nextZ);
    // Vertical mullion
    lines.push({ p1: [x1, -1.1, z], p2: [x1, 0.9, z] });
    // Horizontal mullion cleanly connecting vertex at (x1, z) to (x2, nextZ)
    lines.push({ p1: [x1, -0.1, z], p2: [x2, -0.1, nextZ] });
  }

  for (let z = -0.5; z <= 2.2; z += 0.9) {
    const nextZ = Math.min(3.0, z + 0.9);
    const x1 = rightWallX(z);
    const x2 = rightWallX(nextZ);
    // Vertical mullion
    lines.push({ p1: [x1, -1.1, z], p2: [x1, 0.9, z] });
    // Horizontal mullion cleanly connecting vertex at (x1, z) to (x2, nextZ)
    lines.push({ p1: [x1, 0.0, z], p2: [x2, 0.0, nextZ] });
  }

  // Ceiling baffles: connected flush to outer rails (leftWallX and rightWallX)
  for (let z = -0.5; z <= 2.5; z += 0.75) {
    lines.push({ p1: [leftWallX(z), -1.1, z], p2: [rightWallX(z), -1.1, z] });
  }

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

  // Floor Perimeter Rails at Bottom of Table Legs (Connecting the 4 table legs cleanly along the floor)
  lines.push({ p1: [-tableW + 0.12, 0.9, tableZ1 + 0.12], p2: [tableW - 0.12, 0.9, tableZ1 + 0.12] });
  lines.push({ p1: [tableW - 0.12, 0.9, tableZ1 + 0.12], p2: [tableW - 0.12, 0.9, tableZ2 - 0.12] });
  lines.push({ p1: [tableW - 0.12, 0.9, tableZ2 - 0.12], p2: [-tableW + 0.12, 0.9, tableZ2 - 0.12] });
  lines.push({ p1: [-tableW + 0.12, 0.9, tableZ2 - 0.12], p2: [-tableW + 0.12, 0.9, tableZ1 + 0.12] });

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
    const introWords = leftCol?.querySelectorAll<HTMLElement>('.w-scrub');
    const introArrow = leftCol?.querySelector<HTMLElement>('[data-intro-arrow]');

    const slide0Num = panels[0]?.querySelector<HTMLElement>('[data-flow-num]');
    const slide0Img = panels[0]?.querySelector<HTMLElement>('[data-flow-img]');

    // Companion Slide elements
    const companionSlide = scene2.querySelector<HTMLElement>('[data-companion-slide]');
    const companionLeftCol = companionSlide?.querySelector<HTMLElement>('[data-comp-left]');
    const companionRightCol = companionSlide?.querySelector<HTMLElement>('[data-comp-right]');
    const compHeadingWords = companionLeftCol?.querySelectorAll<HTMLElement>('.w-scrub:not([data-words] .w-scrub)');
    const compBadge = companionLeftCol?.querySelector<HTMLElement>('.w-comp-badge');
    const compLeftWords = companionLeftCol?.querySelectorAll<HTMLElement>('[data-words] .w-scrub');
    const compRightWords = companionRightCol?.querySelectorAll<HTMLElement>('.w-scrub');
    const compListItems = companionRightCol?.querySelectorAll<HTMLElement>('[data-point-item]');
    const compDividers = companionRightCol?.querySelectorAll<HTMLElement>('[data-point-divider]');

    // Initial Scene 2 states:
    // Keep all product panels in the center initially, hidden until activated
    panels.forEach((p) => {
      gsap.set(p, {
        scale: 0.92,
        opacity: 0,
        pointerEvents: 'none',
      });
      const textItems = p.querySelectorAll<HTMLElement>('[data-text-anim]');
      gsap.set(textItems, { opacity: 0, y: 16 });
    });
    if (slide0Num) gsap.set(slide0Num, { x: 0, opacity: 1 });
    if (slide0Img) gsap.set(slide0Img, { x: 0, opacity: 1 });

    // Initial Companion slide states: starts centered, scaled down and hidden
    if (companionSlide) {
      gsap.set(companionSlide, {
        scale: 0.92,
        opacity: 0,
        pointerEvents: 'none',
      });
    }
    if (compListItems) {
      gsap.set(compListItems, { y: 25, opacity: 0 });
    }
    if (compDividers) {
      gsap.set(compDividers, { scaleX: 0, transformOrigin: 'left center' });
    }
    if (compHeadingWords && compHeadingWords.length > 0) {
      gsap.set(compHeadingWords, { color: 'rgba(182, 255, 102, 0.22)', opacity: 0.35 });
    }
    if (compBadge) {
      gsap.set(compBadge, { opacity: 0.35, scale: 0.95, filter: 'grayscale(0.6)' });
    }
    if (compLeftWords && compLeftWords.length > 0) {
      gsap.set([compLeftWords, compRightWords], { color: 'rgba(182, 255, 102, 0.22)', opacity: 0.35 });
    }

    // Tag (03 PRODUCTS) starts ready or reveals first upon reaching the screen
    if (introTag) gsap.set(introTag, { opacity: 0, y: 16 });
    // Text words start dim and un-scrubbed, waiting for scroll to scrub through them
    if (introWords && introWords.length > 0) {
      gsap.set(introWords, { color: 'rgba(182, 255, 102, 0.20)', opacity: 0.30 });
    }
    if (introArrow) gsap.set(introArrow, { opacity: 0, scale: 0.8 });

    // --- MASTER TIMELINE (SCENE 1 + SCENE 2 + COMPANION IN ONE CONTINUOUS PIN) ---
    // Perfectly tuned pin distance (+=1050%) and responsive scrub (0.6) so wireframe room is smooth,
    // comfortably readable without dragging or feeling slow, before plunging cleanly into blackness.
    const masterTl = gsap.timeline({
      id: 'wireframe-products-scroll',
      scrollTrigger: {
        id: 'wireframe-products-trigger',
        trigger: masterContainer,
        start: 'top top',
        end: '+=1050%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          targetProgress = self.progress;

          // Track active product index for indicators
          if (self.progress >= 0.36 && self.progress < 0.72) {
            const p = (self.progress - 0.38) / 0.33;
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
        masterTl.to(tag, { opacity: 1, y: 0, duration: 3.5, ease: 'power2.out' }, 3);
        masterTl.to(block1, { opacity: 1, y: 0, duration: 4.5, ease: 'power2.out' }, 6.5);
        masterTl.to(block2, { opacity: 1, y: 0, duration: 4.5, ease: 'power2.out' }, 11.5);
        masterTl.to(block3, { opacity: 1, y: 0, duration: 4.5, ease: 'power2.out' }, 16.5);

        // Keep statements visible while the camera dives deep into the wireframe room
        // They only fade out right as the camera plunges into the pure black screen!
        masterTl.to({}, { duration: 15 }, 21);

        // Statements fade out exactly as the wireframe plunges into the black screen
        masterTl.to([tag, block1, block2, block3], { opacity: 0, y: -25, duration: 5, ease: 'power2.in' }, 36);
      }
    }

    // 2. Cinematic In-Place Transition:
    // Wireframe room stays visible as camera moves forward, then plunges and fades into black (37 to 45).
    // Scene 2 emerges cleanly AFTER pure blackness (at 45+).
    masterTl.to(scene1, { opacity: 0, duration: 7.5, ease: 'power1.inOut' }, 37.5);
    masterTl.set(scene1, { pointerEvents: 'none' }, 45);

    masterTl.fromTo(
      scene2,
      { opacity: 0, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 5.5, ease: 'power2.out' },
      45
    );
    masterTl.set(scene2, { pointerEvents: 'auto' }, 47);

    // Initial state: leftCol (Intro) is interactive, product stage pointer-events handled per slide
    masterTl.set(leftCol, { pointerEvents: 'auto' }, 47);

    // FIRST: Upon reaching the 03 PRODUCTS page, the "03 PRODUCTS" tag emerges into view cleanly
    if (introTag) {
      masterTl.to(introTag, { opacity: 1, y: 0, duration: 3.5, ease: 'power2.out' }, 46);
    }

    // THEN: As the user scrolls, the text animation starts and scrubs word-by-word with the scroll!
    if (introWords && introWords.length > 0) {
      const headingCount = 8; // "The product changes but the experience stays."
      introWords.forEach((word, idx) => {
        const isHeading = idx < headingCount;
        // Text animation starts after reaching the page and scrolling (from 51 upwards)
        const wordStart = isHeading ? 51 + idx * 1.15 : 61 + (idx - headingCount) * 0.65;
        masterTl.to(
          word,
          {
            color: '#b6ff66',
            opacity: 1,
            duration: 1.1,
            ease: 'power1.inOut',
          },
          wordStart
        ).to(
          word,
          {
            color: '#ffffff',
            opacity: 1,
            duration: 1.2,
            ease: 'power1.out',
          },
          wordStart + 0.4
        );
      });
    }

    // Reveal arrow button as text scrub completes
    if (introArrow) {
      masterTl.to(introArrow, { opacity: 1, scale: 1, duration: 2.5, ease: 'back.out(1.5)' }, 72);
    }

    // Rest pause on completed Intro before product 01 slides in
    masterTl.to({}, { duration: 4 }, 73);

    // 4. ANIMATING PRODUCTS & PRODUCT CONTENT TEXTS:
    // Segment 1 (73 -> 84): Intro text fades out past camera, and Product 01 (Nex) fades in at center
    if (leftCol) {
      masterTl.to(
        leftCol,
        {
          scale: 1.15,
          opacity: 0,
          duration: 7,
          ease: 'power2.inOut',
        },
        73
      );
      masterTl.set(leftCol, { pointerEvents: 'none' }, 74);
    }

    // Product 01 fades in at center (scale 0.92 -> 1, opacity 0 -> 1)
    if (panels[0]) {
      masterTl.fromTo(
        panels[0],
        {
          scale: 0.92,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 1,
        },
        {
          scale: 1,
          opacity: 1,
          pointerEvents: 'auto',
          zIndex: 10,
          duration: 7.5,
          ease: 'power2.out',
        },
        74.5
      );
    }

    // Stagger Product 01 content texts (step, title, description, specs, explore CTA)
    const slide0Texts = panels[0]?.querySelectorAll<HTMLElement>('[data-text-anim]');
    if (slide0Texts && slide0Texts.length > 0) {
      masterTl.to(
        slide0Texts,
        {
          opacity: 1,
          y: 0,
          duration: 5,
          stagger: 0.6,
          ease: 'power2.out',
        },
        76
      );
    }

    // Rest on Product 01
    masterTl.to({}, { duration: 3.5 }, 83);

    // Segments 2, 3, 4: Smooth In-Place Crossfade/Zoom Between Products (stay in center, no side-to-side)
    const stepTimes = [
      { start: 85, textStart: 88, rest: 94 }, // Prod 01 -> Prod 02 (HMS)
      { start: 95, textStart: 98, rest: 104 }, // Prod 02 -> Prod 03 (Vision)
      { start: 105, textStart: 108, rest: 113 }, // Prod 03 -> Prod 04 (Simulator)
    ];

    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const times = stepTimes[i];
      if (!prev || !next || !times) continue;

      // Current product smoothly fades out at center (scale 1 -> 1.12, opacity 1 -> 0)
      masterTl.to(
        prev,
        {
          scale: 1.12,
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none',
          duration: 7,
          ease: 'power2.inOut',
        },
        times.start
      );

      // Next product smoothly fades in at center (scale 0.92 -> 1, opacity 0 -> 1)
      masterTl.fromTo(
        next,
        {
          scale: 0.92,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 2,
        },
        {
          scale: 1,
          opacity: 1,
          pointerEvents: 'auto',
          zIndex: 10,
          duration: 7.5,
          ease: 'power2.out',
        },
        times.start + 1.2
      );

      // Next product content texts stagger in cleanly
      const nextTexts = next.querySelectorAll<HTMLElement>('[data-text-anim]');
      if (nextTexts && nextTexts.length > 0) {
        masterTl.to(
          nextTexts,
          {
            opacity: 1,
            y: 0,
            duration: 5,
            stagger: 0.6,
            ease: 'power2.out',
          },
          times.textStart
        );
      }

      // Rest on product
      masterTl.to({}, { duration: 3.5 }, times.rest);
    }

    // Segment 5 (115 -> 163): Transition from Product 04 directly to 04 COMPANION in-place!
    // Product 04 smoothly fades out at center (scale 1 -> 1.12, opacity 1 -> 0)
    const prod4 = panels[3];
    if (prod4) {
      masterTl.to(
        prod4,
        {
          scale: 1.12,
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none',
          duration: 7,
          ease: 'power2.inOut',
        },
        115
      );
    }

    // 04 Companion slide smoothly fades in at center (scale 0.92 -> 1, opacity 0 -> 1)
    if (companionSlide) {
      masterTl.fromTo(
        companionSlide,
        {
          scale: 0.92,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 2,
        },
        {
          scale: 1,
          opacity: 1,
          pointerEvents: 'auto',
          zIndex: 20,
          duration: 7.5,
          ease: 'power2.out',
        },
        116.2
      );
    }

    // Companion Left Heading ("Meet the drava companion.") Word Scrub Animation
    if (compHeadingWords && compHeadingWords.length >= 3) {
      // "Meet"
      masterTl.to(
        compHeadingWords[0],
        { color: '#b6ff66', opacity: 1, duration: 1.0, ease: 'power1.inOut' },
        122
      ).to(
        compHeadingWords[0],
        { color: '#ffffff', opacity: 1, duration: 1.1, ease: 'power1.out' },
        122.4
      );

      // "the"
      masterTl.to(
        compHeadingWords[1],
        { color: '#b6ff66', opacity: 1, duration: 1.0, ease: 'power1.inOut' },
        123.2
      ).to(
        compHeadingWords[1],
        { color: '#ffffff', opacity: 1, duration: 1.1, ease: 'power1.out' },
        123.6
      );

      // "drava" green badge pops into full brilliance
      if (compBadge) {
        masterTl.to(
          compBadge,
          {
            opacity: 1,
            scale: 1,
            filter: 'grayscale(0)',
            duration: 1.2,
            ease: 'back.out(1.4)',
          },
          124.4
        );
      }

      // "companion."
      masterTl.to(
        compHeadingWords[2],
        { color: '#b6ff66', opacity: 1, duration: 1.1, ease: 'power1.inOut' },
        125.6
      ).to(
        compHeadingWords[2],
        { color: '#ffffff', opacity: 1, duration: 1.2, ease: 'power1.out' },
        126.1
      );
    }

    // Companion Left Subheading Words Scrub (green -> white)
    if (compLeftWords && compLeftWords.length > 0) {
      compLeftWords.forEach((w, idx) => {
        const startT = 127 + idx * 0.45;
        masterTl.to(
          w,
          {
            color: '#b6ff66',
            opacity: 1,
            duration: 0.8,
            ease: 'power1.inOut',
          },
          startT
        ).to(
          w,
          {
            color: '#ffffff',
            opacity: 1,
            duration: 0.9,
            ease: 'power1.out',
          },
          startT + 0.3
        );
      });
    }

    // Companion Right Points & Dividers Sequential Progression
    let pointTime = 142;
    // Reveal top divider line (Line 0 of 4)
    if (compDividers && compDividers[0]) {
      masterTl.to(
        compDividers[0],
        {
          scaleX: 1,
          duration: 2.2,
          ease: 'power2.out',
        },
        pointTime
      );
      pointTime += 2.5;
    }

    if (compListItems) {
      compListItems.forEach((li, idx) => {
        // Point item slides up & fades in
        masterTl.to(
          li,
          {
            y: 0,
            opacity: 1,
            duration: 2.8,
            ease: 'power2.out',
          },
          pointTime
        );

        // Words inside this point scrub from green to pure white
        const itemWords = li.querySelectorAll<HTMLElement>('.w-scrub');
        itemWords.forEach((rw, widx) => {
          const wStart = pointTime + 0.8 + widx * 0.35;
          masterTl.to(
            rw,
            {
              color: '#b6ff66',
              opacity: 1,
              duration: 0.7,
              ease: 'power1.inOut',
            },
            wStart
          ).to(
            rw,
            {
              color: '#ffffff',
              opacity: 1,
              duration: 0.8,
              ease: 'power1.out',
            },
            wStart + 0.25
          );
        });

        // The dividing line below this point draws across (Lines 1, 2, 3)
        const bottomLine = compDividers && compDividers[idx + 1];
        if (bottomLine) {
          masterTl.to(
            bottomLine,
            {
              scaleX: 1,
              duration: 2.2,
              ease: 'power2.out',
            },
            pointTime + 2.8
          );
        }

        pointTime += 6.5;
      });
    }

    // Settle/rest on Companion section at the end of the pin
    masterTl.to({}, { duration: 4 }, pointTime);

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
      if (dist <= 0.05) return [0, 0, 0, false];

      const fov = Math.min(width, height) * 0.85;
      const projX = width / 2 + (x1 / dist) * fov;
      const projY = height / 2 + (y2 / dist) * fov;

      return [projX, projY, dist, true];
    };

    // Clip 3D line against near camera plane (NEAR = 0.12) to prevent lines from abruptly disappearing
    const projectAndClipLine = (
      p1: [number, number, number],
      p2: [number, number, number],
      rotX: number,
      rotY: number,
      cameraZ: number
    ): [number, number, number, number] | null => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Transform p1
      const x1_1 = p1[0] * cosY - p1[2] * sinY;
      const z1_1 = p1[2] * cosY + p1[0] * sinY;
      const y2_1 = p1[1] * cosX - z1_1 * sinX;
      const z2_1 = z1_1 * cosX + p1[1] * sinX;
      let dist1 = z2_1 + cameraZ;
      let cx1 = x1_1;
      let cy1 = y2_1;

      // Transform p2
      const x1_2 = p2[0] * cosY - p2[2] * sinY;
      const z1_2 = p2[2] * cosY + p2[0] * sinY;
      const y2_2 = p2[1] * cosX - z1_2 * sinX;
      const z2_2 = z1_2 * cosX + p2[1] * sinX;
      let dist2 = z2_2 + cameraZ;
      let cx2 = x1_2;
      let cy2 = y2_2;

      const NEAR = 0.12;
      if (dist1 < NEAR && dist2 < NEAR) return null;

      if (dist1 < NEAR) {
        const u = (NEAR - dist1) / (dist2 - dist1);
        cx1 = cx1 + u * (cx2 - cx1);
        cy1 = cy1 + u * (cy2 - cy1);
        dist1 = NEAR;
      } else if (dist2 < NEAR) {
        const u = (NEAR - dist2) / (dist1 - dist2);
        cx2 = cx2 + u * (cx1 - cx2);
        cy2 = cy2 + u * (cy1 - cy2);
        dist2 = NEAR;
      }

      const fov = Math.min(width, height) * 0.85;
      const px1 = width / 2 + (cx1 / dist1) * fov;
      const py1 = height / 2 + (cy1 / dist1) * fov;
      const px2 = width / 2 + (cx2 / dist2) * fov;
      const py2 = height / 2 + (cy2 / dist2) * fov;

      return [px1, py1, px2, py2];
    };

    const render = () => {
      scrollProgress += (targetProgress - scrollProgress) * 0.12;
      currRotY += (targetRotY - currRotY) * 0.05;
      currRotX += (targetRotX - currRotX) * 0.05;

      // Scale scrollProgress to Scene 1's domain (0 to 0.28)
      const scene1Prog = Math.min(1, Math.max(0, scrollProgress / 0.28));

      // Morph factor for wireframe assembly
      const morphFactor = Math.min(1, Math.max(0, scene1Prog * 4.0));

      // Smooth camera glide through the wireframe room
      let cameraZ = 2.8 - scene1Prog * 1.8;
      let cameraPitch = currRotX - scene1Prog * 0.12;
      let diveFade = 1;

      // Camera advances forward through the room, then deep plunges into pure black screen
      if (scene1Prog > 0.70) {
        const diveProgress = (scene1Prog - 0.70) / 0.30;
        cameraZ -= diveProgress * diveProgress * 8.5;
        // Fades seamlessly to complete black level as camera penetrates deep into the room
        diveFade = Math.max(0, 1 - Math.pow(diveProgress, 1.25) * 1.05);
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
            const clipped = projectAndClipLine(line.p1, line.p2, cameraPitch, cameraYaw, cameraZ);
            if (clipped) {
              const [px1, py1, px2, py2] = clipped;
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
                <span className="font-display inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-2.5 sm:px-3 py-0.5 rounded-[5px] tracking-normal align-middle whitespace-nowrap shadow-none leading-tight ml-1 text-[0.88em]">
                  drava
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
        <div className="relative flex-1 flex flex-col items-center justify-center w-full h-full">
          {/* CENTER INTRO: 03 PRODUCTS Intro Stage */}
          <div
            data-left-col
            className="relative z-20 flex flex-col justify-between h-full p-4 sm:p-8 lg:p-12 w-full max-w-[95vw] 2xl:max-w-[1550px] mx-auto will-change-transform items-center"
          >
            {/* Top Tag: 03 PRODUCTS (Centered and lowered slightly) */}
            <div data-intro-tag className="pt-6 sm:pt-10 lg:pt-14 will-change-transform">
              <div className="inline-flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                  03
                </span>
                <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
                  PRODUCTS
                </span>
              </div>
            </div>

            {/* Main Content with Animated WordScrub (Centered) */}
            <div className="my-auto py-6 max-w-4xl mx-auto flex flex-col items-center">
              <h2 className="font-display text-[clamp(2.4rem,2.5rem+3vw,5.2rem)] font-bold tracking-tight leading-[1.08] text-white text-center">
                <WordScrub
                  as="span"
                  className="leading-[1.08] text-center"
                  text="The product changes but the experience stays."
                />
              </h2>

              <div className="mt-8 text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-[50ch] font-normal text-center mx-auto">
                <WordScrub
                  as="p"
                  className="leading-relaxed text-center"
                  text="Four intelligent systems engineered to unify every environment. One cohesive OS connecting hardware, spaces, and digital workflows."
                />
              </div>
            </div>

            {/* Bottom Forward Arrow Button: Advance directly to 01 Product */}
            <div className="pb-6 sm:pb-10 lg:pb-14">
              <button
                data-intro-arrow
                type="button"
                onClick={() => {
                  const st = ScrollTrigger.getById('wireframe-products-trigger');
                  if (st) {
                    const targetScroll = st.start + (st.end - st.start) * 0.58;
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
                    <div className="relative aspect-[16/9] w-[330px] sm:w-[450px] md:w-[520px] lg:w-[500px] xl:w-[590px] 2xl:w-[680px] max-h-[60vh] rounded-2xl border-2 border-white/20 bg-[#0a0c0e] overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(255,255,255,0.06)] group">
                      <TransitionLink
                        href={`/applications/${slugOf(app)}`}
                        className="relative w-full h-full block cursor-pointer overflow-hidden group/link"
                        aria-label={`View ${app.name} details`}
                      >
                        <Image
                          src={app.image}
                          alt={app.name}
                          fill
                          quality={100}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                          className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                        />

                        {/* Hover Overlay: appears smoothly when hovering product image */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10 backdrop-blur-[2px] pointer-events-none">
                          <span className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/30 bg-black/80 px-6 text-small font-semibold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 group-hover:border-[#b6ff66] group-hover:bg-[#b6ff66] group-hover:text-[#000000] transform translate-y-2 group-hover:translate-y-0">
                            <span>View {app.name}</span>
                            <Arrow className="size-3.5 -rotate-45" />
                          </span>
                        </div>
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

                    {/* Explore CTA: aligned flush with the left boundary of the specs lines and text */}
                    <div data-text-anim className="pt-2 will-change-transform">
                      <TransitionLink
                        href={`/applications/${slugOf(app)}`}
                        className="group/cta inline-flex min-h-11 w-fit cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-6 text-small font-semibold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 hover:!border-[#b6ff66] hover:!bg-[#b6ff66] hover:!text-[#000000]"
                      >
                        <span className="text-current">Explore {app.name}</span>
                        <Arrow className="size-3.5 -rotate-45 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 text-current" />
                      </TransitionLink>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 04 COMPANION SLIDE: Appears seamlessly after 4th product with the same centered in-place transition */}
            <div
              data-companion-slide
              className="absolute inset-0 flex flex-col justify-between py-12 lg:py-16 will-change-transform pointer-events-none z-40 bg-black"
            >
              {/* TOP BAR: 04 COMPANION TAG (aligned with global layout grid and positioned nicely down) */}
              <div className="wrap w-full pt-4 sm:pt-6 lg:pt-8 px-gutter">
                <div className="inline-flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                    04
                  </span>
                  <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
                    COMPANION
                  </span>
                </div>
              </div>

              {/* MAIN CONTENT GRID */}
              <div className="wrap w-full flex min-h-[60vh] flex-col justify-center my-auto px-gutter mx-auto">
                <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
                  
                  {/* LEFT SIDE: TWO-LINE HEADLINE & SUBHEADING */}
                  <div data-comp-left className="lg:col-span-7 flex flex-col justify-center">
                    <h2 className="font-display text-[clamp(2.4rem,1.9rem+2.8vw,4.6rem)] font-bold tracking-tight leading-[1.15] text-white">
                      <span className="block text-white">
                        <span className="w-scrub inline">Meet</span>{' '}
                        <span className="w-scrub inline">the</span>{' '}
                        <span className="w-comp-badge font-display inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-3 sm:px-5 py-0.5 sm:py-1 rounded-[6px] sm:rounded-[8px] tracking-normal whitespace-nowrap shadow-none align-baseline">
                          drava
                        </span>
                      </span>
                      <span className="block mt-2 text-white">
                        <span className="w-scrub inline">companion.</span>
                      </span>
                    </h2>

                    {/* Subheading with scroll WordScrub */}
                    <div className="mt-6 max-w-[50ch] text-[clamp(0.92rem,0.88rem+0.25vw,1.06rem)] leading-relaxed text-[#c8ccd6]">
                      <WordScrub
                        as="p"
                        className="leading-relaxed"
                        text="Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges products and guides zero-friction workflows in real time."
                      />
                    </div>
                  </div>

                  {/* RIGHT SIDE: 3 NUMBERED POINTS OFFSET DOWN FOR ASYMMETRICAL BALANCE */}
                  <div
                    data-comp-right
                    className="lg:col-span-5 flex flex-col justify-center pt-8 sm:pt-14 lg:pt-80 xl:pt-96 2xl:pt-[26rem] pointer-events-auto"
                  >
                    <ol className="border-none">
                      {/* Divider Line 0 (top line above Point 01) */}
                      <div
                        data-point-divider
                        className="w-full h-[1px] bg-white/10 origin-left"
                      />

                      {COMPANION_ITEMS.map((item, idx) => (
                        <div key={item}>
                          <li
                            data-point-item
                            className="py-5 sm:py-6 flex items-baseline gap-4 sm:gap-5 group transition-colors duration-300 cursor-default"
                          >
                            <span className="inline-flex items-center justify-center font-mono text-xs font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-white/10 text-white/80 group-hover:bg-[#b6ff66] group-hover:text-black transition-colors duration-300 select-none">
                              0{idx + 1}
                            </span>
                            <div className="font-display text-[clamp(1.05rem,0.95rem+0.4vw,1.35rem)] font-semibold tracking-tight text-[#f0f2f5] leading-snug group-hover:text-[#b6ff66] transition-colors duration-300">
                              <WordScrub as="span" text={item} />
                            </div>
                          </li>

                          {/* Divider Line below this point */}
                          <div
                            data-point-divider
                            className="w-full h-[1px] bg-white/10 origin-left"
                          />
                        </div>
                      ))}
                    </ol>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
