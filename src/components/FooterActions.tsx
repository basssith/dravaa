'use client';

import confetti from 'canvas-confetti';
import { useState, type FormEvent } from 'react';
import { prefersReduced } from '@/lib/gsap';
import { cn } from '@/lib/ui';
import { Arrow } from './icons';
import { useUI } from './UIProvider';

/** Front-end only for now — no newsletter backend is connected. */
export function Newsletter() {
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (!input.value || !input.checkValidity()) {
      input.focus();
      return;
    }
    if (!prefersReduced()) confetti({ particleCount: 90, spread: 80, origin: { y: 0.8 }, colors: ['#b6ff66', '#0d0d0d', '#f2f2ee'] });
    input.value = '';
    setDone(true);
  };

  return (
    <>
      <form onSubmit={submit} noValidate className="flex border-b border-paper/30 transition-colors focus-within:border-accent">
        <input
          type="email"
          name="email"
          required
          placeholder="Your work email"
          aria-label="Work email"
          className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-paper-muted"
        />
        <button type="submit" aria-label="Join early access" className="grid w-11 cursor-pointer place-items-center text-accent">
          <Arrow className="size-4" />
        </button>
      </form>
      <p role="status" className={cn('mt-3 text-small text-accent', !done && 'hidden')}>
        ✓ You&apos;re on the list.
      </p>
    </>
  );
}

export function BackToTop({ className }: { className?: string }) {
  const { scrollTo } = useUI();
  return (
    <button type="button" className={cn('cursor-pointer', className)} onClick={() => scrollTo(0)}>
      Back to top ↑
    </button>
  );
}
