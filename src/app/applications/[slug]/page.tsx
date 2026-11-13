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

      {/* Premium Laptop Mockup */}
      <div data-reveal className="mx-auto w-full max-w-[960px] px-2 sm:px-4">
        {/* Laptop Display (Lid) */}
        <div className="relative mx-auto rounded-[20px] sm:rounded-[24px] border-[3px] sm:border-[4px] border-[#22252a] bg-[#0d0f12] p-2.5 sm:p-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
          {/* Web camera notch */}
          <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            <span className="size-1 sm:size-1.5 rounded-full bg-[#1a1c20]" />
            <span className="size-1.5 sm:size-2 rounded-full bg-[#111317] ring-1 ring-white/10" />
          </div>

          {/* Screen Inner Frame */}
          <div className="overflow-hidden rounded-[12px] sm:rounded-[14px] border border-white/10 bg-[#000000]">
            {/* Window Browser / Header Bar */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-[#0d0f13]/90 px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono text-white/60">
              <span className="flex gap-1.5" aria-hidden="true">
                <i className="size-2.5 rounded-full bg-[#ff5f57]" />
                <i className="size-2.5 rounded-full bg-[#febc2e]" />
                <i className="size-2.5 rounded-full bg-[#28c840]" />
              </span>
              <span className="ml-2 truncate text-white/50">
                drava.os/applications/{slugOf(app)}
              </span>
            </div>

            {/* Screen Content Preview */}
            <div className="relative aspect-[16/10] w-full bg-[#050608] overflow-hidden">
              <Image
                src={app.image}
                alt={`${app.name} interface preview`}
                priority
                quality={95}
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 920px"
                className="object-contain object-top w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Laptop Bottom Base & Hinge */}
        <div className="relative mx-auto -mt-[1px] w-[94%] sm:w-[92%]">
          {/* Hinge recess bar */}
          <div className="mx-auto h-2 sm:h-2.5 w-24 sm:w-36 rounded-b-[4px] bg-[#16181c] border-x border-b border-white/10" />
          {/* Main aluminum unibody base */}
          <div className="h-3 sm:h-4 w-full rounded-b-[14px] sm:rounded-b-[18px] bg-gradient-to-b from-[#2a2d33] via-[#1c1e22] to-[#121417] shadow-[0_15px_30px_rgba(0,0,0,0.9)] border-t border-white/20 border-b border-black">
            {/* Center thumb groove opening */}
            <div className="mx-auto h-1 sm:h-1.5 w-16 sm:w-24 rounded-b-[6px] bg-[#101215]" />
          </div>
        </div>
      </div>

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
