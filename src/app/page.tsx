import { CompanionSection } from '@/components/CompanionSection';
import { CompanyWireframeSection } from '@/components/CompanyWireframeSection';
import { EcosystemScrollSection } from '@/components/EcosystemScrollSection';
import { Marquee } from '@/components/Marquee';

export default function Home() {
  return (
    <>
      {/* Unified continuous Matrix & 3D Wireframe Experience (Section 1 + Section 2) */}
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
