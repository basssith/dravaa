import Image from 'next/image';
import { slugOf, type Application } from '@/lib/applications';
import { Arrow } from './icons';
import { TransitionLink } from './TransitionLink';

/** Two-column, staggered card grid. */
export function AppGrid({ apps }: { apps: Application[] }) {
  return (
    <div className="grid gap-x-8 gap-y-block md:grid-cols-2">
      {apps.map((app, i) => (
        <article key={app.id} data-reveal className={i % 2 === 1 ? 'md:mt-block-lg' : undefined}>
          <TransitionLink href={`/applications/${slugOf(app)}`} data-cursor="view" aria-label={`Open ${app.name}`} className="group block no-underline">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-bg-2">
              <Image
                src={app.image}
                alt=""
                fill
                sizes="(min-width: 760px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06]"
              />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="tag">[{app.id}]</span>
              <span className="text-micro tracking-[0.06em] text-muted uppercase">{[app.category, app.year, app.badge].join(' • ')}</span>
            </div>
            <h3 className="t-h3 mt-3 flex items-center justify-between gap-4">
              {app.name}
              <span className="grid size-11 flex-none scale-0 -rotate-45 place-items-center rounded-full bg-accent transition-transform duration-500 ease-expo group-hover:scale-100 group-focus-visible:scale-100">
                <Arrow />
              </span>
            </h3>
          </TransitionLink>
        </article>
      ))}
    </div>
  );
}

/** Compact index of every application. */
export function AppList({ apps }: { apps: Application[] }) {
  return (
    <ul className="border-t border-line">
      {apps.map((app) => (
        <li key={app.id} data-reveal>
          <TransitionLink
            href={`/applications/${slugOf(app)}`}
            data-cursor="view"
            className="grid grid-cols-[3rem_1fr_2.75rem] items-center gap-4 border-b border-line py-6 no-underline transition-[padding,background-color] duration-500 ease-expo hover:bg-accent hover:px-4 lg:grid-cols-[4rem_1.2fr_2fr_5rem_2.75rem]"
          >
            <span className="tag">[{app.id}]</span>
            <span className="font-display text-h4 leading-none font-bold tracking-[-0.02em] uppercase">{app.name}</span>
            <span className="text-small text-ink-2 max-lg:hidden">{app.category}</span>
            <span className="text-small text-ink-2 max-lg:hidden">{app.year}</span>
            <span className="justify-self-end">
              <Arrow className="size-[18px] -rotate-45" />
            </span>
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}
