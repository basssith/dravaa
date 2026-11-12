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

    // Slide 0: Initially present on screen with number 01 centered in right side
    const slide0Num = panels[0].querySelector<HTMLElement>('[data-flow-num]');
    const slide0Img = panels[0].querySelector<HTMLElement>('[data-flow-img]');
    const slide0Details = panels[0].querySelector<HTMLElement>('[data-flow-details]');

    const isDesktop = window.innerWidth >= 1024;
    const initialCenterX = isDesktop ? 260 : 0;

    gsap.set(panels[0], { xPercent: 0, opacity: 1, pointerEvents: 'auto' });
    if (slide0Num) gsap.set(slide0Num, { x: initialCenterX, scale: 1.15, opacity: 1 });
    if (slide0Img) gsap.set(slide0Img, { x: 260, opacity: 0 });
    if (slide0Details) gsap.set(slide0Details, { x: 300, opacity: 0 });

    for (let i = 1; i < panels.length; i++) {
      gsap.set(panels[i], { xPercent: 125, opacity: 0, pointerEvents: 'none' });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${panels.length * 150}%`,
        pin: true,
        scrub: 1.2, // Continuous, buttery smooth flow linked to scrollwheel
        onUpdate: (self) => {
          const idx = Math.min(
            panels.length - 1,
            Math.floor(self.progress * panels.length)
          );
          setActiveIdx(idx);
        },
      },
    });

    // 1. Initial Flow for Product 01: 01 glides smoothly from center to docked position,
    // and monitor & details glide in from right side to join it
    if (slide0Num && slide0Img && slide0Details) {
      tl.to(
        slide0Num,
        { x: 0, scale: 1, duration: 1.3, ease: 'power1.inOut' },
        'p0-in'
      );
      tl.to(
        slide0Img,
        { x: 0, opacity: 1, duration: 1.3, ease: 'power1.out' },
        'p0-in+=0.15'
      );
      tl.to(
        slide0Details,
        { x: 0, opacity: 1, duration: 1.3, ease: 'power1.out' },
        'p0-in+=0.25'
      );
    }

    // Resting pause on Product 01 so user can view it comfortably
    tl.to({}, { duration: 0.8 });

    // 2. Subsequent products flow:
    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const nextNum = next.querySelector<HTMLElement>('[data-flow-num]');
      const nextImg = next.querySelector<HTMLElement>('[data-flow-img]');
      const nextDetails = next.querySelector<HTMLElement>('[data-flow-details]');
      const step = `step-${i + 1}`;

      // Current slide glides smoothly out to the left
      tl.to(
        prev,
        {
          xPercent: -125,
          opacity: 0,
          pointerEvents: 'none',
          duration: 1.5,
          ease: 'power1.inOut',
        },
        step
      );

      // Next slide enters from the right
      tl.fromTo(
        next,
        { xPercent: 125, opacity: 0, pointerEvents: 'none' },
        {
          xPercent: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 1.5,
          ease: 'power1.inOut',
        },
        step
      );

      // Staggered internal flow for the next slide's number, image, and details
      if (nextNum) {
        tl.fromTo(
          nextNum,
          { opacity: 0.3, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power1.out' },
          `${step}+=0.15`
        );
      }
      if (nextImg) {
        tl.fromTo(
          nextImg,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power1.out' },
          `${step}+=0.25`
        );
      }
      if (nextDetails) {
        tl.fromTo(
          nextDetails,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power1.out' },
          `${step}+=0.35`
        );
      }

      // Resting pause on current product
      tl.to({}, { duration: 0.8 });
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
      <div className="relative flex-1 flex flex-col lg:flex-row w-full h-screen">
        
        {/* LEFT COLUMN: Pinned Content with single vertical green line */}
        <div className="w-full lg:w-[42%] xl:w-[38%] h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-20 bg-[#000000] border-b lg:border-b-0 lg:border-r border-[#b6ff66]/40 select-none">
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

          {/* Centered Main Content: 3-line heading in Sentence Case */}
          <div className="my-auto py-4 max-w-xl">
            <h2 className="font-display text-[clamp(2.5rem,2rem+3vw,4.8rem)] font-bold tracking-tight leading-[1.04] text-white">
              <span className="block">The product</span>
              <span className="block">changes,</span>
              <span className="block">the experience stays.</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-[40ch] font-normal">
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

        {/* RIGHT COLUMN: Flowing Animated Products Stage (01 starts in center, flows with scroll) */}
        <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {apps.map((app, i) => (
            <div
              key={app.id}
              data-product-slide
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 will-change-transform"
            >
              {/* Product Layout: Number + Terminal Monitor Image + Details */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-14 w-full max-w-5xl">
                
                {/* 1. NUMBER INDICATOR (Centered initially for 01, flows smoothly on scroll) */}
                <div data-flow-num className="flex flex-col items-center lg:items-start select-none shrink-0 will-change-transform">
                  <span
                    style={{ color: logoGreenTheme.primary }}
                    className="font-display font-black text-[clamp(6rem,10vw,14rem)] leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(182,255,102,0.18)]"
                  >
                    0{i + 1}
                  </span>
                </div>

                {/* 2. CENTER: Terminal Monitor Screen (flows in from right on scroll) */}
                <div data-flow-img className="shrink-0 flex justify-center items-center will-change-transform">
                  <div
                    style={{
                      borderColor: logoGreenTheme.border,
                      boxShadow: `0 0 60px ${logoGreenTheme.bgFaint}`,
                    }}
                    className="relative aspect-[9/15] w-[230px] sm:w-[260px] xl:w-[290px] max-h-[62vh] rounded-2xl border-2 bg-[#0a0c0e] overflow-hidden p-3.5 flex flex-col justify-between"
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

                {/* 3. RIGHT: Product Details & Specifications in Sentence Case */}
                <div data-flow-details className="flex flex-col justify-center text-left space-y-4 max-w-[340px] shrink-0 will-change-transform">
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
