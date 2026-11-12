'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf, type Application } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function EcosystemScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const apps = applications.slice(0, 4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = container.querySelectorAll<HTMLElement>('[data-app-panel]');
    const totalApps = apps.length;

    // Pin the section and scrub through the applications one by one
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${totalApps * 120}%`,
      pin: true,
      scrub: 0.8,
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
      {/* Precision Top Sub-Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-gutter py-4 z-20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#888c94] tracking-widest uppercase">
            [03] ECOSYSTEM
          </span>
          <span className="text-xs uppercase tracking-wider text-white/50">
            {apps[activeIndex].category}
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
      <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 w-full h-[calc(100vh-60px)] items-center px-gutter">
        {apps.map((app, i) => {
          const isActive = i === activeIndex;

          return (
            <div
              key={app.id}
              data-app-panel
              className={`absolute inset-x-gutter top-0 bottom-0 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 transition-all duration-700 ease-out ${
                isActive
                  ? 'opacity-100 pointer-events-auto z-10 translate-y-0 scale-100'
                  : 'opacity-0 pointer-events-none z-0 translate-y-8 scale-95'
              }`}
            >
              {/* LEFT COLUMN: Massive Glyph / Number Pair */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-start select-none">
                <div className="flex items-baseline font-display font-black leading-none tracking-tighter text-white">
                  <span className="text-[clamp(6rem,12vw,14rem)] text-white">
                    0{i + 1}
                  </span>
                  <span className="text-[clamp(4.5rem,9vw,10rem)] text-[#555a64] mx-2 font-light">
                    /
                  </span>
                  <span className="text-[clamp(4.5rem,9vw,10rem)] text-[#b6ff66]">
                    0{apps.length}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-mono text-xs tracking-widest text-[#888c94] uppercase">
                    APPLICATION PROTOCOL
                  </span>
                  <span className="size-2 rounded-full bg-[#b6ff66] animate-pulse" />
                </div>
              </div>

              {/* CENTER COLUMN: Vertical Monolith Frame / Graphic Screen */}
              <div className="lg:col-span-4 flex justify-center items-center">
                <div className="relative aspect-[9/16] w-full max-w-[340px] max-h-[70vh] rounded-2xl border-2 border-white/20 bg-[#0a0c0e] overflow-hidden p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between">
                  {/* Outer Frame Top Bar */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#888c94] pb-2 border-b border-white/10 uppercase">
                    <span>TERMINAL {app.id}</span>
                    <span className="text-[#b6ff66]">LIVE</span>
                  </div>

                  {/* App Visual Image / Interface */}
                  <div className="relative flex-1 w-full my-2 rounded-lg overflow-hidden bg-black/60">
                    <Image
                      src={app.image}
                      alt={app.name}
                      fill
                      quality={95}
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Outer Frame Bottom Bar */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#888c94] pt-2 border-t border-white/10 uppercase">
                    <span>{app.badge}</span>
                    <span>FULLSCREEN</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Details & Description */}
              <div className="lg:col-span-3 flex flex-col justify-center text-left space-y-5">
                <span className="font-mono text-xs text-[#888c94] tracking-widest uppercase">
                  {app.id} / 0{apps.length}
                </span>

                <h3 className="font-display text-[clamp(2.5rem,2rem+2vw,4rem)] font-bold text-white uppercase leading-none tracking-tight">
                  {app.name}
                </h3>

                <p className="text-sm sm:text-base text-[#a0a5b0] leading-relaxed max-w-[32ch]">
                  {app.description}
                </p>

                {/* Specs / Tags */}
                <div className="border-t border-b border-white/10 py-3 my-2 space-y-2">
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
                  className="inline-flex items-center gap-3 text-sm font-semibold tracking-wider uppercase text-white hover:text-[#b6ff66] transition-colors group pt-2"
                >
                  <span>Explore {app.name}</span>
                  <Arrow className="size-4 -rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </TransitionLink>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Right Pagination Dots (matching reference video indicator) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-none">
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
    </section>
  );
}
