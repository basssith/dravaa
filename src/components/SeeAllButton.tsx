'use client';

import { Arrow } from './icons';
import { TransitionLink } from './TransitionLink';

/**
 * Pill button with a single green dot that expands to cover the 100% full button on hover:
 * - Idle: White pill container with strictly ONE green dot and dark uppercase text.
 * - Hover: The single green dot scales up from its own position with a massive diameter
 *   (w-80 h-80) to cover the 100% full button edge to edge without any missing areas,
 *   while the text remains crisp dark ink and the right arrow slides in.
 */
export function SeeAllButton({
  href = '/applications',
  text = 'SEE ALL PRODUCTS'
}: {
  href?: string;
  text?: string;
}) {
  return (
    <TransitionLink
      href={href}
      className="group/btn relative inline-flex min-h-[52px] cursor-pointer items-center overflow-hidden rounded-full border border-line bg-surface px-7 text-[13px] font-semibold tracking-wider text-ink uppercase no-underline shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 ease-expo hover:border-accent hover:shadow-[0_8px_30px_rgba(182,255,102,0.4)]"
    >
      {/* 
        This is the ONLY green element.
        In idle state it is exactly a single 10px round green dot.
        On hover it smoothly expands to 380px with transform origin at its center,
        fully enveloping 100% of the entire button.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-7 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_rgba(182,255,102,0.8)] transition-transform duration-600 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/btn:scale-[70]"
      />

      {/* Button content (layered above the expanding green circle) */}
      <div className="relative z-10 flex items-center gap-3 pl-4 text-ink">
        {/* Text */}
        <span className="transition-transform duration-500 ease-expo group-hover/btn:-translate-x-0.5">
          {text}
        </span>

        {/* Black Right Arrow */}
        <span
          aria-hidden="true"
          className="grid size-4 place-items-center text-ink transition-transform duration-500 ease-expo group-hover/btn:translate-x-1"
        >
          <Arrow className="size-3.5 stroke-[2.4]" />
        </span>
      </div>
    </TransitionLink>
  );
}
