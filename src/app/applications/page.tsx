import type { Metadata } from 'next';
import { AppGrid, AppList } from '@/components/Apps';
import { PageHero } from '@/components/PageHero';
import { SectionHead } from '@/components/type';
import { applications, pad } from '@/lib/applications';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Every application in the Drava ecosystem, from facility intelligence to generative design.'
};

export default function ApplicationsPage() {
  return (
    <>
      <PageHero
        kicker={`[ Applications ] [${pad(applications.length)}]`}
        lines={['Everything', "we're", 'building.']}
        highlight={2}
        sub="Every Drava application, from facility control to generative design. Pick one to dive in."
        cue="Scroll to browse"
      />

      <section className="section" aria-label="Application gallery">
        <div className="wrap">
          <AppGrid apps={applications} />
        </div>
      </section>

      <section id="index" className="section">
        <div className="wrap">
          <SectionHead tag="[ Index ]" title={['All', 'applications']} note="The full list at a glance. Select a row to open its page." />
          <AppList apps={applications} />
        </div>
      </section>
    </>
  );
}
