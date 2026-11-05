'use client';

import { useRef } from 'react';
import { iconBtn } from '@/lib/ui';
import { Smile } from './icons';
import { Lines } from './type';

// TODO: replace with real names, roles and photos.
const TEAM = ['Founder & CEO', 'Head of Design', 'Lead Engineer', 'AI Research', 'Hardware Lab'];

/** Native scroll-snap slider (touch swipe for free) plus mouse drag and arrow buttons. */
export function TeamSlider() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const step = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="section" aria-label="Team">
      <div className="wrap mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="tag">[04] Team</p>
          <Lines className="t-h2 mt-4" lines={['The people']} />
        </div>
        <div className="flex items-center gap-2">
          <span className="tag mr-3">Swipe or drag</span>
          <button type="button" className={iconBtn()} aria-label="Previous team member" onClick={() => step(-1)}>←</button>
          <button type="button" className={iconBtn()} aria-label="Next team member" onClick={() => step(1)}>→</button>
        </div>
      </div>

      <div
        ref={track}
        className="flex cursor-grab snap-x snap-mandatory scroll-px-gutter gap-6 overflow-x-auto px-[max(var(--spacing-gutter),calc((100vw-105rem)/2+var(--spacing-gutter)))] [scrollbar-width:none] data-[dragging]:cursor-grabbing data-[dragging]:snap-none data-[dragging]:select-none [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft };
          track.current.dataset.dragging = '';
          track.current.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current && track.current) track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          drag.current = null;
          delete track.current?.dataset.dragging;
        }}
        onPointerCancel={() => {
          drag.current = null;
          delete track.current?.dataset.dragging;
        }}
      >
        {TEAM.map((role) => (
          <article key={role} className="w-[clamp(15.5rem,26vw,23.75rem)] flex-none snap-start">
            <div className="pointer-events-none grid aspect-[3/4] place-items-center rounded-card bg-bg-2">
              <Smile className="w-[30%] opacity-[0.12]" />
            </div>
            <h3 className="t-h4 mt-4 mb-1">Team member</h3>
            <p className="tag">{role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
