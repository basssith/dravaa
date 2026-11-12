'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { gsap, ScrollTrigger } from '@/lib/gsap';

// Unified Drava Logo Green Accent (#b6ff66)
const logoGreenTheme = {
  primary: '#b6ff66',
  subtext: 'rgba(182, 255, 102, 0.85)',
  border: 'rgba(182, 255, 102, 0.40)',
  bgFaint: 'rgba(182, 255, 102, 0.08)',
};

export function EcosystemScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const apps = applications.slice(0, 4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = container.querySelectorAll<HTMLElement>('[data-product-slide]');
    if (panels.length === 0) return;

    // LEFT SIDE: Intro Column that occupies 60% initially and slides out left
    const leftCol = container.querySelector<HTMLElement>('[data-left-col]');
    const rightCol = container.querySelector<HTMLElement>('[data-right-stage]');

    // Slide 0 elements
    const slide0Num = panels[0].querySelector<HTMLElement>('[data-flow-num]');
    const slide0Img = panels[0].querySelector<HTMLElement>('[data-flow-img]');
    const slide0Details = panels[0].querySelector<HTMLElement>('[data-flow-details]');

    const isDesktop = window.innerWidth >= 1024;
    // Initial right position of 01: centered nicely inside the right 40% area
    // In panels[0], the contents are centered at 50vw. The 40% column center is at 80vw.
    // So shifting 01 by +30vw places it squarely in the middle of the right side.
    const initialCenterX = isDesktop ? window.innerWidth * 0.30 : 0;

    // Slide 0 setup:
    gsap.set(panels[0], { xPercent: 0, opacity: 1, pointerEvents: 'auto' });
    if (slide0Num) gsap.set(slide0Num, { x: initialCenterX, scale: 1.1, opacity: 1 });
    if (slide0Img) gsap.set(slide0Img, { x: 300, opacity: 0 });
    if (slide0Details) gsap.set(slide0Details, { x: 350, opacity: 0 });

    for (let i = 1; i < panels.length; i++) {
      gsap.set(panels[i], { xPercent: 100, opacity: 0, pointerEvents: 'none' });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${panels.length * 150}%`,
        pin: true,
        scrub: 0.6, // Low scrub duration = snappy, immediate, zero lag
        onUpdate: (self) => {
          const idx = Math.min(
            panels.length - 1,
            Math.floor(self.progress * panels.length)
          );
          setActiveIdx(idx);
        },
      },
    });

    // STEP 1: Intro exit & Product 01 entrance
    // Left column content slides smoothly out to the left
    if (leftCol) {
      tl.to(
        leftCol,
        {
          xPercent: -105,
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
        },
        'p0'
      );
    }

    // Number 01 glides from the right side into its centered product position
    if (slide0Num) {
      tl.to(
        slide0Num,
        { x: 0, scale: 1, duration: 1, ease: 'power2.inOut' },
        'p0'
      );
    }

    // Monitor image and specs glide in from the right to complete Product 01 full view
    if (slide0Img) {
      tl.to(
        slide0Img,
        { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
        'p0+=0.15'
      );
    }
    if (slide0Details) {
      tl.to(
        slide0Details,
        { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
        'p0+=0.25'
      );
    }

    // Resting pause for Product 01
    tl.to({}, { duration: 0.5 });

    // STEP 2: Subsequent products transition seamlessly across the full screen
    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const nextNum = next.querySelector<HTMLElement>('[data-flow-num]');
      const nextImg = next.querySelector<HTMLElement>('[data-flow-img]');
      const nextDetails = next.querySelector<HTMLElement>('[data-flow-details]');
      const step = `step-${i + 1}`;

      // Current slide glides out left
      tl.to(
        prev,
        {
          xPercent: -100,
          opacity: 0,
          pointerEvents: 'none',
          duration: 1,
          ease: 'power2.inOut',
        },
        step
      );

      // Next slide glides in from right
      tl.fromTo(
        next,
        { xPercent: 100, opacity: 0, pointerEvents: 'none' },
        {
          xPercent: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 1,
          ease: 'power2.inOut',
        },
        step
      );

      // Snappy, clean inner entrance for the next slide's components
      if (nextNum) {
        tl.fromTo(
          nextNum,
          { opacity: 0.4, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
          `${step}+=0.1`
        );
      }
      if (nextImg) {
        tl.fromTo(
          nextImg,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          `${step}+=0.15`
        );
      }
      if (nextDetails) {
        tl.fromTo(
          nextDetails,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          `${step}+=0.2`
        );
      }

      // Resting pause on current product
      tl.to({}, { duration: 0.5 });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [apps.length]);

  return (
    <section
      ref={containerRef}
      id="applications"
      className="relative z-20 min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between overflow-hidden"
    >
      <div className="relative flex-1 w-full h-screen overflow-hidden">
        
        {/* LEFT COLUMN: 60% Width Intro Content with single vertical green line that glides out left on scroll */}
        <div
          data-left-col
          className="absolute left-0 top-0 w-full lg:w-[60%] h-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 xl:p-20 z-20 bg-[#000000] border-b lg:border-b-0 lg:border-r border-[#b6ff66]/40 select-none will-change-transform"
        >
          {/* Top Tag: Green Box for 03 & White Text in Sentence Case */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2.5 border border-white/20 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                03
              </span>
              <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold pr-1">
                The products
              </span>
            </div>
          </div>

          {/* Centered Main Content: Prominent 3-line heading in Sentence Case */}
          <div className="my-auto py-6 max-w-3xl">
            <h2 className="font-display text-[clamp(2.8rem,3rem+4vw,6.5rem)] font-bold tracking-tight leading-[1.02] text-white">
              <span className="block">The product</span>
              <span className="block">changes,</span>
              <span className="block">the experience stays.</span>
            </h2>

            <p className="mt-8 text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-[48ch] font-normal">
              Four intelligent systems engineered to unify every environment.
              <br className="hidden sm:inline" />
              One cohesive OS connecting hardware, spaces, and digital workflows.
            </p>
          </div>

          {/* Bottom Forward Arrow Button */}
          <div className="pb-2">
            <TransitionLink
              href="/applications"
              aria-label="Explore all products"
              style={{
                borderColor: logoGreenTheme.border,
                backgroundColor: logoGreenTheme.bgFaint,
                color: logoGreenTheme.primary,
              }}
              className="group inline-flex items-center justify-center size-14 sm:size-16 rounded-full border transition-all duration-300 hover:scale-105 hover:bg-[#b6ff66] hover:text-black"
            >
              <Arrow className="size-6 sm:size-7 text-white group-hover:text-black transition-colors duration-300 group-hover:translate-x-1" />
            </TransitionLink>
          </div>
        </div>

        {/* PRODUCT STAGE: Fixed full-screen container */}
        <div
          data-right-stage
          className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-12 z-10"
        >
          {apps.map((app, i) => (
            <div
              key={app.id}
              data-product-slide
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 lg:p-12 will-change-transform"
            >
              {/* Product Layout: Full Screen Centered Layout (Number + Terminal Monitor Image + Vertical Divider + Details) */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-14 w-full max-w-6xl">
                
                {/* 1. NUMBER INDICATOR */}
                <div data-flow-num className="flex flex-col items-center lg:items-start select-none shrink-0 will-change-transform">
                  <span
                    style={{ color: logoGreenTheme.primary }}
                    className="font-display font-black text-[clamp(5rem,9vw,13rem)] leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(182,255,102,0.22)]"
                  >
                    0{i + 1}
                  </span>
                </div>

                {/* 2. CENTER: Terminal Monitor Screen */}
                <div data-flow-img className="shrink-0 flex justify-center items-center will-change-transform">
                  <div
                    style={{
                      borderColor: logoGreenTheme.border,
                      boxShadow: `0 0 60px ${logoGreenTheme.bgFaint}`,
                    }}
                    className="relative aspect-[9/15] w-[220px] sm:w-[250px] xl:w-[280px] max-h-[62vh] rounded-2xl border-2 bg-[#0a0c0e] overflow-hidden p-3.5 flex flex-col justify-between"
                  >
                    <div
                      style={{ borderColor: logoGreenTheme.border }}
                      className="flex justify-between items-center text-xs font-mono pb-2 border-b"
                    >
                      <span style={{ color: logoGreenTheme.subtext }}>Terminal {app.id}</span>
                      <span style={{ color: logoGreenTheme.primary }}>Live</span>
                    </div>

                    <div className="relative flex-1 w-full my-2.5 rounded-lg overflow-hidden bg-black/60">
                      <Image
                        src={app.image}
                        alt={app.name}
                        fill
                        quality={95}
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>

                    <div
                      style={{ borderColor: logoGreenTheme.border }}
                      className="flex justify-between items-center text-xs font-mono pt-2 border-t"
                    >
                      <span style={{ color: logoGreenTheme.subtext }}>{app.badge}</span>
                      <span style={{ color: logoGreenTheme.primary }}>Fullscreen</span>
                    </div>
                  </div>
                </div>

                {/* VERTICAL GREEN LINE DIVIDER */}
                <div
                  style={{ backgroundColor: 'rgba(182, 255, 102, 0.40)' }}
                  className="hidden lg:block w-[1px] h-[340px] xl:h-[400px] shrink-0 mx-2"
                />

                {/* 3. RIGHT: Product Details & Specifications */}
                <div data-flow-details className="flex flex-col justify-center text-left space-y-4 max-w-[340px] shrink-0 will-change-transform">
                  <h3 className="font-display text-[clamp(2.2rem,2rem+1.8vw,3.6rem)] font-bold leading-none tracking-tight text-white">
                    {app.name}
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed text-[#c8ccd6]">
                    {app.description}
                  </p>

                  <div
                    style={{ borderColor: logoGreenTheme.border }}
                    className="border-t border-b py-3.5 my-1 space-y-2.5"
                  >
                    <div className="flex justify-between text-xs sm:text-sm font-mono">
                      <span style={{ color: logoGreenTheme.subtext }}>Category</span>
                      <span style={{ color: logoGreenTheme.primary }}>{app.badge}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm font-mono">
                      <span style={{ color: logoGreenTheme.subtext }}>System</span>
                      <span style={{ color: logoGreenTheme.primary }}>Drava OS</span>
                    </div>
                  </div>

                  <TransitionLink
                    href={`/applications/${slugOf(app)}`}
                    style={{ color: logoGreenTheme.primary }}
                    className="inline-flex items-center gap-3 text-sm sm:text-base font-semibold tracking-wider transition-colors group pt-1 hover:brightness-125"
                  >
                    <span>Explore {app.name}</span>
                    <Arrow className="size-4 -rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </TransitionLink>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Floating Right Pagination Indicators */}
        <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 pointer-events-none">
          {apps.map((_, i) => (
            <span
              key={i}
              style={{
                backgroundColor: i === activeIdx ? logoGreenTheme.primary : 'rgba(255, 255, 255, 0.2)',
                height: i === activeIdx ? '28px' : '6px',
              }}
              className="w-1.5 rounded-full transition-all duration-300"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
