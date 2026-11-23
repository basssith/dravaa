import { SMILE_EYES, SMILE_PATH } from '@/lib/smile';
import { cn } from '@/lib/ui';

/** Drava smile mark. Fills with currentColor unless a fill-* class is given. */
export function Smile({ className }: { className?: string }) {
  return (
    <svg className={cn('fill-current', className)} viewBox="0 0 170 165" aria-hidden="true">
      {SMILE_EYES.map(([x, y, s]) => (
        <rect key={x} x={x} y={y} width={s} height={s} rx="4" />
      ))}
      <path d={SMILE_PATH} />
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-3 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]', className)}
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <path d="M2.5 6h7M9.5 6 6 2.5M9.5 6 6 9.5" />
    </svg>
  );
}

/** Lime circle with an arrow, used inside pill buttons. */
export function ArrowDot({ className }: { className?: string }) {
  return (
    <span className={cn('-mr-3 grid size-7 place-items-center rounded-full bg-accent text-ink transition-colors duration-300', className)}>
      <Arrow />
    </span>
  );
}
