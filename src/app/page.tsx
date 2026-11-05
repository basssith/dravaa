import { AppGrid } from '@/components/Apps';
import { HeroCanvas } from '@/components/HeroCanvas';
import { ArrowDot } from '@/components/icons';
import { Marquee } from '@/components/Marquee';
import { PageHero } from '@/components/PageHero';
import { ReelButton } from '@/components/Reel';
import { TransitionLink } from '@/components/TransitionLink';
import { Lines, SectionHead, WordScrub } from '@/components/type';
import { applications } from '@/lib/applications';
import { pill } from '@/lib/ui';

const COMPANION = [
  'Spatial telemetry & multi-modal perception',
  'Zero-latency neural automation engine',
  'Cross-application context continuity'
];

export default function Home() {
  return (
    <>
      <HeroCanvas />

      <PageHero
        id="hero"
        full
        kicker="[ Drava ecosystem — 2026 ]"
        lines={['Connecting', 'everything', 'into one', 'space.']}
        highlight={3}
        sub="Drava unifies high-velocity workspaces, autonomous intelligence and spatial computing — built for teams where work flows effortlessly."
        cue="Scroll to explore"
      />

      <section id="intro" className="section">
        <div className="wrap">
          <p className="tag">[01] What we do</p>
          <WordScrub
            className="t-statement mt-4 max-w-[22ch]"
            text="*Connecting everything, designing for *clarity, bringing it all into *one *unified *space. The new era of *Drava — where work flows *effortlessly."
          />
          <div className="mt-block flex flex-wrap gap-3">
            <TransitionLink href="#applications" className={pill('dark')}>
              Explore applications
              <ArrowDot />
            </TransitionLink>
            <ReelButton />
            <TransitionLink href="#approach" className={pill()}>
              Meet the Companion
            </TransitionLink>
          </div>
        </div>
      </section>

      <section id="applications" className="section">
        <div className="wrap">
          <SectionHead
            tag="[02] Featured applications"
            title={['The', 'ecosystem']}
            note="Each application solves one problem well — and shares context with the rest."
          />
          <AppGrid apps={applications.slice(0, 4)} />
          <div className="mt-block-lg flex justify-center">
            <TransitionLink href="/applications" className={pill('dark')}>
              See all applications
              <ArrowDot />
            </TransitionLink>
          </div>
        </div>
      </section>

      <section id="approach" className="section">
        {/* 1fr (not minmax(0,1fr)) so the text column can grow to fit "COMPANION." instead of clipping it */}
        <div className="wrap grid gap-gutter lg:grid-cols-[1fr_1fr]">
          {/* the 3D robot moves into this empty column */}
          <div aria-hidden="true" className="min-h-[62vh] lg:min-h-[80vh]" />
          <div>
            <p className="tag">[03] Approach</p>
            <Lines className="t-h2 mt-4" lines={['Meet the', 'Drava', 'Companion.']} highlight={2} />
            <p className="t-lead mt-8">
              Stationed at the edge of your digital universe. A continuous AI co-pilot that streamlines complex operations, bridges
              applications and guides zero-friction workflows in real time.
            </p>
            <ol className="mt-block border-t border-line">
              {COMPANION.map((item, i) => (
                <li key={item} data-reveal className="t-h4 grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-6">
                  <span className="tag pt-[0.6em]">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Marquee
        bordered
        label="Let's make technology feel effortless"
        items={["Let's make technology feel effortless", "Let's make technology feel effortless"]}
      />
    </>
  );
}
