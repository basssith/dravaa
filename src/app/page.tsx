import { AppGrid } from '@/components/Apps';
import { CompanionSection } from '@/components/CompanionSection';
import { CompanyWireframeSection } from '@/components/CompanyWireframeSection';
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
      <section
        id="hero"
        data-hero
        className="relative flex min-h-svh flex-col justify-end overflow-hidden px-gutter pt-[calc(var(--spacing-header)+--spacing(3))] pb-8 lg:pb-12 bg-[#393b3d]"
      >
        <MatrixFluidCanvas />

        {/* Bottom Left Content: just THE DRAVA with DRAVA in green rectangle box */}
        <div className="relative z-10 mt-auto flex flex-wrap items-baseline gap-3 sm:gap-4 pb-4">
          <h1 className="font-display text-[clamp(3.5rem,2.2rem+6vw,8rem)] font-bold tracking-tight uppercase text-white leading-none">
            <span>THE </span>
            <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-4 sm:px-6 py-1 sm:py-2 rounded-[8px] tracking-normal whitespace-nowrap shadow-none">
              DRAVA
            </span>
          </h1>
        </div>

        {/* Bottom edge scroll cue */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4 lg:pt-5">
          <p className="tag tracking-widest text-[#d0d4dc] font-mono text-xs">
            [00] INTRO
          </p>
          <p className="tag flex items-center gap-3 text-[#d0d4dc]">
            <i aria-hidden="true" className="h-7 w-px animate-cue bg-white" />
            Scroll to explore
          </p>
        </div>
      </section>

      <CompanyWireframeSection />

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
