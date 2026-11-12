import { AppGrid } from '@/components/Apps';
import { CompanionSection } from '@/components/CompanionSection';
import { MatrixFluidCanvas } from '@/components/MatrixFluidCanvas';
import { SnakeLine } from '@/components/SnakeLine';
import { ArrowDot } from '@/components/icons';
import { Marquee } from '@/components/Marquee';
import { PageHero } from '@/components/PageHero';
import { ReelButton } from '@/components/Reel';
import { TransitionLink } from '@/components/TransitionLink';
import { Lines, SectionHead, WordScrub } from '@/components/type';
import { SeeAllButton } from '@/components/SeeAllButton';
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
      <PageHero
        id="hero"
        full
        lines={['The Connected Ecosystem', 'for Modern Work.']}
        highlight={1}
        sub="Drava unifies high-velocity workspaces, autonomous intelligence and spatial computing — built for teams where work flows effortlessly."
        action={
          <SeeAllButton href="/applications" text="Explore all applications" />
        }
        cue="Scroll to explore"
        background={<MatrixFluidCanvas />}
      />

      <section id="intro" className="relative flex min-h-screen flex-col justify-center py-section overflow-hidden">
        <SnakeLine variant="intro" />
        <div className="wrap relative z-10 flex flex-col items-center text-center">
          <p className="tag mb-4">[01] What we do</p>
          <WordScrub
            className="t-statement max-w-[24ch] mx-auto text-center"
            text="*Connecting everything, designing for *clarity, bringing it all into *one unified *space. The new era of *Drava — where work flows *effortlessly."
          />
        </div>
      </section>

      <section id="applications" className="section pt-block-lg">
        <div className="wrap">
          <header className="mb-block flex flex-col items-start gap-4">
            <h2 className="font-display text-[clamp(2.5rem,1.8rem+2.8vw,5rem)] leading-[1.08] font-medium tracking-tight uppercase">
              THE <span className="highlight text-ink px-3 py-0.5 rounded-[4px]">ECOSYSTEM</span>
            </h2>
            <p className="max-w-[58ch] text-[clamp(1rem,0.9rem+0.35vw,1.2rem)] leading-relaxed text-ink-2">
              Each application solves one problem well — and shares context with the rest.
            </p>
          </header>
          <AppGrid apps={applications.slice(0, 4)} />
          <div className="mt-block-lg flex justify-center">
            <SeeAllButton href="/applications" text="SEE ALL APPLICATIONS" />
          </div>
        </div>
      </section>

      <CompanionSection />

      <Marquee
        bordered
        label="Let's make technology feel effortless"
        items={["Let's make technology feel effortless", "Let's make technology feel effortless"]}
      />
    </>
  );
}
