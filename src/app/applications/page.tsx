import type { Metadata } from 'next';
import { AppGrid, AppList } from '@/components/Apps';
import { PageHero } from '@/components/PageHero';
import { SectionHead, WordScrub } from '@/components/type';
import { applications, pad } from '@/lib/applications';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Every product in the Drava ecosystem, from facility intelligence to generative design.'
};

export default function ApplicationsPage() {
  return (
    <div className="text-white">
      <PageHero
        kicker={
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-white uppercase">
            PRODUCTS
          </span>
        }
        lines={['Everything', 'in one', 'space.']}
        highlight={2}
        sub="Every Drava product, from facility control to generative design. Pick one to dive in."
        cue="Scroll to explore"
      />

      <section className="section" aria-label="Product gallery">
        <div className="wrap">
          <AppGrid apps={applications} />
        </div>
      </section>

      <section id="index" className="section">
        <div className="wrap">
          <SectionHead
            tag=""
            title={['All products']}
            note={<WordScrub as="span" text="The full list at a glance. Select a row to open its page." />}
          />
          <AppList apps={applications} />
        </div>
      </section>
    </div>
  );
}
