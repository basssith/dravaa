import { cn } from '@/lib/ui';
import { Smile } from './icons';

type Props = {
  items: string[];
  label?: string;
  reverse?: boolean;
  slow?: boolean;
  bordered?: boolean;
  /** 'mega' for the statement band, 'h2' for the stacked name rows */
  size?: 'mega' | 'h2';
  /** smile colour */
  accent?: boolean;
};

/** Endless horizontal ticker. Items are duplicated so the -50% loop is seamless; alternate items are outlined. */
export function Marquee({ items, label, reverse, slow, bordered, size = 'mega', accent }: Props) {
  const group = items.map((text, i) => (
    <span
      key={i}
      className={cn(
        'flex items-center gap-[0.35em] pr-[0.35em] font-display font-bold whitespace-nowrap uppercase leading-none tracking-display text-[#000000]',
        size === 'mega' ? 'text-mega' : 'text-h2',
        i % 2 === 1 && 'text-outline [--outline-color:#000000]'
      )}
    >
      {text}
      <Smile className={cn('h-[0.6em] w-auto', accent ? 'fill-accent' : 'fill-[#000000]')} />
    </span>
  ));

  return (
    <section
      aria-label={label}
      className={cn('relative z-1 overflow-hidden bg-white text-[#000000]', size === 'mega' ? 'py-block' : 'py-2', bordered && 'border-y border-black/10')}
    >
      <div
        aria-hidden="true"
        className={cn('flex w-max animate-marquee', reverse && '[animation-direction:reverse]', slow && '[animation-duration:56s]')}
      >
        {group}
        {group}
      </div>
    </section>
  );
}
