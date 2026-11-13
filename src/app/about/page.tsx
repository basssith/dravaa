import type { Metadata } from 'next';
import { Marquee } from '@/components/Marquee';
import { PageHero } from '@/components/PageHero';
import { TeamSlider } from '@/components/TeamSlider';
import { SectionHead, WordScrub } from '@/components/type';
import { applications, pad } from '@/lib/applications';

export const metadata: Metadata = {
  title: 'About',
  description: 'Drava designs calm, connected software for teams that run busy spaces.'
};

const EXPERTISE = [
  { title: 'Spatial', items: ['Multi-screen canvas', 'Facility & environment control', 'Real-time media'] },
  { title: 'Intelligence', items: ['Neural vision', 'Autonomous companion', 'Predictive telemetry'] },
  { title: 'Workflow', items: ['Unified workspaces', 'Cross-app context', 'Automation'] },
  { title: 'Hardware', items: ['Tactile controls', 'Sensors & telemetry', 'Rapid prototyping'] }
];

// Computed from the real data — no invented numbers.
const STATS = [
  { value: applications.length, label: 'Products in the ecosystem' },
  { value: applications.reduce((s, a) => s + a.highlights.length, 0), label: 'Core capabilities' },
  { value: applications.reduce((s, a) => s + a.metrics.length, 0), label: 'Live telemetry signals' }
];

const NAMES = [...applications.map((a) => a.name), 'Companion', 'Drava OS'];
const rotate = (arr: string[], k: number) => arr.slice(k).concat(arr.slice(0, k));

export default function AboutPage() {
  return (
    <div className="text-white">
      <PageHero
        kicker={
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-white uppercase">
            ABOUT DRAVA
          </span>
        }
        lines={['Technology', 'should make', 'life feel', 'easier.']}
        highlight={3}
        sub="Drava is a product studio building one connected ecosystem for the spaces where people work, create and gather."
        cue="Scroll to explore"
      />

      <section className="section">
        <div className="wrap">
          <div className="mb-6">
            <span className="font-mono text-xs font-semibold tracking-widest text-white uppercase">
              WHO WE ARE
            </span>
          </div>
          <div data-reveal className="max-w-4xl">
            <WordScrub
              className="font-display text-[clamp(2rem,1.4rem+3.2vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.03em] uppercase text-white"
              text="We design calm, connected software for teams that run busy spaces — so work moves between tools without friction."
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            tag=""
            title={['Expertise']}
            note={
              <span className="font-mono text-xs font-semibold tracking-widest text-white uppercase">
                WHAT WE DO BEST
              </span>
            }
          />
          <div className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERTISE.map((col) => (
              <div
                key={col.title}
                data-reveal
                className="border-b border-white/15 py-8 sm:odd:border-r sm:odd:border-white/15 sm:odd:pr-4 sm:even:pl-4 lg:border-b-0 lg:border-r lg:border-white/15 lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                {/* h3 set one step down (t-h4) because it sits in a dense four-column grid */}
                <h3 className="t-h4 mt-2 mb-4 font-bold tracking-[-0.02em] uppercase text-white">{col.title}</h3>
                <ul className="leading-loose text-white/80 space-y-1">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-[#b6ff66]/70 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div aria-label="Drava products" role="region">
        <Marquee size="h2" accent items={NAMES} />
        <Marquee size="h2" accent reverse slow items={rotate(NAMES, 1)} />
        <Marquee size="h2" accent items={rotate(NAMES, 2)} />
      </div>

      <TeamSlider />
    </div>
  );
}
