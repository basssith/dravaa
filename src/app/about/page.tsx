import type { Metadata } from 'next';
import { Marquee } from '@/components/Marquee';
import { PageHero } from '@/components/PageHero';
import { TeamSlider } from '@/components/TeamSlider';
import { SectionHead } from '@/components/type';
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
  { value: applications.length, label: 'Applications in the ecosystem' },
  { value: applications.reduce((s, a) => s + a.highlights.length, 0), label: 'Core capabilities' },
  { value: applications.reduce((s, a) => s + a.metrics.length, 0), label: 'Live telemetry signals' }
];

const NAMES = [...applications.map((a) => a.name), 'Companion', 'Drava OS'];
const rotate = (arr: string[], k: number) => arr.slice(k).concat(arr.slice(0, k));

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="[ About Drava ]"
        lines={['Technology', 'should make', 'life feel', 'easier.']}
        highlight={3}
        sub="Drava is a product studio building one connected ecosystem for the spaces where people work, create and gather."
        cue="Scroll to explore"
      />

      <section className="section">
        <div className="wrap grid gap-x-gutter gap-y-6 md:grid-cols-[1fr_2fr]">
          <p className="tag">[01] Who we are</p>
          <p data-reveal className="t-statement max-w-[34ch]">
            We design calm, connected software for teams that run busy spaces — so work moves between tools without friction.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead tag="[02] What we do best" title={['Expertise']} />
          <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {EXPERTISE.map((col, i) => (
              <div
                key={col.title}
                data-reveal
                className="border-b border-line py-8 sm:odd:border-r sm:odd:pr-4 sm:even:pl-4 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <p className="tag">[0{i + 1}]</p>
                {/* h3 set one step down (t-h4) because it sits in a dense four-column grid */}
                <h3 className="t-h4 mt-6 mb-4 font-bold tracking-[-0.02em] uppercase">{col.title}</h3>
                <ul className="leading-loose text-ink-2">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div aria-label="Drava applications" role="region">
        <Marquee size="h2" accent items={NAMES} />
        <Marquee size="h2" accent reverse slow items={rotate(NAMES, 1)} />
        <Marquee size="h2" accent items={rotate(NAMES, 2)} />
      </div>

      <section className="section">
        <div className="wrap">
          <SectionHead tag="[03] By the numbers" title={['In numbers']} />
          <div className="grid gap-x-gutter gap-y-8 md:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="border-t border-ink pt-6">
                <span data-count={s.value} className="t-mega block tabular-nums">
                  {pad(s.value)}
                </span>
                <p className="tag mt-4 text-ink-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamSlider />
    </>
  );
}
