'use client';

import confetti from 'canvas-confetti';
import { useState } from 'react';
import { prefersReduced } from '@/lib/gsap';
import { pill } from '@/lib/ui';
import { ArrowDot } from './icons';

export function SandboxButton() {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      className={pill('dark')}
      onClick={() => {
        if (!prefersReduced()) confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors: ['#b6ff66', '#0d0d0d', '#f2f2ee'] });
        setActive(true);
        setTimeout(() => setActive(false), 2200);
      }}
    >
      <span>{active ? 'Sandbox active ✓' : 'Launch sandbox'}</span>
      <ArrowDot />
    </button>
  );
}
