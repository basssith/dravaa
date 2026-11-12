'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { ScrollTrigger } from '@/lib/gsap';

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
      <div className="flex items-center justify-between border-b border-white/10 px-gutter py-3.5 z-20 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#888c94] tracking-widest uppercase">
            [03] ECOSYSTEM
          </span>
          <span className="text-xs uppercase tracking-wider text-white/50">
            THE PRODUCTS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#888c94] tracking-widest">
            0{activeIndex + 1} / 0{apps.length}
          </span>
          <TransitionLink
            href="/applications"
            className="text-xs font-mono uppercase tracking-widest text-[#b6ff66] hover:underline"
          >
            [ SEE ALL ]
          </TransitionLink>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="relative flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-56px)]">
        
        {/* LEFT COLUMN: Pinned Heading, Subheading & Forward Arrow */}
        <div className="w-full lg:w-[38%] xl:w-[36%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 z-10 bg-[#000000] select-none">
          {/* Top Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] tracking-widest text-[#b6ff66] uppercase border border-[#b6ff66]/30 px-3 py-1 rounded-sm bg-[#b6ff66]/5">
                03 THE PRODUCTS
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-[clamp(2.6rem,2rem+3vw,5rem)] font-bold text-white uppercase tracking-tight leading-[1.03]">
              The Products,
              <br />
              <span className="text-[#b6ff66]">built to scale.</span>
            </h2>

            {/* Subheading */}
            <p className="mt-6 text-sm sm:text-base text-[#a0a5b0] leading-relaxed max-w-[36ch]">
              Four specialized systems operating across hardware telemetry, distributed data processing, and unified workplace intelligence. Each engineered to work independently or coalesce into one ecosystem.
            </p>
          </div>

          {/* Bottom Forward Arrow */}
          <div className="pt-8 flex items-center gap-4">
            <TransitionLink
              href="/applications"
              aria-label="Explore all products"
              className="group inline-flex items-center justify-center size-14 rounded-full border border-white/20 bg-white/5 hover:bg-[#b6ff66] hover:border-[#b6ff66] transition-all duration-300"
            >
              <Arrow className="size-6 text-white group-hover:text-black transition-colors duration-300 group-hover:translate-x-0.5" />
            </TransitionLink>
            <span className="text-xs font-mono text-[#888c94] uppercase tracking-wider hidden sm:inline-block">
              EXPLORE SUITE
            </span>
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
                  
                  {/* 1. NUMBER INDICATOR (Right after the vertical line) */}
                  <div className="flex flex-col items-center lg:items-start select-none shrink-0">
                    <span className="font-display font-black text-[clamp(4.5rem,7vw,9.5rem)] text-white leading-none tracking-tighter">
                      0{i + 1}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs tracking-widest text-[#b6ff66]">
                        / 0{apps.length}
                      </span>
                      <span className="size-1.5 rounded-full bg-[#b6ff66] animate-pulse" />
                    </div>
                  </div>

                  {/* 2. CENTER: Terminal Monitor Screen */}
                  <div className="shrink-0 flex justify-center items-center">
                    <div className="relative aspect-[9/15] w-[220px] sm:w-[250px] xl:w-[280px] max-h-[60vh] rounded-2xl border-2 border-white/20 bg-[#0a0c0e] overflow-hidden p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between">
                      {/* Top Bar */}
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#888c94] pb-2 border-b border-white/10 uppercase">
                        <span>TERMINAL {app.id}</span>
                        <span className="text-[#b6ff66]">LIVE</span>
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
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#888c94] pt-2 border-t border-white/10 uppercase">
                        <span>{app.badge}</span>
                        <span>FULLSCREEN</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. RIGHT: Product Details & Specifications */}
                  <div className="flex flex-col justify-center text-left space-y-4 max-w-[340px] shrink-0">
                    <span className="font-mono text-xs text-[#888c94] tracking-widest uppercase">
                      PROTOCOL {app.id} / 0{apps.length}
                    </span>

                    <h3 className="font-display text-[clamp(2.2rem,1.8rem+1.5vw,3.5rem)] font-bold text-white uppercase leading-none tracking-tight">
                      {app.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#a0a5b0] leading-relaxed">
                      {app.description}
                    </p>

                    {/* Specs / Tags */}
                    <div className="border-t border-b border-white/10 py-3 my-1 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#888c94]">CATEGORY</span>
                        <span className="text-white">{app.badge}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#888c94]">SYSTEM</span>
                        <span className="text-[#b6ff66]">DRAVA OS</span>
                      </div>
                    </div>

                    <TransitionLink
                      href={`/applications/${slugOf(app)}`}
                      className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white hover:text-[#b6ff66] transition-colors group pt-1"
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
              className={`w-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'h-6 bg-[#b6ff66]'
                  : 'h-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
