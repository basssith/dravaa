import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge our custom theme keys (globals.css @theme), otherwise it reads
// `text-small` as a colour and drops it when merged with e.g. `text-paper`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['micro', 'small', 'body', 'lead', 'h4', 'h3', 'statement', 'h2', 'h1', 'mega'],
      spacing: ['gutter', 'block', 'block-lg', 'section', 'header']
    }
  }
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Pill button / link. One shape, three colour variants. */
export const pill = (variant: 'outline' | 'dark' | 'light' = 'outline', extra?: string) =>
  cn(
    'inline-flex min-h-11 cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border px-6 text-small font-medium leading-none no-underline transition-colors duration-300',
    variant === 'outline' && 'border-line hover:border-ink hover:bg-ink hover:text-paper',
    variant === 'dark' && 'border-ink bg-ink text-paper hover:border-accent hover:bg-accent hover:text-ink',
    variant === 'light' && 'border-white/25 text-white hover:border-accent hover:bg-accent hover:text-ink',
    extra
  );

/** Round 44px icon button. */
export const iconBtn = (extra?: string) =>
  cn(
    'grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-transparent transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper',
    extra
  );
