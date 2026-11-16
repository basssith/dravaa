import { cn } from '@/lib/ui';
import { Smile } from './icons';

export type MarqueeRowConfig = {
  items: string[];
  reverse?: boolean;
  slow?: boolean;
  outlineFirst?: boolean;
};

type Props = {
  items?: string[];
  rows?: MarqueeRowConfig[];
  label?: string;
  reverse?: boolean;
  slow?: boolean;
  bordered?: boolean;
  /** 'mega' for the statement band, 'h2' for the stacked name rows, 'small' for compact dual-row band */
  size?: 'mega' | 'h2' | 'small';
  /** smile colour */
  accent?: boolean;
  className?: string;
};

function MarqueeRow({
  items,
  reverse,
  slow,
  outlineFirst,
  size = 'mega',
}: {
  items: string[];
  reverse?: boolean;
  slow?: boolean;
  outlineFirst?: boolean;
  size?: 'mega' | 'h2' | 'small';
}) {
  const isOutline = (index: number) => {
    return outlineFirst ? index % 2 === 0 : index % 2 === 1;
  };

  const group = items.map((text, i) => (
    <span
      key={i}
      className={cn(
        'flex items-center gap-[0.4em] pr-[0.4em] font-display font-bold whitespace-nowrap uppercase leading-none tracking-display text-[#000000]',
        size === 'small'
          ? 'text-[clamp(1.5rem,1.1rem+1.8vw,3rem)]'
          : size === 'mega'
          ? 'text-mega'
          : 'text-h2',
        isOutline(i) && 'text-outline [--outline-color:#000000]'
      )}
    >
      <span>{text}</span>
      <Smile className="h-[0.65em] w-auto fill-[#b6ff66] flex-shrink-0" />
    </span>
  ));

  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex w-max animate-marquee select-none',
        reverse && '[animation-direction:reverse]',
        slow && '[animation-duration:56s]'
      )}
    >
      {group}
      {group}
    </div>
  );
}

/** Endless horizontal ticker. Items are duplicated so the -50% loop is seamless; alternate items are outlined. */
export function Marquee({
  items,
  rows,
  label,
  reverse,
  slow,
  bordered,
  size = 'mega',
  className,
}: Props) {
  // If multiple stacked rows are configured (e.g. dual-row contra-flow marquee)
  if (rows && rows.length > 0) {
    return (
      <section
        aria-label={label}
        className={cn(
          'relative z-1 overflow-hidden bg-white text-[#000000]',
          size === 'small' ? 'py-8 sm:py-12 md:py-14' : size === 'mega' ? 'py-block' : 'py-4',
          bordered && 'border-y border-black/10',
          className
        )}
      >
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
          {rows.map((row, idx) => (
            <MarqueeRow
              key={idx}
              items={row.items}
              reverse={row.reverse}
              slow={row.slow}
              outlineFirst={row.outlineFirst}
              size={size}
            />
          ))}
        </div>
      </section>
    );
  }

  // Single row marquee (classic mode)
  return (
    <section
      aria-label={label}
      className={cn(
        'relative z-1 overflow-hidden bg-white text-[#000000]',
        size === 'small' ? 'py-6 sm:py-8' : size === 'mega' ? 'py-block' : 'py-2',
        bordered && 'border-y border-black/10',
        className
      )}
    >
      {items && (
        <MarqueeRow
          items={items}
          reverse={reverse}
          slow={slow}
          size={size}
        />
      )}
    </section>
  );
}
