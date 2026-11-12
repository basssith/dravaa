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

    // Panels start:
    // Panel 0 is visible. In the resting state, only the number 01 is shown,
    // monitor and details are off-screen to the right.
    gsap.set(panels[0], { xPercent: 0, opacity: 1, pointerEvents: 'auto' });
    if (slide0Num) gsap.set(slide0Num, { scale: 1, opacity: 1 });
    if (slide0Img) gsap.set(slide0Img, { x: 350, opacity: 0 });
    if (slide0Details) gsap.set(slide0Details, { x: 450, opacity: 0 });

    for (let i = 1; i < panels.length; i++) {
      gsap.set(panels[i], { xPercent: 120, opacity: 0, pointerEvents: 'none' });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${panels.length * 200}%`,
        pin: true,
        scrub: 1.2, // Silky smooth scroll scrubbing
        onUpdate: (self) => {
          const idx = Math.min(
            panels.length - 1,
            Math.floor(self.progress * panels.length)
          );
          setActiveIdx(idx);
        },
      },
    });

    // 1. Initial Flow on Scroll:
    // Left intro column (60%) slides all the way out to the left
    if (leftCol) {
      tl.to(
        leftCol,
        {
          xPercent: -100,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        'p0-in'
      );
    }

    // Right stage expands to occupy the FULL screen (shifts left from 60% to 0%)
    if (rightCol) {
      tl.to(
        rightCol,
        {
          left: '0%',
          width: '100%',
          duration: 1.5,
          ease: 'power2.inOut',
        },
        'p0-in'
      );
    }

    // Monitor screen and details glide into the center of the full screen to join 01!
    if (slide0Img && slide0Details) {
      tl.to(
        slide0Img,
        { x: 0, opacity: 1, duration: 1.4, ease: 'power2.out' },
        'p0-in+=0.2'
      );
      tl.to(
        slide0Details,
        { x: 0, opacity: 1, duration: 1.4, ease: 'power2.out' },
        'p0-in+=0.3'
      );
    }

    // Resting pause on Product 01 full screen
    tl.to({}, { duration: 1.0 });

    // 2. Subsequent products flow across the FULL SCREEN:
    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const nextNum = next.querySelector<HTMLElement>('[data-flow-num]');
      const nextImg = next.querySelector<HTMLElement>('[data-flow-img]');
      const nextDetails = next.querySelector<HTMLElement>('[data-flow-details]');
      const step = `step-${i + 1}`;

      // Current slide glides smoothly out to the left across the full screen
      tl.to(
        prev,
        {
          xPercent: -120,
          opacity: 0,
          pointerEvents: 'none',
          duration: 1.6,
          ease: 'power2.inOut',
        },
        step
      );

      // Next slide enters smoothly from the right across the full screen
      tl.fromTo(
        next,
        { xPercent: 120, opacity: 0, pointerEvents: 'none' },
        {
          xPercent: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 1.6,
          ease: 'power2.inOut',
        },
        step
      );

      if (nextNum) {
        tl.fromTo(
          nextNum,
          { opacity: 0.4, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
          `${step}+=0.15`
        );
      }
      if (nextImg) {
        tl.fromTo(
          nextImg,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
          `${step}+=0.25`
        );
      }
      if (nextDetails) {
        tl.fromTo(
          nextDetails,
          { x: 120, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
          `${step}+=0.35`
        );
      }

      // Resting pause on current product
      tl.to({}, { duration: 1.0 });
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

        {/* PRODUCT STAGE: Starts at right (left: 60%, width: 40%), then expands to FULL SCREEN (left: 0%, width: 100%) on scroll */}
        <div
          data-right-stage
          className="absolute left-0 lg:left-[60%] top-0 w-full lg:w-[40%] h-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-12 z-10 will-change-[left,width]"
        >
          {apps.map((app, i) => (
            <div
              key={app.id}
              data-product-slide
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 lg:p-12 will-change-transform"
            >
              {/* Product Layout: Full Screen Centered Layout (Number + Terminal Monitor Image + Details) */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20 w-full max-w-6xl">
                
                {/* 1. NUMBER INDICATOR */}
                <div data-flow-num className="flex flex-col items-center lg:items-start select-none shrink-0 will-change-transform">
                  <span
                    style={{ color: logoGreenTheme.primary }}
                    className="font-display font-black text-[clamp(6rem,11vw,16rem)] leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(182,255,102,0.25)]"
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
                    className="relative aspect-[9/15] w-[240px] sm:w-[270px] xl:w-[310px] max-h-[64vh] rounded-2xl border-2 bg-[#0a0c0e] overflow-hidden p-3.5 flex flex-col justify-between"
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

                {/* 3. RIGHT: Product Details & Specifications */}
                <div data-flow-details className="flex flex-col justify-center text-left space-y-4 max-w-[360px] shrink-0 will-change-transform">
                  <h3 className="font-display text-[clamp(2.4rem,2rem+2vw,4rem)] font-bold leading-none tracking-tight text-white">
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
