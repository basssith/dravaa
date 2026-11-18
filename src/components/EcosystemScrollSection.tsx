'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { applications, slugOf } from '@/lib/applications';
import { TransitionLink } from './TransitionLink';
import { Arrow } from './icons';
import { WordScrub } from './type';
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
  const [fullscreenApp, setFullscreenApp] = useState<(typeof applications)[number] | null>(null);

  const apps = applications.slice(0, 4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = container.querySelectorAll<HTMLElement>('[data-product-slide]');
    if (panels.length === 0) return;

    // LEFT SIDE & RIGHT RESTING ELEMENTS:
    const leftCol = container.querySelector<HTMLElement>('[data-left-col]');
    const rightResting = container.querySelector<HTMLElement>('[data-right-resting]');
    const resting01 = rightResting?.querySelector<HTMLElement>('span');

    // Slide 0 elements
    const slide0Num = panels[0].querySelector<HTMLElement>('[data-flow-num]');
    const slide0Img = panels[0].querySelector<HTMLElement>('[data-flow-img]');
    const slide0Details = panels[0].querySelector<HTMLElement>('[data-flow-details]');
    const slide0Divider = panels[0].querySelector<HTMLElement>('[data-flow-divider]');

    // Product 01 starts centered and ready immediately upon entering section
    gsap.set(panels[0], { xPercent: 0, opacity: 1, pointerEvents: 'auto' });
    if (slide0Num) gsap.set(slide0Num, { x: 0, opacity: 1 });
    if (slide0Img) gsap.set(slide0Img, { x: 0, opacity: 1 });
    if (slide0Details) gsap.set(slide0Details, { x: 0, opacity: 1 });
    if (slide0Divider) gsap.set(slide0Divider, { x: 0, opacity: 1 });

    for (let i = 1; i < panels.length; i++) {
      gsap.set(panels[i], { xPercent: 120, opacity: 0, pointerEvents: 'none' });
    }

    const tl = gsap.timeline({
      id: 'ecosystem-timeline',
      scrollTrigger: {
        id: 'ecosystem-scroll',
        trigger: container,
        start: 'top top',
        end: `+=${(panels.length - 1) * 100}%`,
        pin: true,
        scrub: 0.35,
        snap: {
          snapTo: panels.length > 1 ? 1 / (panels.length - 1) : 0,
          duration: { min: 0.25, max: 0.5 },
          delay: 0.05,
          ease: 'power2.out',
        },
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(panels.length - 1, Math.round(p * (panels.length - 1)));
          setActiveIdx(idx);
        },
      },
    });

    // Clean product carousel: As you scroll, product slides transition cleanly into view
    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const prevDivider = prev.querySelector<HTMLElement>('[data-flow-divider]');
      const step = `step-${i + 1}`;

      // Current slide glides out to the left
      tl.to(
        prev,
        {
          xPercent: -130,
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.8,
          ease: 'power2.inOut',
        },
        step
      );

      // Fade out previous slide divider early
      if (prevDivider) {
        tl.to(
          prevDivider,
          {
            opacity: 0,
            duration: 0.25,
            ease: 'power1.out',
          },
          step
        );
      }

      // Next slide enters smoothly from the right
      tl.fromTo(
        next,
        { xPercent: 120, opacity: 0, pointerEvents: 'none' },
        {
          xPercent: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.8,
          ease: 'power2.inOut',
        },
        step
      );

      // Rest on the active product
      tl.to({}, { duration: 0.25 });
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
              {/* Product Layout: Full Screen Centered Layout (Number + Horizontal Screen Image + Details + Full Height Vertical Divider) */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-7 xl:gap-9 w-full max-w-[95vw] 2xl:max-w-[1550px]">
                
                {/* 1. NUMBER INDICATOR: Well-proportioned 0 + Gray Slash + Product Digit */}
                <div data-flow-num className="flex items-center select-none shrink-0 will-change-transform leading-none gap-2 sm:gap-2.5 pl-2 sm:pl-3 lg:pl-4 pr-2 sm:pr-3">
                  {/* Normal "0" using Syne font */}
                  <span className="font-display font-black text-[clamp(4.8rem,7.5vw,11.8rem)] leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.14)]">
                    0
                  </span>

                  {/* Gray slanted slash / */}
                  <span className="font-display font-light text-[clamp(4.5rem,7vw,11rem)] text-[#50555e] leading-none select-none">
                    /
                  </span>

                  {/* Product Digit (1, 2, 3, 4) in font-display Syne */}
                  <span className="font-display font-black text-[clamp(4.8rem,7.5vw,11.8rem)] leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.14)]">
                    {i + 1}
                  </span>
                </div>

                {/* 2. CENTER: Horizontal Screen Monitor */}
                <div data-flow-img className="shrink-0 flex justify-center items-center will-change-transform pointer-events-auto">
                  <div className="relative aspect-[16/9] w-[330px] sm:w-[450px] md:w-[520px] lg:w-[500px] xl:w-[590px] 2xl:w-[680px] max-h-[60vh] rounded-2xl border-2 border-white/20 bg-[#0a0c0e] overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(255,255,255,0.06)] group/frame">
                    <TransitionLink
                      href={`/applications/${slugOf(app)}`}
                      className="group/img relative w-full h-full block cursor-pointer overflow-hidden"
                      aria-label={`View ${app.name} details`}
                    >
                      <Image
                        src={app.image}
                        alt={app.name}
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                        className="object-contain object-center w-full h-full transition-transform duration-700 group-hover/img:scale-[1.02]"
                      />

                      {/* Hover Overlay with "View [Product]" Button styled exactly like nav bar buttons */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10 backdrop-blur-[2px]">
                        <span className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-6 text-small font-semibold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000] transform translate-y-2 group-hover/img:translate-y-0">
                          <span>View {app.name}</span>
                          <Arrow className="size-3.5 -rotate-45" />
                        </span>
                      </div>

                      {/* Fullscreen Button overlay inside the screen on top-right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFullscreenApp(app);
                        }}
                        className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-black/75 hover:bg-black/90 border border-white/20 text-white/80 hover:text-[#b6ff66] transition-all cursor-pointer backdrop-blur-sm"
                        aria-label={`View ${app.name} in fullscreen modal`}
                      >
                        <svg
                          className="size-3.5 fill-none stroke-current"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                        <span>Fullscreen</span>
                      </button>
                    </TransitionLink>
                  </div>
                </div>

                {/* 3. CENTER-RIGHT: Product Details & Specifications */}
                <div data-flow-details className="flex flex-col justify-center text-left space-y-3.5 w-full sm:w-[300px] lg:w-[320px] xl:w-[350px] shrink-0 will-change-transform pointer-events-auto">
                  {/* Product Step Number Indicator: 01 / 04 */}
                  <div className="font-mono text-xs sm:text-sm tracking-widest text-white/60">
                    0{i + 1} / 0{apps.length}
                  </div>

                  <h3 className="font-display text-[clamp(2.2rem,1.9rem+1.6vw,3.3rem)] font-bold leading-none tracking-tight text-white">
                    {app.name}
                  </h3>

                  <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-[#c8ccd6]">
                    {app.description}
                  </p>

                  <div className="border-t border-b border-white/20 py-3 my-1 space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm font-mono text-white/80">
                      <span>Category</span>
                      <span className="text-white font-medium">{app.badge}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm font-mono text-white/80">
                      <span>System</span>
                      <span className="text-white font-medium">Drava OS</span>
                    </div>
                  </div>

                  {/* EXPLORE BUTTON: STYLED EXACTLY LIKE THE VIEW BUTTON */}
                  <TransitionLink
                    href={`/applications/${slugOf(app)}`}
                    className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-6 text-small font-semibold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000] group mt-1"
                  >
                    <span>Explore {app.name}</span>
                    <Arrow className="size-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-current" />
                  </TransitionLink>
                </div>

                {/* 4. FULL LENGTH VERTICAL GREEN LINE DIVIDER (Shown for products 1, 2, 3 in solid logo green #b6ff66; omitted for 4th product) */}
                {i < apps.length - 1 && (
                  <div
                    data-flow-divider
                    style={{ backgroundColor: '#b6ff66' }}
                    className="hidden lg:block w-[1px] h-screen shrink-0 ml-5 lg:ml-7 xl:ml-10 will-change-transform shadow-[0_0_12px_rgba(182,255,102,0.4)]"
                  />
                )}

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FULLSCREEN POPUP MODAL */}
      {fullscreenApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setFullscreenApp(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-[#0a0c0e] border-2 border-white/20 rounded-2xl overflow-hidden p-4 sm:p-6 flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs sm:text-sm font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[#b6ff66] font-bold">Product {fullscreenApp.id}</span>
                <span className="text-white/40">/</span>
                <span className="text-white font-semibold">{fullscreenApp.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setFullscreenApp(null)}
                aria-label="Close fullscreen modal"
                className="size-8 rounded-full border border-white/20 bg-white/5 hover:bg-[#b6ff66] hover:text-black flex items-center justify-center transition-colors cursor-pointer text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[68vh] my-4 rounded-xl overflow-hidden bg-black/80">
              <Image
                src={fullscreenApp.image}
                alt={fullscreenApp.name}
                fill
                quality={100}
                className="object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-white/10 text-xs sm:text-sm font-mono text-white/70">
              <p className="max-w-xl text-xs sm:text-sm text-[#c8ccd6]">{fullscreenApp.description}</p>
              <TransitionLink
                href={`/applications/${slugOf(fullscreenApp)}`}
                className="inline-flex min-h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-5 text-xs font-semibold tracking-wider uppercase text-white shadow-xl transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000] group"
              >
                <span>Explore {fullscreenApp.name}</span>
                <Arrow className="size-3 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-current" />
              </TransitionLink>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
