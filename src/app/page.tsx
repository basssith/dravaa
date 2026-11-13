import { AppGrid } from '@/components/Apps';
import { CompanionSection } from '@/components/CompanionSection';
import { CompanyWireframeSection } from '@/components/CompanyWireframeSection';
import { EcosystemScrollSection } from '@/components/EcosystemScrollSection';
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
  'Cross-product context continuity'
];

export default function Home() {
  return (
    <>
      <section
        id="hero"
        data-hero
        className="relative flex min-h-svh flex-col justify-end overflow-hidden px-gutter pt-[calc(var(--spacing-header)+--spacing(3))] pb-4 sm:pb-6 lg:pb-8 bg-[#000000]"
      >
        <MatrixFluidCanvas />

        {/* Bottom Left Content: 01 INTRO tag above The Drava moved slightly down */}
        <div className="relative z-10 mt-auto flex flex-col items-start gap-2 sm:gap-3 pb-2 sm:pb-4">
          <div className="inline-flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-[4px] leading-tight tracking-normal">
              01
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-white font-semibold">
              INTRO
            </span>
          </div>

          <h1 className="font-display text-[clamp(3.5rem,2.2rem+6vw,8rem)] font-bold tracking-tight text-white leading-none">
            <span>The </span>
            <span className="inline-flex items-center justify-center bg-[#b6ff66] text-[#000000] font-bold px-4 sm:px-6 py-1 sm:py-2 rounded-[8px] tracking-normal whitespace-nowrap shadow-none">
              Drava
            </span>
          </h1>
        </div>
      </section>

      <CompanyWireframeSection />

      <EcosystemScrollSection />

      <CompanionSection />

      <Marquee
        bordered
        label="Let's make technology feel effortless"
        items={["Let's make technology feel effortless", "Let's make technology feel effortless"]}
      />
    </>
  );
}
