'use client';

import { usePathname } from 'next/navigation';
import { gsap, prefersReduced, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { pad } from '@/lib/applications';
import { useUI } from './UIProvider';

/**
 * All scroll animation, driven by data attributes so page sections stay server components:
 *   [data-hero] .line > span   rises in once the intro is done
 *   [data-lines] .line > span  rises in when scrolled into view
 *   [data-reveal]              fades up when scrolled into view
 *   [data-words] .w            words light up as you scroll through
 *   [data-count]               counts up from 00 when scrolled into view
 *   [data-companion-card]      card slide-up elevation as 3rd section goes down
 * Re-runs (and cleans up) on every route change.
 */
export function ScrollEffects() {
  const pathname = usePathname();
  const { introDone } = useUI();

  useGSAP(
    () => {
      if (prefersReduced() || !introDone) return;

      // The CSS pre-hide (translateY(110%)) is parsed by GSAP as a px `y`, so zero it explicitly.
      gsap.fromTo('[data-hero] .line > span', { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.15 });

      gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((el) => {
        gsap.from(el.querySelectorAll('.line > span'), {
          yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 70,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true }
        });
      });

      // Staggered smooth parallax scrolling on application cards
      gsap.utils.toArray<HTMLElement>('[data-app-card]').forEach((el, index) => {
        const offset = index % 2 === 1 ? -40 : 40;
        gsap.fromTo(
          el,
          { y: offset },
          {
            y: -offset,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      });

      // 4th Screen Card Slide-Up Animation:
      // Removed scale/opacity shrink on #applications to avoid exposing the page background between sections.

      // Scroll Text Scrubbing Effect: Words transition from dim green/grey through vibrant signature green into crisp white
      gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
        const words = el.querySelectorAll<HTMLElement>('.w-scrub');
        if (!words.length) return;

        // Set initial state: dim subtle green-grey
        gsap.set(words, { color: 'rgba(182, 255, 102, 0.22)', opacity: 0.35 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        });

        words.forEach((w) => {
          tl.to(
            w,
            {
              color: '#b6ff66',
              opacity: 1,
              duration: 0.25,
              ease: 'power1.inOut',
            }
          ).to(
            w,
            {
              color: '#ffffff',
              opacity: 1,
              duration: 0.35,
              ease: 'power1.out',
            },
            '+=0.08'
          );
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        el.textContent = pad(0);
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: () => gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = pad(Math.round(o.v)); } })
        });
      });

      // Images arriving late change layout height.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      return () => window.removeEventListener('load', refresh);
    },
    { dependencies: [pathname, introDone], revertOnUpdate: true }
  );

  return null;
}
