'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { slugOf, type Application } from '@/lib/applications';
import { Arrow } from './icons';
import { TransitionLink } from './TransitionLink';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Centered Sticky Stacking Product Cards:
 * 1 product card sits centered in the viewport.
 * As you scroll down, the 2nd (and subsequent) product cards slide up from the bottom
 * and smoothly cover/stack over the previous card.
 */
export function AppGrid({ apps }: { apps: Application[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-stack-card]');
    if (cards.length === 0) return;

    const triggers: ScrollTrigger[] = [];

    // For cards after the first one, animate them sliding up from below and stacking
    cards.forEach((card, index) => {
      if (index === 0) return; // First card is resting centered

      const prevCard = cards[index - 1];
      const prevDetails = prevCard?.querySelector<HTMLElement>('[data-card-details]');

      const st = ScrollTrigger.create({
        trigger: card,
        start: 'top bottom',
        end: 'top 20%',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Fade out the previous card's details completely so text doesn't show through
          if (prevDetails) {
            // Rapidly fade out details between progress 0.0 and 0.55
            const detailsOpacity = Math.max(0, 1 - p * 2.2);
            gsap.set(prevDetails, {
              opacity: detailsOpacity,
              y: -p * 20,
            });
          }

          // Scale down and fade the previous card's image to clear the stage for the pop-up card
          if (prevCard) {
            const cardOpacity = Math.max(0, 1 - p * 1.2);
            gsap.set(prevCard, {
              scale: 1 - p * 0.06,
              opacity: cardOpacity,
            });
          }
        },
      });

      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [apps.length]);

  return (
    <div ref={containerRef} className="relative w-full pb-24 space-y-24 sm:space-y-32">
      {apps.map((app, index) => {
        // Sticky offset so cards stack cleanly near top of viewport
        const topOffset = 80 + index * 10;

        return (
          <div
            key={app.id}
            data-stack-card
            style={{
              top: `clamp(70px, ${topOffset}px, 110px)`,
              zIndex: 10 + index,
            }}
            className="sticky w-full max-w-4xl mx-auto will-change-transform"
          >
            <article className="w-full">
              <TransitionLink
                href={`/applications/${slugOf(app)}`}
                aria-label={`Open ${app.name}`}
                className="group block no-underline"
              >
                {/* 1 Product Image in Center without surrounding square box */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/60 [perspective:1000px]">
                  <Image
                    src={app.image}
                    alt={app.name}
                    fill
                    quality={90}
                    placeholder="blur"
                    sizes="(min-width: 1024px) 896px, 100vw"
                    className="hover-blur-shake app-card-img object-contain sm:object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.02]"
                  />

                  {/* Hover Overlay with "View Product" Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10 backdrop-blur-[2px]">
                    <span className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/30 bg-black/70 px-6 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white shadow-2xl transition-all duration-300 group-hover:border-[#b6ff66] group-hover:bg-[#b6ff66] group-hover:text-black transform translate-y-2 group-hover:translate-y-0">
                      <span>View {app.name}</span>
                      <Arrow className="size-3.5 -rotate-45" />
                    </span>
                  </div>
                </div>

                {/* Meta details & title row */}
                <div data-card-details className="will-change-transform">
                  <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
                        {app.id}
                      </span>
                      <span className="text-xs sm:text-sm font-[family-name:var(--font-manrope)] tracking-widest text-white/90 font-semibold uppercase">
                        {app.category}
                      </span>
                    </div>

                    <span className="text-xs sm:text-sm font-mono text-white/50 tracking-wider">
                      0{index + 1} / 0{apps.length}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
                      <span>{app.name}</span>
                      <span className="inline-flex items-center text-[#b6ff66] opacity-0 -translate-x-2 transition-all duration-300 ease-expo group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
                        <Arrow className="size-6 stroke-[2.2] -rotate-45" />
                      </span>
                    </h3>
                  </div>

                  {app.description && (
                    <p className="mt-3 text-xs sm:text-sm md:text-base text-white/70 max-w-2xl leading-relaxed">
                      {app.description}
                    </p>
                  )}
                </div>
              </TransitionLink>
            </article>
          </div>
        );
      })}
    </div>
  );
}

/** Compact index of every application. */
export function AppList({ apps }: { apps: Application[] }) {
  return (
    <ul className="border-t border-white/15 text-white">
      {apps.map((app) => (
        <li key={app.id} data-reveal className="relative">
          <TransitionLink
            href={`/applications/${slugOf(app)}`}
            className="group relative grid grid-cols-[3rem_1fr_2.75rem] items-center gap-4 border-b border-white/15 py-6 no-underline transition-[padding,background-color] duration-500 ease-expo hover:bg-[#b6ff66] hover:text-[#000000] hover:px-4 lg:grid-cols-[4rem_1.2fr_2fr_5rem_2.75rem]"
          >
            <span className="inline-flex w-fit items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs px-2 py-0.5 rounded-[4px] leading-tight tracking-normal group-hover:bg-black group-hover:text-[#b6ff66]">
              {app.id}
            </span>
            <span className="font-display text-h4 leading-none font-bold tracking-[-0.02em] uppercase text-white group-hover:text-black">{app.name}</span>
            <span className="text-small text-white/80 group-hover:text-black max-lg:hidden">{app.category}</span>
            <span className="text-small text-white/80 group-hover:text-black max-lg:hidden">{app.year}</span>
            <span className="justify-self-end text-white group-hover:text-black">
              <Arrow className="size-[18px] -rotate-45" />
            </span>

            {/* Floating Image Preview on Hover */}
            <div className="pointer-events-none absolute left-[16%] lg:left-[18%] top-1/2 z-30 hidden -translate-y-1/2 opacity-0 transition-[opacity,transform] duration-300 ease-expo group-hover:scale-100 group-hover:opacity-100 scale-90 md:block">
              <div className="relative aspect-video w-52 sm:w-64 lg:w-72 overflow-hidden rounded-xl border border-black/20 bg-black shadow-2xl ring-1 ring-white/10">
                <Image
                  src={app.image}
                  alt={app.name}
                  fill
                  quality={90}
                  sizes="288px"
                  className="object-cover object-center w-full h-full"
                />
              </div>
            </div>
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}
