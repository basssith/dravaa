'use client';

import { usePathname } from 'next/navigation';
import { EMAIL, SOCIALS } from '@/lib/site';
import { Arrow, Smile } from './icons';
import { BackToTop, Newsletter } from './FooterActions';

const linkCls = 'no-underline transition-colors duration-300 hover:text-accent';

export function Footer() {
  const pathname = usePathname();

  // On the Nex Experience Centre simulator, the dedicated simulator controls take the full viewport
  if (pathname === '/applications/nex') {
    return null;
  }

  return (
    <footer
      id="contact"
      className="relative z-40 w-full bg-[#000000] pt-block-lg text-paper"
    >
      <div className="wrap">
        <p className="tag text-white tracking-widest font-semibold">CONTACT</p>
        <a
          href={`mailto:${EMAIL}`}
          className="group mt-4 mb-block inline-flex items-center gap-[0.2em] font-display text-mega leading-[0.9] font-bold tracking-[-0.04em] no-underline focus-visible:outline-accent"
        >
          <span>Let&apos;s talk</span>
          <Arrow className="size-[0.5em] stroke-accent [stroke-width:1.3] transition-transform duration-700 ease-expo group-hover:-rotate-45" />
        </a>

        <div className="grid gap-8 border-t border-line-inv py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="label mb-4 text-paper-muted">Studio</h2>
            <address className="leading-[1.7] not-italic text-paper-2">
              White Tusker Private Limited
              <br />
              1331, 10th, 13th Cross Rd, Eshwara Layout
              <br />
              Indiranagar, Bengaluru
              <br />
              Karnataka 560038, India
            </address>
          </div>
          <div>
            <h2 className="label mb-4 text-paper-muted">Say hello</h2>
            <p className="leading-[1.7] text-paper-2">
              <a className={linkCls} href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
          <div>
            <h2 className="label mb-4 text-paper-muted">Follow</h2>
            <ul className="leading-[1.9]">
              {SOCIALS.map(([name, url]) => (
                <li key={name}>
                  <a className={linkCls} href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label mb-4 text-paper-muted">Early access</h2>
            <Newsletter />
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-line-inv py-6 text-small text-paper-muted">
          <span>© 2026 Drava, powered by White Tusker Private Limited</span>
          <BackToTop className={linkCls} />
        </div>

        {/* Sized to its container, so the whole wordmark always fits: smile + gap + Syne ExtraBold
            "drava" measures 5.305em (the font's own advance widths); 5.4 leaves ~2% so it never clips. */}
        <div aria-hidden="true" className="@container pt-10 pb-8">
          <div className="flex items-baseline gap-[0.14em] font-display text-[length:calc(100cqw/5.4)] leading-[0.8] font-extrabold">
            <Smile className="w-[0.56em] flex-none fill-accent self-center" />
            <span className="flex-1 flex justify-between tracking-[-0.02em] select-none">
              <span>d</span>
              <span>r</span>
              <span>a</span>
              <span>v</span>
              <span>a</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
