'use client';

import { WordScrub } from './type';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-product context continuity'
];

export function CompanionSection() {
  return (
    <section
      id="approach"
      data-companion-card
      className="relative z-30 min-h-screen w-full bg-[#000000] text-white py-section lg:py-28 overflow-hidden flex flex-col justify-between"
    >
      {/* Background ambient subtle glow aligned with Drava green */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#b6ff66]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* --- TOP BAR: 04 COMPANION TAG --- */}
      <div className="wrap relative z-20 w-full pt-4">
        <div className="inline-flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
            04
          </span>
          <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
            COMPANION
          </span>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="wrap relative z-20 flex min-h-[65vh] flex-col justify-center my-auto">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* --- LEFT SIDE: TWO-LINE HEADLINE & SUBHEADING --- */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-display text-[clamp(2.4rem,1.9rem+2.8vw,4.6rem)] font-bold tracking-tight leading-[1.15] text-white">
              <span className="block text-white">
                Meet the{' '}
                <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-3 sm:px-5 py-0.5 sm:py-1 rounded-[6px] sm:rounded-[8px] tracking-normal whitespace-nowrap shadow-none align-baseline">
                  Drava
                </span>
              </span>
              <span className="block mt-2 text-white">
                companion.
              </span>
            </h2>

            {/* Refined subheading with scroll WordScrub */}
            <div className="mt-6 max-w-[50ch] text-[clamp(0.92rem,0.88rem+0.25vw,1.06rem)] leading-relaxed text-[#c8ccd6]">
              <WordScrub
                as="p"
                className="leading-relaxed"
                text="Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges products and guides zero-friction workflows in real time."
              />
            </div>
          </div>

          {/* --- RIGHT SIDE: 3 NUMBERED POINTS WITH DRAVA SIGNATURE HOVER --- */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <ol className="divide-y divide-white/10 border-t border-b border-white/10">
              {COMPANION_ITEMS.map((item, i) => (
                <li
                  key={item}
                  className="py-6 sm:py-7 flex items-baseline gap-5 sm:gap-6 group transition-colors duration-300 cursor-default"
                >
                  <span className="inline-flex items-center justify-center font-mono text-xs font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-white/10 text-white/80 group-hover:bg-[#b6ff66] group-hover:text-black transition-all duration-300 select-none">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[clamp(1.1rem,1rem+0.45vw,1.4rem)] font-semibold tracking-tight text-[#f0f2f5] leading-snug group-hover:text-[#b6ff66] transition-colors duration-300">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
}
