import type { ReactNode } from 'react';
import { cn } from '@/lib/ui';
import { Lines } from './type';

type Props = {
  id?: string;
  kicker: ReactNode;
  lines: string[];
  highlight?: number;
  sub: string;
  cue: string;
  /** home hero fills the screen; inner pages are a bit shorter */
  full?: boolean;
};

export function PageHero({ id, kicker, lines, highlight, sub, cue, full }: Props) {
  return (
    <section
      id={id}
      data-hero
      className={cn(
        'relative flex flex-col justify-end px-gutter pt-[calc(var(--spacing-header)+--spacing(8))] pb-8',
        full ? 'min-h-svh' : 'min-h-[86svh]'
      )}
    >
      <p className="tag mb-auto">{kicker}</p>
      <Lines as="h1" hero className="t-h1 mb-8" lines={lines} highlight={highlight} />
      <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
        <p className="max-w-[44ch] text-lead text-ink-2">{sub}</p>
        <p className="tag flex items-center gap-3">
          <i aria-hidden="true" className="h-9 w-px animate-cue bg-ink" />
          {cue}
        </p>
      </div>
    </section>
  );
}
