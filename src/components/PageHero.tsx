import type { ReactNode } from 'react';
import { cn } from '@/lib/ui';
import { Lines } from './type';

type Props = {
  id?: string;
  kicker?: ReactNode;
  lines: string[];
  highlight?: number;
  sub: string;
  cue: string;
  /** home hero fills the screen; inner pages are a bit shorter */
  full?: boolean;
  action?: ReactNode;
  /** centered layout for home hero with background animation */
  centered?: boolean;
  background?: ReactNode;
};

export function PageHero({ id, kicker, lines, highlight, sub, cue, full, action, centered, background }: Props) {
  if (centered) {
    return (
      <section
        id={id}
        data-hero
        className={cn(
          'relative flex flex-col justify-between overflow-hidden px-gutter pt-[calc(var(--spacing-header)+--spacing(3))] pb-8 lg:pb-10',
          full ? 'min-h-svh' : 'min-h-[86svh]'
        )}
      >
        {background}
        {kicker ? <p className="tag mx-auto mb-auto text-center">{kicker}</p> : <div />}

        {/* Centered content block with refined, smaller typographic size */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-[800px] mx-auto px-4">
          <Lines
            as="h1"
            hero
            className="font-display text-[clamp(2rem,1.4rem+3.2vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] uppercase mb-5"
            lines={lines}
            highlight={highlight}
          />
          <p className="max-w-[48ch] text-[clamp(0.9rem,0.8rem+0.3vw,1.05rem)] leading-relaxed text-ink-2 mb-7">
            {sub}
          </p>
          {action && <div className="flex justify-center">{action}</div>}
        </div>

        {/* Bottom center scroll indicator line */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-2">
          <div className="flex flex-col items-center gap-2">
            <span className="h-9 w-0.5 animate-cue bg-accent rounded-full shadow-[0_0_10px_rgba(182,255,102,0.85)]" />
            <span className="tag text-ink-2 font-medium tracking-widest text-[10px]">SCROLL</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      data-hero
      className={cn(
        'relative flex flex-col justify-end overflow-hidden px-gutter pt-[calc(var(--spacing-header)+--spacing(3))] pb-8 lg:pb-10',
        full ? 'min-h-svh' : 'min-h-[86svh]'
      )}
    >
      {background}
      {kicker ? <p className="tag text-white/60 relative z-10 mb-auto">{kicker}</p> : null}
      <div className="relative z-10 mt-auto">
        <Lines as="h1" hero className="t-h1 mb-6 lg:mb-8 text-white" lines={lines} highlight={highlight} />
      </div>
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-5 lg:pt-6">
        <div className="flex flex-col items-start gap-4">
          <p className="max-w-[46ch] text-[clamp(0.95rem,0.85rem+0.35vw,1.15rem)] leading-relaxed text-white/80">{sub}</p>
          {action && <div className="self-start">{action}</div>}
        </div>
        <p className="tag text-white/60 flex items-center gap-3">
          <i aria-hidden="true" className="h-7 w-px animate-cue bg-white" />
          {cue}
        </p>
      </div>
    </section>
  );
}
