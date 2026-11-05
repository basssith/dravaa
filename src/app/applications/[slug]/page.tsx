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
    <article className="wrap">
      <header data-hero className="pt-[calc(var(--spacing-header)+var(--spacing-block))] pb-12">
        <p className="tag">
          [{app.id}] {app.category}
        </p>
        <Lines as="h1" hero className="t-mega mt-4 mb-6" lines={[app.name]} />
        <p className="max-w-[40ch] text-lead text-ink-2">{app.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SandboxButton />
          <TransitionLink href="/applications" className={pill()}>
            ← All applications
          </TransitionLink>
        </div>
      </header>

      <figure data-reveal className="overflow-hidden rounded-card border border-line bg-surface">
        <figcaption className="flex items-center gap-4 border-b border-line px-4 py-3 text-small text-muted">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full bg-bg-2" />
            <i className="size-2.5 rounded-full bg-bg-2" />
            <i className="size-2.5 rounded-full bg-bg-2" />
          </span>
          drava.os/applications/{slugOf(app)}
        </figcaption>
        <div className="relative aspect-[16/10]">
          <Image src={app.image} alt={`${app.name} interface preview`} fill priority sizes="(min-width: 1680px) 1600px, 100vw" className="object-cover" />
        </div>
      </figure>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {app.metrics.map((m) => (
          <div key={m.label} data-reveal className="rounded-card bg-bg-2 p-6">
            <span className="tag">{m.label}</span>
            <span className="t-h3 mt-3 block">{m.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-x-gutter gap-y-12 py-block lg:grid-cols-2">
        <div>
          <h2 className="label mb-4">Overview</h2>
          <p className="text-lead text-ink-2">{app.description}</p>
        </div>
        <div>
          <h2 className="label mb-4">Key capabilities</h2>
          <ul className="border-t border-line">
            {app.highlights.map((h) => (
              <li key={h} className="relative border-b border-line py-4 pl-8 before:absolute before:top-[calc(1rem+0.45em)] before:left-0 before:size-2.5 before:rounded-[3px] before:bg-accent">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <nav aria-label="More applications" className="grid grid-cols-2 items-center gap-4 border-t border-line pt-8 pb-block sm:grid-cols-[1fr_auto_1fr]">
        <TransitionLink href={`/applications/${slugOf(prev)}`} className="group grid justify-items-start gap-2 no-underline">
          <span className="tag">← Previous</span>
          <span className="t-h3 transition-colors group-hover:text-muted">{prev.name}</span>
        </TransitionLink>
        <span className="tag max-sm:hidden">
          {app.id} / {pad(n)}
        </span>
        <TransitionLink href={`/applications/${slugOf(next)}`} className="group grid justify-items-end gap-2 text-right no-underline">
          <span className="tag">Next →</span>
          <span className="t-h3 transition-colors group-hover:text-muted">{next.name}</span>
        </TransitionLink>
      </nav>
    </article>
  );
}
