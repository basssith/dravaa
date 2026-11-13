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

    // Panels start:
    // Panel 0 is present. In resting state, its 01 sits exactly in place on the right side.
    // We calculate the delta between the center of the right 40% column and the docked position of 01 inside max-w-6xl.
    const isDesktop = window.innerWidth >= 1024;
    // Desktop layout: left column is 60vw, right column is 40vw (center is at 80vw from left).
    // In max-w-6xl (1152px) centered in viewport, 01 is at the left edge of max-w-6xl.
    // The offset to place 01 at 80vw is approximately:
    const initialOffset01 = isDesktop
      ? (window.innerWidth * 0.8) - ((window.innerWidth - Math.min(window.innerWidth - 64, 1152)) / 2 + 80)
      : 0;

    gsap.set(panels[0], { xPercent: 0, opacity: 1, pointerEvents: 'auto' });
    if (slide0Num) gsap.set(slide0Num, { x: initialOffset01, opacity: 1 });
    if (slide0Img) gsap.set(slide0Img, { x: 350, opacity: 0 });
    if (slide0Details) gsap.set(slide0Details, { x: 420, opacity: 0 });
    if (slide0Divider) gsap.set(slide0Divider, { x: 450, opacity: 0 });

    for (let i = 1; i < panels.length; i++) {
      gsap.set(panels[i], { xPercent: 120, opacity: 0, pointerEvents: 'none' });
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

    // STEP 1: Scroll starts ->
    // 1. Left column content slides out to the left
    if (leftCol) {
      tl.to(
        leftCol,
        {
          xPercent: -105,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        'p0'
      );
    }

    // 2. The 01 MOVES FIRST: glides from the right side towards the left into position!
    if (slide0Num) {
      tl.to(
        slide0Num,
        {
          x: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        'p0'
      );
    }

    // 3. AFTER 01 has started moving, the product monitor image, details, and vertical line come in!
    if (slide0Img) {
      tl.to(
        slide0Img,
        { x: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        'p0+=0.6'
      );
    }
    if (slide0Details) {
      tl.to(
        slide0Details,
        { x: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        'p0+=0.75'
      );
    }
    if (slide0Divider) {
      tl.to(
        slide0Divider,
        { x: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        'p0+=0.85'
      );
    }

    // Resting pause for Product 01 full screen
    tl.to({}, { duration: 0.5 });

    // STEP 2: Subsequent products transition seamlessly across the full screen
    for (let i = 0; i < panels.length - 1; i++) {
      const prev = panels[i];
      const next = panels[i + 1];
      const step = `step-${i + 1}`;

      // Current slide (e.g. Product 01) glides out smoothly to the left
      tl.to(
        prev,
        {
          xPercent: -100,
          opacity: 0,
          pointerEvents: 'none',
          duration: 1.2,
          ease: 'power2.inOut',
        },
        step
      );

      // Next slide (e.g. Product 02) enters smoothly from the right to the center
      // It arrives as a full cohesive unit (Number on left, Monitor center, Details right)
      tl.fromTo(
        next,
        { xPercent: 100, opacity: 0, pointerEvents: 'none' },
        {
          xPercent: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 1.2,
          ease: 'power2.inOut',
        },
        step
      );

      // Resting pause on current product
      tl.to({}, { duration: 0.6 });
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
        
        {/* LEFT COLUMN: 60% Width Intro Content with single vertical green line that glides out left on scroll */}
        <div
          data-left-col
          className="w-full lg:w-[60%] h-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 xl:p-20 z-20 bg-[#000000] border-b lg:border-b-0 lg:border-r border-[#b6ff66]/40 select-none will-change-transform"
        >
          {/* Top Tag: Green Box for 03 & White Text PRODUCTS without rounded pill stroke */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                03
              </span>
              <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
                PRODUCTS
              </span>
            </div>
          </div>

          {/* Centered Main Content: Prominent heading with scroll WordScrub */}
          <div className="my-auto py-6 max-w-3xl">
            <h2 className="font-display text-[clamp(2.6rem,2.8rem+3.5vw,5.8rem)] font-bold tracking-tight leading-[1.04] text-white">
              <WordScrub
                as="span"
                className="leading-[1.04]"
                text="The product changes but the experience stays."
              />
            </h2>

            <div className="mt-8 text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-[48ch] font-normal">
              <WordScrub
                as="p"
                className="leading-relaxed"
                text="Four intelligent systems engineered to unify every environment. One cohesive OS connecting hardware, spaces, and digital workflows."
              />
            </div>
          </div>

          {/* Bottom Forward Arrow Button: Clicking scrolls directly to 01 product section */}
          <div className="pb-2">
            <button
              type="button"
              onClick={() => {
                const st = ScrollTrigger.getById('ecosystem-scroll') || ScrollTrigger.getAll().find(t => t.trigger === containerRef.current);
                if (st) {
                  // Scroll to the moment 01 Nex product settles into place
                  const targetScroll = st.start + (st.end - st.start) * 0.16;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                } else if (containerRef.current) {
                  containerRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              aria-label="Advance to first product (01 Nex)"
              className="group inline-flex items-center text-white hover:text-[#b6ff66] transition-colors duration-300 py-2 cursor-pointer focus:outline-none"
            >
              <Arrow className="size-8 sm:size-10 text-white group-hover:text-[#b6ff66] transition-all duration-300 group-hover:translate-x-2" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 40% Width Area in Initial State, Houses the Resting 01 Centered */}
        <div
          data-right-resting
          className="hidden"
        >
        </div>

        {/* FULL-SCREEN PRODUCT STAGE: Active Products on Scroll */}
        <div
          data-product-stage
          className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-12 z-30 pointer-events-none"
        >
          {apps.map((app, i) => (
            <div
              key={app.id}
              data-product-slide
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 lg:p-12 will-change-transform"
            >
              {/* Product Layout: Full Screen Centered Layout (Number + Horizontal Screen Image + Details + Full Height Vertical Divider) */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 xl:gap-12 w-full max-w-7xl">
                
                {/* 1. NUMBER INDICATOR (White color) */}
                <div data-flow-num className="flex flex-col items-center lg:items-start select-none shrink-0 will-change-transform">
                  <span className="font-display font-black text-[clamp(4.5rem,7vw,10.5rem)] leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.12)]">
                    0{i + 1}
                  </span>
                </div>

                {/* 2. CENTER: Horizontal Screen Monitor */}
                <div data-flow-img className="shrink-0 flex justify-center items-center will-change-transform pointer-events-auto">
                  <div className="relative aspect-[16/9] w-[340px] sm:w-[460px] md:w-[540px] lg:w-[520px] xl:w-[600px] 2xl:w-[680px] max-h-[62vh] rounded-2xl border-2 border-white/20 bg-[#0a0c0e] overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(255,255,255,0.06)] group/frame">
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

                      {/* Hover Overlay with "View" Button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10 backdrop-blur-[1px]">
                        <span className="inline-flex items-center gap-2 bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-2xl transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
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
                <div data-flow-details className="flex flex-col justify-center text-left space-y-4 max-w-[320px] lg:max-w-[340px] shrink-0 will-change-transform pointer-events-auto">
                  {/* Product Step Number Indicator: 01 / 04 */}
                  <div className="font-mono text-xs sm:text-sm tracking-widest text-white/60">
                    0{i + 1} / 0{apps.length}
                  </div>

                  <h3 className="font-display text-[clamp(2.2rem,2rem+1.8vw,3.6rem)] font-bold leading-none tracking-tight text-white">
                    {app.name}
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed text-[#c8ccd6]">
                    {app.description}
                  </p>

                  <div className="border-t border-b border-white/20 py-3.5 my-1 space-y-2.5">
                    <div className="flex justify-between text-xs sm:text-sm font-mono text-white/80">
                      <span>Category</span>
                      <span className="text-white font-medium">{app.badge}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm font-mono text-white/80">
                      <span>System</span>
                      <span className="text-white font-medium">Drava OS</span>
                    </div>
                  </div>

                  {/* EXPLORE BUTTON: SIGNATURE GREEN -> HOVER TURNS WHITE */}
                  <TransitionLink
                    href={`/applications/${slugOf(app)}`}
                    className="inline-flex items-center gap-3 text-sm sm:text-base font-semibold tracking-wider text-[#b6ff66] hover:text-white transition-colors duration-300 group pt-1"
                  >
                    <span>Explore {app.name}</span>
                    <Arrow className="size-4 -rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-current" />
                  </TransitionLink>
                </div>

                {/* 4. FULL LENGTH VERTICAL GREEN LINE DIVIDER (Shown for products 1, 2, 3; omitted for 4th product) */}
                {i < apps.length - 1 && (
                  <div
                    data-flow-divider
                    style={{ backgroundColor: 'rgba(182, 255, 102, 0.40)' }}
                    className="hidden lg:block w-[1px] h-screen shrink-0 ml-20 mr-10 xl:ml-32 xl:mr-14 will-change-transform"
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
                style={{ color: logoGreenTheme.primary }}
                className="inline-flex items-center gap-2 font-semibold hover:brightness-125 transition-all"
              >
                <span>Explore {fullscreenApp.name}</span>
                <Arrow className="size-3.5 -rotate-45" />
              </TransitionLink>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
