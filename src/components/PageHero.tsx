import type { ReactNode } from 'react';
import { Lines } from './type';

type Props = {
  kicker?: ReactNode;
  lines: string[];
  highlight?: number;
  sub: string;
  cue: string;
};

export function PageHero({ kicker, lines, highlight, sub, cue }: Props) {
  return (
    <section
      data-hero
      className="relative flex min-h-svh flex-col justify-end overflow-hidden px-gutter pt-[calc(var(--spacing-header)+--spacing(3))] pb-12 lg:pb-16"
    >
      <div className="relative z-10 mt-auto flex flex-col items-start gap-4">
        {kicker ? <div className="tag text-white/60 mb-2">{kicker}</div> : null}
        <Lines as="h1" hero className="t-h1 text-white" lines={lines} highlight={highlight} />
      </div>
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 pt-6 lg:pt-8">
        <p className="max-w-[46ch] text-[clamp(0.95rem,0.85rem+0.35vw,1.15rem)] leading-relaxed text-white/80">{sub}</p>
        <p className="tag text-white/60 flex items-center gap-3">
          <i aria-hidden="true" className="h-7 w-px animate-cue bg-white" />
          {cue}
        </p>
      </div>
    </section>
  );
}
