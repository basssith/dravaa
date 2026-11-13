import Image from 'next/image';
import { slugOf, type Application } from '@/lib/applications';
import { Arrow } from './icons';
import { TransitionLink } from './TransitionLink';

/** Two-column grid with cards side-by-side: card 1 on left, card 2 on right in same horizontal row. */
export function AppGrid({ apps }: { apps: Application[] }) {
  return (
    <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 md:gap-y-24">
      {apps.map((app) => (
        <article
          key={app.id}
          data-reveal
          data-app-card
          className="w-full"
        >
          <TransitionLink
            href={`/applications/${slugOf(app)}`}
            aria-label={`Open ${app.name}`}
            className="group block no-underline"
          >
            {/* Same aspect-video and dimensions for all cards with 3D perspective container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-card bg-bg-2 [perspective:1000px]">
              <Image
                src={app.image}
                alt=""
                fill
                quality={100}
                placeholder="blur"
                sizes="(min-width: 760px) 50vw, 100vw"
                className="hover-blur-shake app-card-img object-cover will-change-transform"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="tag text-white/60">[{app.id}]</span>
              <span className="text-micro tracking-[0.06em] text-white/60 uppercase">
                {[app.category, app.year, app.badge].join(' • ')}
              </span>
            </div>

            <h3 className="t-h3 mt-3 flex items-center gap-3 text-white">
              <span>{app.name}</span>
              {/* Arrow mark that illuminates on hover */}
              <span className="inline-flex items-center text-[#b6ff66] opacity-0 -translate-x-2 transition-all duration-300 ease-expo group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
                <Arrow className="size-5 stroke-[2.2] -rotate-45" />
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
    <ul className="border-t border-white/15 text-white">
      {apps.map((app) => (
        <li key={app.id} data-reveal>
          <TransitionLink
            href={`/applications/${slugOf(app)}`}
            className="group grid grid-cols-[3rem_1fr_2.75rem] items-center gap-4 border-b border-white/15 py-6 no-underline transition-[padding,background-color] duration-500 ease-expo hover:bg-[#b6ff66] hover:text-[#000000] hover:px-4 lg:grid-cols-[4rem_1.2fr_2fr_5rem_2.75rem]"
          >
            <span className="tag text-white/60 group-hover:text-black">[{app.id}]</span>
            <span className="font-display text-h4 leading-none font-bold tracking-[-0.02em] uppercase text-white group-hover:text-black">{app.name}</span>
            <span className="text-small text-white/80 group-hover:text-black max-lg:hidden">{app.category}</span>
            <span className="text-small text-white/80 group-hover:text-black max-lg:hidden">{app.year}</span>
            <span className="justify-self-end text-white group-hover:text-black">
              <Arrow className="size-[18px] -rotate-45" />
            </span>
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}
