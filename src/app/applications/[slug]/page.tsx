import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SandboxButton } from '@/components/SandboxButton';
import { TransitionLink } from '@/components/TransitionLink';
import { Lines } from '@/components/type';
import { applications, findApp, pad, slugOf } from '@/lib/applications';
import { pill } from '@/lib/ui';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return applications.map((app) => ({ slug: slugOf(app) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = applications[findApp((await params).slug)];
  return app ? { title: app.name, description: app.tagline } : {};
}

export default async function ApplicationPage({ params }: Props) {
  const i = findApp((await params).slug);
  if (i < 0) notFound();
  const app = applications[i];
  const n = applications.length;
  const prev = applications[(i - 1 + n) % n];
  const next = applications[(i + 1) % n];

  return (
    <article className="wrap text-white">
      <header data-hero className="pt-[calc(var(--spacing-header)+var(--spacing-block))] pb-12">
        <p className="tag text-white/60">
          [{app.id}] {app.category}
        </p>
        <Lines as="h1" hero className="t-mega mt-4 mb-6 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.12)]" lines={[app.name]} />
        <p className="max-w-[40ch] text-lead text-white/80">{app.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SandboxButton />
          <TransitionLink
            href="/applications"
            className="inline-flex min-h-11 cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border border-white/20 bg-transparent px-6 text-small font-medium leading-none text-white no-underline transition-colors duration-300 hover:border-[#b6ff66] hover:bg-[#b6ff66] hover:text-[#000000]"
          >
            ← All applications
          </TransitionLink>
        </div>
      </header>

      {/* Reduced size product image frame with clean browser bar */}
      <figure
        data-reveal
        className="mx-auto overflow-hidden rounded-2xl border border-white/15 bg-[#0a0c0e] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
        style={{ maxWidth: 'min(920px, 100%)' }}
      >
        <figcaption className="flex items-center gap-4 border-b border-white/10 bg-black/40 px-4 py-3 text-xs sm:text-small font-mono text-white/60">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full bg-white/20" />
            <i className="size-2.5 rounded-full bg-white/20" />
            <i className="size-2.5 rounded-full bg-white/20" />
          </span>
          drava.os/applications/{slugOf(app)}
        </figcaption>
        <div className="relative w-full overflow-hidden bg-black/40 p-2 sm:p-4">
          <Image
            src={app.image}
            alt={`${app.name} interface preview`}
            priority
            quality={95}
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 920px"
            className="block h-auto w-full rounded-xl object-contain object-center"
          />
        </div>
      </figure>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {app.metrics.map((m) => (
          <div key={m.label} data-reveal className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <span className="tag text-white/60 font-mono">[{m.label}]</span>
            <span className="t-h3 mt-3 block text-white font-display font-bold">{m.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-x-gutter gap-y-12 py-block lg:grid-cols-2">
        <div>
          <h2 className="tag text-[#b6ff66] mb-4 font-mono font-semibold tracking-widest uppercase">Overview</h2>
          <p className="text-lead text-white/80 leading-relaxed">{app.description}</p>
        </div>
        <div>
          <h2 className="tag text-[#b6ff66] mb-4 font-mono font-semibold tracking-widest uppercase">Key capabilities</h2>
          <ul className="border-t border-white/15">
            {app.highlights.map((h) => (
              <li key={h} className="relative border-b border-white/15 py-4 pl-8 text-white/90 leading-relaxed before:absolute before:top-[calc(1rem+0.45em)] before:left-0 before:size-2 before:rounded-full before:bg-[#b6ff66]">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <nav aria-label="More applications" className="grid grid-cols-2 items-center gap-4 border-t border-white/15 pt-8 pb-block sm:grid-cols-[1fr_auto_1fr]">
        <TransitionLink href={`/applications/${slugOf(prev)}`} className="group grid justify-items-start gap-2 no-underline">
          <span className="tag text-white/50 group-hover:text-[#b6ff66] transition-colors">← Previous</span>
          <span className="t-h3 text-white transition-colors group-hover:text-[#b6ff66]">{prev.name}</span>
        </TransitionLink>
        <span className="tag text-white/50 font-mono max-sm:hidden">
          {app.id} / {pad(n)}
        </span>
        <TransitionLink href={`/applications/${slugOf(next)}`} className="group grid justify-items-end gap-2 text-right no-underline">
          <span className="tag text-white/50 group-hover:text-[#b6ff66] transition-colors">Next →</span>
          <span className="t-h3 text-white transition-colors group-hover:text-[#b6ff66]">{next.name}</span>
        </TransitionLink>
      </nav>
    </article>
  );
}
