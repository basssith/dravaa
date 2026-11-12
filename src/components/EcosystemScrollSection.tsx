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
  const [activeIndex, setActiveIndex] = useState(0);

  const apps = applications.slice(0, 4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalApps = apps.length;

    // Pin the section and scrub through the applications one by one
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${totalApps * 120}%`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const idx = Math.min(
          totalApps - 1,
          Math.floor(self.progress * totalApps)
        );
        setActiveIndex(idx);
      },
    });

    return () => {
      st.kill();
    };
  }, [apps.length]);

  return (
    <section
      ref={containerRef}
      id="applications"
      className="relative z-20 min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between overflow-hidden"
    >
      {/* Top Precision Header Bar */}
      <div
        style={{ borderColor: logoGreenTheme.border }}
        className="flex items-center justify-between border-b px-gutter py-3.5 z-20 bg-black/50 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <span
            style={{ color: logoGreenTheme.primary }}
            className="font-mono text-xs tracking-widest uppercase"
          >
            [03] ECOSYSTEM
          </span>
          <span
            style={{ color: logoGreenTheme.subtext }}
            className="text-xs uppercase tracking-wider"
          >
            THE PRODUCTS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span
            style={{ color: logoGreenTheme.subtext }}
            className="font-mono text-xs tracking-widest"
          >
            0{activeIndex + 1} / 0{apps.length}
          </span>
          <TransitionLink
            href="/applications"
            style={{ color: logoGreenTheme.primary }}
            className="text-xs font-mono uppercase tracking-widest hover:underline"
          >
            [ SEE ALL ]
          </TransitionLink>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="relative flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-56px)]">
        
        {/* LEFT COLUMN: Pinned Heading, Subheading & Forward Arrow */}
        <div
          style={{ borderColor: logoGreenTheme.border }}
          className="w-full lg:w-[38%] xl:w-[36%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r z-10 bg-[#000000] select-none"
        >
          {/* Top Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span
                style={{
                  color: logoGreenTheme.primary,
                  borderColor: logoGreenTheme.border,
                  backgroundColor: logoGreenTheme.bgFaint,
                }}
                className="font-mono text-[11px] tracking-widest uppercase border px-3 py-1 rounded-sm"
              >
                03 THE PRODUCTS
              </span>
            </div>

            {/* Main Headline - In Logo Color Green (#b6ff66) */}
            <h2
              style={{ color: logoGreenTheme.primary }}
              className="font-display text-[clamp(2.6rem,2rem+3vw,5rem)] font-bold uppercase tracking-tight leading-[1.03]"
            >
              The Products,
              <br />
              <span>built to scale.</span>
            </h2>

            {/* Subheading */}
            <p
              style={{ color: logoGreenTheme.subtext }}
              className="mt-6 text-sm sm:text-base leading-relaxed max-w-[36ch]"
            >
              Four specialized systems operating across hardware telemetry, distributed data processing, and unified workplace intelligence. Each engineered to work independently or coalesce into one ecosystem.
            </p>
          </div>

          {/* Bottom Forward Arrow (EXPLORE SUITE text removed) */}
          <div className="pt-8">
            <TransitionLink
              href="/applications"
              aria-label="Explore all products"
              style={{
                borderColor: logoGreenTheme.border,
                backgroundColor: logoGreenTheme.bgFaint,
                color: logoGreenTheme.primary,
              }}
              className="group inline-flex items-center justify-center size-14 rounded-full border transition-all duration-300 hover:scale-105"
            >
              <Arrow className="size-6 transition-transform duration-300 group-hover:translate-x-0.5" />
            </TransitionLink>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Animated Products Scroll Area */}
        <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {apps.map((app, i) => {
            const isActive = i === activeIndex;
            const isPrev = i < activeIndex;

            return (
              <div
                key={app.id}
                data-app-panel
                className={`absolute inset-0 flex items-center justify-center p-4 sm:p-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10'
                    : isPrev
                    ? 'opacity-0 -translate-x-20 scale-95 pointer-events-none z-0'
                    : 'opacity-0 translate-x-24 scale-95 pointer-events-none z-0'
                }`}
              >
                {/* Product Content Container */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-12 w-full max-w-5xl">
                  
                  {/* 1. NUMBER INDICATOR (Clean number, /04 dot removed) */}
                  <div className="flex flex-col items-center lg:items-start select-none shrink-0">
                    <span
                      style={{ color: logoGreenTheme.primary }}
                      className="font-display font-black text-[clamp(5rem,8vw,11rem)] leading-none tracking-tighter"
                    >
                      0{i + 1}
                    </span>
                  </div>

                  {/* 2. CENTER: Terminal Monitor Screen */}
                  <div className="shrink-0 flex justify-center items-center">
                    <div
                      style={{
                        borderColor: logoGreenTheme.border,
                        boxShadow: `0 0 50px ${logoGreenTheme.bgFaint}`,
                      }}
                      className="relative aspect-[9/15] w-[220px] sm:w-[250px] xl:w-[280px] max-h-[60vh] rounded-2xl border-2 bg-[#0a0c0e] overflow-hidden p-3 flex flex-col justify-between"
                    >
                      {/* Top Bar */}
                      <div
                        style={{ borderColor: logoGreenTheme.border }}
                        className="flex justify-between items-center text-[10px] font-mono pb-2 border-b uppercase"
                      >
                        <span style={{ color: logoGreenTheme.subtext }}>
                          TERMINAL {app.id}
                        </span>
                        <span style={{ color: logoGreenTheme.primary }}>
                          LIVE
                        </span>
                      </div>

                      {/* Image Preview */}
                      <div className="relative flex-1 w-full my-2 rounded-lg overflow-hidden bg-black/60">
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
                        className="flex justify-between items-center text-[10px] font-mono pt-2 border-t uppercase"
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
                  <div className="flex flex-col justify-center text-left space-y-4 max-w-[340px] shrink-0">
                    <h3
                      style={{ color: logoGreenTheme.primary }}
                      className="font-display text-[clamp(2.2rem,1.8rem+1.5vw,3.5rem)] font-bold uppercase leading-none tracking-tight"
                    >
                      {app.name}
                    </h3>

                    <p
                      style={{ color: logoGreenTheme.subtext }}
                      className="text-xs sm:text-sm leading-relaxed"
                    >
                      {app.description}
                    </p>

                    {/* Specs / Tags */}
                    <div
                      style={{ borderColor: logoGreenTheme.border }}
                      className="border-t border-b py-3 my-1 space-y-2"
                    >
                      <div className="flex justify-between text-xs font-mono">
                        <span style={{ color: logoGreenTheme.subtext }}>CATEGORY</span>
                        <span style={{ color: logoGreenTheme.primary }}>{app.badge}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span style={{ color: logoGreenTheme.subtext }}>SYSTEM</span>
                        <span style={{ color: logoGreenTheme.primary }}>DRAVA OS</span>
                      </div>
                    </div>

                    <TransitionLink
                      href={`/applications/${slugOf(app)}`}
                      style={{ color: logoGreenTheme.primary }}
                      className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors group pt-1 hover:brightness-125"
                    >
                      <span>Explore {app.name}</span>
                      <Arrow className="size-4 -rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </TransitionLink>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Right Pagination Indicators */}
        <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 pointer-events-none">
          {apps.map((_, i) => (
            <span
              key={i}
              style={{
                backgroundColor: i === activeIndex ? logoGreenTheme.primary : 'rgba(255, 255, 255, 0.2)',
                height: i === activeIndex ? '24px' : '6px',
              }}
              className="w-1.5 rounded-full transition-all duration-300"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
