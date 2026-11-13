'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReduced, useGSAP } from '@/lib/gsap';
import { EMAIL, NAV, SOCIALS } from '@/lib/site';
import { cn } from '@/lib/ui';
import { TransitionLink } from './TransitionLink';
import { useUI } from './UIProvider';

export function Menu() {
  const { menuOpen } = useUI();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!menuOpen || prefersReduced()) return;
      gsap.fromTo('[data-menu-label]', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.2 });
    },
    { dependencies: [menuOpen], scope: root }
  );

  // Focus moves into the menu on open and back to the toggle on close.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (menuOpen) el.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    else if (el.contains(document.activeElement)) document.getElementById('menu-btn')?.focus();
  }, [menuOpen]);

  return (
    <nav
      id="menu"
      ref={root}
      aria-label="Main"
      inert={!menuOpen}
      className={cn(
        'fixed inset-0 z-55 overflow-y-auto bg-ink text-paper',
        menuOpen
          ? 'visible [clip-path:inset(0)] [transition:clip-path_.8s_var(--ease-expo)]'
          : 'invisible [clip-path:inset(0_0_100%_0)] [transition:clip-path_.8s_var(--ease-expo),visibility_0s_.8s]'
      )}
    >
      <div className="flex min-h-full flex-col justify-between gap-12 px-gutter pt-[calc(var(--spacing-header)+--spacing(8))] pb-8">
        <ul>
          {NAV.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line-inv">
              <TransitionLink href={item.href} className="group flex items-baseline py-2 no-underline">
                <span
                  data-menu-label
                  className="inline-block font-display text-h2 font-bold uppercase leading-none tracking-display transition-[color,transform] duration-500 ease-expo group-hover:translate-x-4 group-hover:text-accent"
                >
                  {item.label}
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-between gap-4 text-small">
          <ul className="flex gap-6">
            {SOCIALS.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline transition-colors hover:text-accent">
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${EMAIL}`} className="no-underline transition-colors hover:text-accent">
            {EMAIL}
          </a>
        </div>
      </div>
    </nav>
  );
}
