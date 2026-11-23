'use client';

import Lenis from 'lenis';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { gsap, prefersReduced, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { Smile } from './icons';

type UI = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  reelOpen: boolean;
  setReelOpen: (open: boolean) => void;
  /** false until the preloader (first visit) has finished */
  introDone: boolean;
  setIntroDone: (done: boolean) => void;
  /** client-side navigation with the page wipe; also handles same-page #hash links */
  navigate: (href: string) => void;
  scrollTo: (target: number | HTMLElement) => void;
};

const UIContext = createContext<UI | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const lenis = useRef<Lenis | null>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const wiping = useRef(false);

  // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (prefersReduced()) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.6 });
    lenis.current = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // Lock page scroll while an overlay (or the preloader) is up.
  const locked = menuOpen || reelOpen || !introDone;
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', locked);
    if (locked) lenis.current?.stop();
    else lenis.current?.start();
  }, [locked]);

  const scrollTo = useCallback((target: number | HTMLElement) => {
    if (lenis.current) lenis.current.scrollTo(target, { duration: 1.4 });
    else if (typeof target === 'number') window.scrollTo({ top: target });
    else target.scrollIntoView();
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      setMenuOpen(false);
      if (url.pathname === window.location.pathname) {
        const el = url.hash ? document.querySelector<HTMLElement>(url.hash) : null;
        scrollTo(el ?? 0);
        return;
      }
      sound.playTransition();
      const dest = url.pathname + url.hash;
      if (prefersReduced() || !wipe.current) {
        router.push(dest);
        return;
      }
      wiping.current = true;
      // GSAP reads the initial `translate-y-full` class as a px `y`; zero it so only yPercent moves the panel.
      gsap.fromTo(wipe.current, { y: 0, yPercent: 100 }, { y: 0, yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => router.push(dest, { scroll: false }) });
    },
    [router, scrollTo]
  );

  // After every route change: reset scroll, uncover the page, re-measure triggers.
  useEffect(() => {
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    if (wiping.current && wipe.current) {
      wiping.current = false;
      gsap.fromTo(wipe.current, { y: 0, yPercent: 0 }, { y: 0, yPercent: -100, duration: 0.8, ease: 'expo.inOut', delay: 0.1 });
    }
    const timers = [
      setTimeout(() => ScrollTrigger.refresh(), 300),
      setTimeout(() => {
        const el = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
        if (el) scrollTo(el);
      }, 450)
    ];
    return () => timers.forEach(clearTimeout);
  }, [pathname, scrollTo]);

  // Escape closes overlays; buttons and links click.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      setReelOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) sound.playClick();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const value = useMemo(
    () => ({ menuOpen, setMenuOpen, reelOpen, setReelOpen, introDone, setIntroDone, navigate, scrollTo }),
    [menuOpen, reelOpen, introDone, navigate, scrollTo]
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <div ref={wipe} aria-hidden="true" className="fixed inset-0 z-190 grid translate-y-full place-items-center bg-ink">
        <Smile className="w-14 fill-accent" />
      </div>
    </UIContext.Provider>
  );
}
