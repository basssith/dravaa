'use client';

import { useEffect, useState } from 'react';
import { sound } from '@/lib/sound';
import { cn, iconBtn, pill } from '@/lib/ui';
import { Smile } from './icons';
import { TransitionLink } from './TransitionLink';
import { useUI } from './UIProvider';

export function Header() {
  const { menuOpen, setMenuOpen } = useUI();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 160);
      setScrolled(y > 40);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onDark = menuOpen;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-60 flex h-header items-center justify-between px-gutter transition-[transform,background-color,color] duration-500 ease-expo',
        hidden && !menuOpen && '-translate-y-[110%]',
        scrolled && !menuOpen && 'bg-black/80 backdrop-blur-md border-b border-white/5',
        onDark && 'text-paper'
      )}
    >
      <TransitionLink
        href="/"
        aria-label="Drava home"
        className="flex items-center gap-2 font-display text-[1.375rem] font-bold leading-none tracking-tight no-underline text-white transition-colors duration-300"
      >
        <Smile className="w-7 fill-[#b6ff66]" />
        <span className="hover:text-[#b6ff66] transition-colors duration-300">drava</span>
      </TransitionLink>

      <div className="flex items-center gap-3">
        <TransitionLink
          href="/applications"
          className="max-md:hidden inline-flex min-h-11 cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border border-white/20 bg-transparent px-6 text-small font-semibold tracking-wider uppercase text-white no-underline transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000]"
        >
          Explore all applications
        </TransitionLink>

        <TransitionLink
          href="#contact"
          className="group max-sm:hidden inline-flex min-h-11 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-white/20 bg-transparent px-6 text-small font-semibold tracking-wider text-white no-underline transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000]"
        >
          <span className="size-2 rounded-full bg-[#b6ff66] group-hover:bg-[#000000] transition-colors duration-300" />
          Let&apos;s talk
        </TransitionLink>

        <button
          type="button"
          id="menu-btn"
          className="inline-flex min-h-11 cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border border-white/20 bg-transparent px-6 text-small font-semibold tracking-wider text-white transition-all duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000]"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <span className="grid w-4 gap-1">
            <i className={cn('h-[1.5px] bg-current transition-transform duration-500 ease-expo', menuOpen && 'translate-y-[2.75px] rotate-45')} />
            <i className={cn('h-[1.5px] bg-current transition-transform duration-500 ease-expo', menuOpen && '-translate-y-[2.75px] -rotate-45')} />
          </span>
        </button>
      </div>
    </header>
  );
}
