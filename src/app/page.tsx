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
