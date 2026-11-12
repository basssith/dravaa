'use client';

const COMPANION_ITEMS = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-application context continuity'
];

export function CompanionSection() {
  return (
    <section
      id="approach"
      data-companion-card
      className="relative z-30 min-h-screen w-full bg-[#000000] text-white py-section lg:py-36 overflow-hidden rounded-t-[32px] sm:rounded-t-[48px] shadow-[0_-30px_70px_rgba(0,0,0,0.6)]"
    >
      {/* --- MAIN CONTENT GRID (SWAPPED SIDES) --- */}
      <div className="wrap relative z-20 flex min-h-[75vh] flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* --- LEFT SIDE: TWO-LINE HEADLINE & REDUCED SUBHEADING ---
              Line 1: Meet the Drava (white)
              Line 2: Companion. (BLACK font inside full solid green rectangle covering entire word, no shadow)
          */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-display text-[clamp(2.4rem,1.9rem+2.8vw,4.8rem)] font-bold tracking-tight leading-[1.08] text-white">
              <span className="block text-white">Meet the Drava</span>
              <span className="inline-block mt-3 bg-[#b6ff66] text-[#000000] font-bold px-4 sm:px-6 py-1.5 sm:py-2 rounded-[6px] tracking-tight">
                Companion.
              </span>
            </h2>

            {/* Refined subheading */}
            <p className="mt-6 max-w-[50ch] text-[clamp(0.92rem,0.88rem+0.25vw,1.06rem)] leading-relaxed text-[#a0a5b0]">
              Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges
              applications and guides zero-friction workflows in real time.
            </p>
          </div>

          {/* --- RIGHT SIDE: 3 NUMBERED POINTS ---
              Normal grey font numbers (no box around numbers)
          */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <ol className="divide-y divide-white/10 border-t border-b border-white/10">
              {COMPANION_ITEMS.map((item, i) => (
                <li
                  key={item}
                  className="py-6 sm:py-7 flex items-baseline gap-5 sm:gap-6 group transition-colors duration-300"
                >
                  <span className="font-mono text-sm sm:text-base font-medium tracking-widest text-[#888c94] select-none">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[clamp(1.1rem,1rem+0.45vw,1.45rem)] font-semibold tracking-tight text-[#f0f2f5] leading-snug group-hover:text-accent transition-colors duration-300">
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
