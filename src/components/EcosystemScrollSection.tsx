'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { ScrollTrigger } from '@/lib/gsap';

// Unified Drava Logo Green Accent (#b6ff66)
const logoGreenTheme = {
  primary: '#b6ff66',
  subtext: 'rgba(182, 255, 102, 0.85)',
  border: 'rgba(182, 255, 102, 0.35)',
  bgFaint: 'rgba(182, 255, 102, 0.08)',
};

export function EcosystemScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Stage 0: Fullscreen Intro ("The room changes, the experience stays.")
  // Stage 1..4: Products 01 to 04 enter from right side outside of page
  const [activeStage, setActiveStage] = useState(0);

  const apps = applications.slice(0, 4);
  const totalStages = apps.length + 1; // 0 = Intro, 1..4 = Products

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Pin the section: Stage 0 is fullscreen intro, scroll sends intro to left and brings 1st product from right
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${totalStages * 110}%`,
      pin: true,
      scrub: 0.7,
      onUpdate: (self) => {
        const stage = Math.min(
          totalStages - 1,
          Math.floor(self.progress * totalStages)
        );
        setActiveStage(stage);
      },
    });

    return () => {
      st.kill();
    };
  }, [totalStages]);

  const hasEnteredProducts = activeStage > 0;
  const currentAppIndex = hasEnteredProducts ? activeStage - 1 : 0;

  return (
    <section
      ref={containerRef}
      id="applications"
      className="relative z-20 min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between overflow-hidden"
    >
      <div className="relative flex-1 w-full h-screen overflow-hidden">
        
        {/* STAGE 0: FULLSCREEN INTRO (Headline, 2-line subheading & tag in white, no vertical line) */}
        <div
          className={`absolute inset-0 flex flex-col justify-between p-6 sm:p-12 lg:p-20 z-20 select-none transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            activeStage === 0
              ? 'translate-x-0 opacity-100 scale-100 pointer-events-auto'
              : '-translate-x-[110%] opacity-0 scale-95 pointer-events-none'
          }`}
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
          <div className="my-auto py-6 max-w-5xl">
            {/* Main Headline in White */}
            <h2 className="font-display text-[clamp(3.2rem,2.5rem+4.5vw,7.5rem)] font-bold uppercase tracking-tight leading-[1.02] text-white">
              The room changes,
              <br />
              the experience stays.
            </h2>

            {/* 2-Line Subheading in White */}
            <p className="mt-8 text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-[44ch] font-normal">
              Four intelligent systems engineered to unify every environment.
              <br className="hidden sm:inline" />
              One cohesive OS connecting hardware, spaces, and digital workflows.
            </p>

            {/* Scroll Cue */}
            <div className="mt-10 flex items-center gap-3 text-xs sm:text-sm font-mono tracking-wider text-white/50">
              <span className="text-[#b6ff66]">●</span>
              <span>SCROLL TO EXPLORE PRODUCTS</span>
              <span className="text-[#b6ff66]">→</span>
            </div>
          </div>

          {/* Bottom Forward Arrow */}
          <div className="pt-4">
            <TransitionLink
              href="/applications"
              aria-label="Explore all products"
              style={{
                borderColor: logoGreenTheme.border,
                backgroundColor: logoGreenTheme.bgFaint,
                color: logoGreenTheme.primary,
              }}
              className="group inline-flex items-center justify-center size-16 rounded-full border transition-all duration-300 hover:scale-105 hover:bg-[#b6ff66] hover:text-black"
            >
              <Arrow className="size-7 text-white group-hover:text-black transition-colors duration-300 group-hover:translate-x-1" />
            </TransitionLink>
          </div>
        </div>

        {/* STAGES 1..4: PRODUCTS STAGE (Enters from right side outside of page when scrolling) */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hasEnteredProducts
              ? 'translate-x-0 opacity-100 pointer-events-auto'
              : 'translate-x-[110%] opacity-0 pointer-events-none'
          }`}
        >
          {apps.map((app, i) => {
            const isActive = hasEnteredProducts && i === currentAppIndex;
            const isPrev = hasEnteredProducts && i < currentAppIndex;

            return (
              <div
                key={app.id}
                data-app-panel
                className={`absolute inset-0 flex items-center justify-center p-6 sm:p-10 lg:p-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'translate-x-0 opacity-100 scale-100 pointer-events-auto z-10'
                    : isPrev
                    ? '-translate-x-[110%] opacity-0 scale-95 pointer-events-none z-0'
                    : 'translate-x-[110%] opacity-0 scale-95 pointer-events-none z-0'
                }`}
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
                  <div className="flex flex-col justify-center text-left space-y-6 max-w-[420px] shrink-0">
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
            );
          })}
        </div>

        {/* Floating Right Pagination Indicators (visible in product stages) */}
        {hasEnteredProducts && (
          <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 pointer-events-none">
            {apps.map((_, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: i === currentAppIndex ? logoGreenTheme.primary : 'rgba(255, 255, 255, 0.2)',
                  height: i === currentAppIndex ? '28px' : '6px',
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
