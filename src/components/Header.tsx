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
  const [soundOn, setSoundOn] = useState(false);

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
  const outline = onDark ? 'border-line-inv' : undefined;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-60 flex h-header items-center justify-between px-gutter transition-[transform,background-color,color] duration-500 ease-expo',
        hidden && !menuOpen && '-translate-y-[110%]',
        scrolled && !menuOpen && 'bg-bg/80 backdrop-blur-md',
        onDark && 'text-paper'
      )}
    >
      <TransitionLink href="/" aria-label="Drava home" className="flex items-center gap-2 font-display text-[1.375rem] font-bold leading-none tracking-tight no-underline">
        <Smile className="w-7 fill-accent transition-colors duration-500" />
        <span>drava</span>
      </TransitionLink>

      <div className="flex items-center gap-2">
        <TransitionLink href="#contact" className={pill('dark', 'max-sm:hidden')}>
          <span className="size-2 rounded-full bg-accent" />
          Let&apos;s talk
        </TransitionLink>

        <button
          type="button"
          className={iconBtn(outline)}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          onClick={() => setSoundOn(sound.toggle())}
        >
          <span className="flex h-3.5 items-center gap-0.5">
            {[0, 0.2, 0.4, 0.6].map((delay) => (
              <i key={delay} className={cn('h-1 w-0.5 rounded-[1px] bg-current', soundOn && 'animate-eq')} style={{ animationDelay: `${delay}s` }} />
            ))}
          </span>
        </button>

        <button
          type="button"
          id="menu-btn"
          className={pill('outline', outline)}
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
