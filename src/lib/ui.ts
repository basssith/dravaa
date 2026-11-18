import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge our custom theme keys (globals.css @theme), otherwise it reads
// `text-small` as a colour and drops it when merged with e.g. `text-paper`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['micro', 'small', 'body', 'lead', 'h4', 'h3', 'h2', 'h1', 'mega'],
      spacing: ['gutter', 'block', 'block-lg', 'section', 'header']
    }
  }
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Dark pill button / link. */
export const pill =
  'inline-flex min-h-11 cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border border-ink bg-ink px-6 text-small font-medium leading-none text-paper no-underline transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-ink';
