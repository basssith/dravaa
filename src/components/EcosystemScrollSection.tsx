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
  border: 'rgba(182, 255, 102, 0.35)',
  bgFaint: 'rgba(182, 255, 102, 0.08)',
};

export function EcosystemScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null);

  const apps = applications.slice(0, 4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const intro = container.querySelector<HTMLElement>('[data-intro-panel]');
    const panels = container.querySelectorAll<HTMLElement>('[data-product-panel]');
    if (!intro || panels.length === 0) return;

    // Reset initial states: Intro is visible at center, all products are parked offscreen right
    gsap.set(intro, { xPercent: 0, opacity: 1, pointerEvents: 'auto' });
    panels.forEach((p) => {
      gsap.set(p, { xPercent: 125, opacity: 0, pointerEvents: 'none' });
    });

    const totalSteps = panels.length;

    // Scrubbed timeline: Directly linked to scrollwheel with continuous, smooth momentum
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${(totalSteps + 1) * 150}%`,
        pin: true,
        scrub: 1.2, // Continuous, buttery smooth inertia scrubbing
        onUpdate: (self) => {
          const prog = self.progress;
          // Step determination for pagination dots
          const stepSize = 1 / (totalSteps + 1);
          if (prog < stepSize * 0.7) {
            setActiveProductIndex(null); // On Intro
          } else {
            const idx = Math.min(
              totalSteps - 1,
              Math.floor((prog - stepSize * 0.7) / stepSize)
            );
            setActiveProductIndex(Math.max(0, idx));
          }
        },
      },
    });

    // 1. Initial resting pause for Intro so user can read it comfortably
    tl.to({}, { duration: 0.6 });

    // 2. Continuous Flow: Intro glides smoothly to left outside page (-125%),
    // while Product 01 glides in from right outside page (125% -> 0%)
    tl.to(
      intro,
      {
        xPercent: -125,
        opacity: 0,
        pointerEvents: 'none',
        duration: 1.4,
        ease: 'power1.inOut',
      },
      'flow-0-to-1'
    );
    tl.to(
      panels[0],
      {
        xPercent: 0,
        opacity: 1,
        pointerEvents: 'auto',
        duration: 1.4,
        ease: 'power1.inOut',
      },
      'flow-0-to-1'
    );

    // Resting pause on Product 01 so user can view it
    tl.to({}, { duration: 0.8 });

    // 3. Continuous Flow for remaining products:
    // Prev product glides left (-125%), Next product glides in from right (125% -> 0%)
    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const stepLabel = `flow-${i + 1}-to-${i + 2}`;

      tl.to(
        prev,
        {
          xPercent: -125,
          opacity: 0,
          pointerEvents: 'none',
          duration: 1.4,
          ease: 'power1.inOut',
        },
        stepLabel
      );
      tl.to(
        next,
        {
          xPercent: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 1.4,
          ease: 'power1.inOut',
        },
        stepLabel
      );

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
      <div className="relative flex-1 w-full h-screen overflow-hidden">
        
        {/* STAGE 0: FULLSCREEN INTRO (Headline on 1 line, 2-line subheading & arrow fully visible) */}
        <div
          data-intro-panel
          className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-20 select-none will-change-transform max-h-screen"
        >
          {/* Top Tag */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2.5 border border-white/20 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                03
              </span>
              <span className="font-mono text-xs sm:text-sm tracking-widest text-white uppercase font-semibold pr-1">
                THE PRODUCTS
              </span>
            </div>
          </div>

          {/* Centered Main Content in White */}
          <div className="my-auto py-2 max-w-6xl w-full">
            {/* Single Line Headline: "The product changes, the experience stays." */}
            <h2 className="font-display text-[clamp(1.6rem,1.1rem+2.6vw,3.6rem)] font-bold uppercase tracking-tight leading-tight text-white whitespace-normal lg:whitespace-nowrap">
              The product changes, the experience stays.
            </h2>

            {/* 2-Line Subheading in White */}
            <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-[50ch] font-normal">
              Four intelligent systems engineered to unify every environment.
              <br className="hidden sm:inline" />
              One cohesive OS connecting hardware, spaces, and digital workflows.
            </p>

            {/* Scroll Cue */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3 text-xs sm:text-sm font-mono tracking-wider text-white/50">
              <span className="text-[#b6ff66]">●</span>
              <span>SCROLL TO EXPLORE PRODUCTS</span>
              <span className="text-[#b6ff66]">→</span>
            </div>
          </div>

          {/* Bottom Forward Arrow (Fully Visible) */}
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

        {/* PRODUCTS STAGES (Continuous smooth scrubbed flow from right outside to left outside) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          {apps.map((app, i) => (
            <div
              key={app.id}
              data-product-panel
              className="absolute inset-0 flex items-center justify-center p-6 sm:p-10 lg:p-16 will-change-transform"
            >
              {/* Full-width Product Content Container (No Vertical Line) */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20 w-full max-w-7xl">
                
                {/* 1. MASSIVE NUMBER INDICATOR */}
                <div className="flex flex-col items-center lg:items-start select-none shrink-0">
                  <span
                    style={{ color: logoGreenTheme.primary }}
                    className="font-display font-black text-[clamp(7rem,12vw,17rem)] leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(182,255,102,0.18)]"
                  >
                    0{i + 1}
                  </span>
                </div>

                {/* 2. CENTER: Terminal Monitor Screen */}
                <div className="shrink-0 flex justify-center items-center">
                  <div
                    style={{
                      borderColor: logoGreenTheme.border,
                      boxShadow: `0 0 70px ${logoGreenTheme.bgFaint}`,
                    }}
                    className="relative aspect-[9/15] w-[250px] sm:w-[290px] xl:w-[330px] max-h-[66vh] rounded-2xl border-2 bg-[#0a0c0e] overflow-hidden p-3.5 flex flex-col justify-between"
                  >
                    {/* Top Bar */}
                    <div
                      style={{ borderColor: logoGreenTheme.border }}
                      className="flex justify-between items-center text-xs font-mono pb-2.5 border-b uppercase"
                    >
                      <span style={{ color: logoGreenTheme.subtext }}>
                        TERMINAL {app.id}
                      </span>
                      <span style={{ color: logoGreenTheme.primary }}>
                        LIVE
                      </span>
                    </div>

                    {/* Image Preview */}
                    <div className="relative flex-1 w-full my-2.5 rounded-lg overflow-hidden bg-black/60">
                      <Image
                        src={app.image}
                        alt={app.name}
                        fill
                        quality={95}
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>

                    {/* Bottom Bar */}
                    <div
                      style={{ borderColor: logoGreenTheme.border }}
                      className="flex justify-between items-center text-xs font-mono pt-2.5 border-t uppercase"
                    >
                      <span style={{ color: logoGreenTheme.subtext }}>
                        {app.badge}
                      </span>
                      <span style={{ color: logoGreenTheme.primary }}>
                        FULLSCREEN
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. RIGHT: Product Details & Specifications */}
                <div className="flex flex-col justify-center text-left space-y-6 max-w-[420px] shrink-0 pointer-events-auto">
                  {/* Big App Name in White */}
                  <h3 className="font-display text-[clamp(3rem,2.5rem+3vw,5.2rem)] font-bold uppercase leading-none tracking-tight text-white">
                    {app.name}
                  </h3>

                  {/* App Description */}
                  <p className="text-base sm:text-lg leading-relaxed text-[#c8ccd6]">
                    {app.description}
                  </p>

                  {/* Specs / Tags */}
                  <div
                    style={{ borderColor: logoGreenTheme.border }}
                    className="border-t border-b py-4 my-2 space-y-3"
                  >
                    <div className="flex justify-between text-sm sm:text-base font-mono">
                      <span style={{ color: logoGreenTheme.subtext }}>CATEGORY</span>
                      <span style={{ color: logoGreenTheme.primary }}>{app.badge}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-mono">
                      <span style={{ color: logoGreenTheme.subtext }}>SYSTEM</span>
                      <span style={{ color: logoGreenTheme.primary }}>DRAVA OS</span>
                    </div>
                  </div>

                  {/* Explore Link */}
                  <TransitionLink
                    href={`/applications/${slugOf(app)}`}
                    style={{ color: logoGreenTheme.primary }}
                    className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold tracking-wider uppercase transition-colors group pt-2 hover:brightness-125"
                  >
                    <span>Explore {app.name}</span>
                    <Arrow className="size-5 -rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </TransitionLink>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Floating Right Pagination Indicators (visible in product stages) */}
        {activeProductIndex !== null && (
          <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 pointer-events-none">
            {apps.map((_, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: i === activeProductIndex ? logoGreenTheme.primary : 'rgba(255, 255, 255, 0.2)',
                  height: i === activeProductIndex ? '28px' : '6px',
                }}
                className="w-1.5 rounded-full transition-all duration-300"
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
