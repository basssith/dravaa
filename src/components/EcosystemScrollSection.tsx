'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { ScrollTrigger } from '@/lib/gsap';

// Unified Drava Logo Green Theme (#b6ff66) across all products
const logoGreenTheme = {
  primary: '#b6ff66',
  subtext: 'rgba(182, 255, 102, 0.82)',
  border: 'rgba(182, 255, 102, 0.35)',
  bgFaint: 'rgba(182, 255, 102, 0.08)',
};

export function EcosystemScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Stage 0: Fullscreen Intro (Heading & Subheading)
  // Stage 1..4: Products 01 to 04 animate in from right side
  const [activeStage, setActiveStage] = useState(0);

  const apps = applications.slice(0, 4);
  const totalStages = apps.length + 1; // 0 = Intro, 1..4 = Products

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Pin the section: Stage 0 is full screen intro, scrolling brings products one by one from right
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${totalStages * 100}%`,
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
      {/* Main Split Screen Area */}
      <div className="relative flex-1 flex flex-col lg:flex-row w-full h-screen">
        
        {/* LEFT COLUMN: Pinned Heading, Subheading & Forward Arrow */}
        <div
          style={{ borderColor: logoGreenTheme.border }}
          className={`h-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r z-20 bg-[#000000] select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hasEnteredProducts
              ? 'w-full lg:w-[38%] xl:w-[35%]'
              : 'w-full lg:w-[50%] xl:w-[48%]'
          }`}
        >
          {/* Top Tag & Main Content */}
          <div className="my-auto py-6">
            {/* Tag Button: Number has solid greenbox and THE PRODUCTS is in white color */}
            <div className="inline-flex items-center gap-2.5 border border-white/20 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-8 shadow-sm">
              <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                03
              </span>
              <span className="font-mono text-xs sm:text-sm tracking-widest text-white uppercase font-semibold pr-1">
                THE PRODUCTS
              </span>
            </div>

            {/* Main Headline - In Logo Color Green (#b6ff66) */}
            <h2
              style={{ color: logoGreenTheme.primary }}
              className="font-display text-[clamp(2.8rem,2.2rem+3.5vw,5.5rem)] font-bold uppercase tracking-tight leading-[1.02]"
            >
              The Products,
              <br />
              <span>built to scale.</span>
            </h2>

            {/* Subheading */}
            <p
              style={{ color: logoGreenTheme.subtext }}
              className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed max-w-[38ch]"
            >
              Four specialized systems operating across hardware telemetry, distributed data processing, and unified workplace intelligence. Each engineered to work independently or coalesce into one ecosystem.
            </p>

            {/* Cue when in Intro stage */}
            {!hasEnteredProducts && (
              <div className="mt-8 flex items-center gap-3 text-xs sm:text-sm font-mono tracking-wider text-white/50 animate-pulse">
                <span>SCROLL TO EXPLORE PRODUCTS</span>
                <span className="text-[#b6ff66]">→</span>
              </div>
            )}
          </div>

          {/* Bottom Forward Arrow Button */}
          <div className="pt-4">
            <TransitionLink
              href="/applications"
              aria-label="Explore all products"
              style={{
                borderColor: logoGreenTheme.border,
                backgroundColor: logoGreenTheme.bgFaint,
                color: logoGreenTheme.primary,
              }}
              className="group inline-flex items-center justify-center size-14 sm:size-16 rounded-full border transition-all duration-300 hover:scale-105"
            >
              <Arrow className="size-6 sm:size-7 transition-transform duration-300 group-hover:translate-x-1" />
            </TransitionLink>
          </div>
        </div>

        {/* RIGHT COLUMN: Clip-To-Content Animated Products Area (Reveals on Scroll) */}
        <div
          className={`relative flex-1 h-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hasEnteredProducts
              ? 'translate-x-0 opacity-100 pointer-events-auto [clip-path:inset(0_0_0_0)]'
              : 'translate-x-24 opacity-0 pointer-events-none [clip-path:inset(0_0_0_100%)]'
          }`}
        >
          {apps.map((app, i) => {
            const isActive = hasEnteredProducts && i === currentAppIndex;
            const isPrev = hasEnteredProducts && i < currentAppIndex;

            return (
              <div
                key={app.id}
                data-app-panel
                className={`absolute inset-0 flex items-center justify-center p-4 sm:p-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10'
                    : isPrev
                    ? 'opacity-0 -translate-x-24 scale-95 pointer-events-none z-0'
                    : 'opacity-0 translate-x-28 scale-95 pointer-events-none z-0'
                }`}
              >
                {/* Product Content Container with Increased Sizing */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16 w-full max-w-6xl">
                  
                  {/* 1. NUMBER INDICATOR (Significantly Increased Size) */}
                  <div className="flex flex-col items-center lg:items-start select-none shrink-0">
                    <span
                      style={{ color: logoGreenTheme.primary }}
                      className="font-display font-black text-[clamp(6.5rem,11vw,15rem)] leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(182,255,102,0.15)]"
                    >
                      0{i + 1}
                    </span>
                  </div>

                  {/* 2. CENTER: Terminal Monitor Screen */}
                  <div className="shrink-0 flex justify-center items-center">
                    <div
                      style={{
                        borderColor: logoGreenTheme.border,
                        boxShadow: `0 0 60px ${logoGreenTheme.bgFaint}`,
                      }}
                      className="relative aspect-[9/15] w-[240px] sm:w-[280px] xl:w-[320px] max-h-[64vh] rounded-2xl border-2 bg-[#0a0c0e] overflow-hidden p-3.5 flex flex-col justify-between"
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

                  {/* 3. RIGHT: Product Details & Specifications (Increased Size) */}
                  <div className="flex flex-col justify-center text-left space-y-5 max-w-[380px] shrink-0">
                    {/* Big App Name */}
                    <h3
                      style={{ color: logoGreenTheme.primary }}
                      className="font-display text-[clamp(2.8rem,2.2rem+2.5vw,4.8rem)] font-bold uppercase leading-none tracking-tight"
                    >
                      {app.name}
                    </h3>

                    {/* App Description */}
                    <p
                      style={{ color: logoGreenTheme.subtext }}
                      className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#c8ccd6]"
                    >
                      {app.description}
                    </p>

                    {/* Specs / Tags */}
                    <div
                      style={{ borderColor: logoGreenTheme.border }}
                      className="border-t border-b py-4 my-2 space-y-2.5"
                    >
                      <div className="flex justify-between text-xs sm:text-sm font-mono">
                        <span style={{ color: logoGreenTheme.subtext }}>CATEGORY</span>
                        <span style={{ color: logoGreenTheme.primary }}>{app.badge}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm font-mono">
                        <span style={{ color: logoGreenTheme.subtext }}>SYSTEM</span>
                        <span style={{ color: logoGreenTheme.primary }}>DRAVA OS</span>
                      </div>
                    </div>

                    {/* Explore Link */}
                    <TransitionLink
                      href={`/applications/${slugOf(app)}`}
                      style={{ color: logoGreenTheme.primary }}
                      className="inline-flex items-center gap-3 text-sm sm:text-base font-semibold tracking-wider uppercase transition-colors group pt-2 hover:brightness-125"
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

        {/* Floating Right Pagination Indicators (visible once products are entered) */}
        {hasEnteredProducts && (
          <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 pointer-events-none">
            {apps.map((_, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: i === currentAppIndex ? logoGreenTheme.primary : 'rgba(255, 255, 255, 0.2)',
                  height: i === currentAppIndex ? '24px' : '6px',
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
