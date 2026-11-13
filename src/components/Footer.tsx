import { EMAIL, PRESS, SOCIALS } from '@/lib/site';
import { Arrow, Smile } from './icons';
import { BackToTop, Newsletter } from './FooterActions';
import { TransitionLink } from './TransitionLink';

const linkCls = 'no-underline transition-colors duration-300 hover:text-accent';

export function Footer() {
  return (
    <footer
      id="contact"
      data-footer-card
      className="relative z-40 mx-auto w-full max-w-[98vw] 2xl:max-w-[1720px] overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[4.5rem] border border-white/10 bg-[#0a0a0a] pt-block-lg text-paper shadow-[0_-20px_80px_rgba(0,0,0,0.9)] will-change-transform"
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
            <p className="leading-[1.7] text-paper-2">
              Drava Technologies Inc.
              <br />
              Street address
              <br />
              City, Country
            </p>
          </div>
          <div>
            <h2 className="label mb-4 text-paper-muted">Say hello</h2>
            <p className="leading-[1.7] text-paper-2">
              <a className={linkCls} href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <br />
              <a className={linkCls} href={`mailto:${PRESS}`}>{PRESS}</a>
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
          <span>TM 2026 Drava Technologies Inc.</span>
          <TransitionLink className={linkCls} href="/applications/nex">Labs</TransitionLink>
          <BackToTop className={linkCls} />
        </div>

        <div
          aria-hidden="true"
          className="pt-10 pb-8 flex items-baseline gap-[2.5vw] font-display text-[clamp(4.2rem,17.5vw,20rem)] leading-[0.8] font-extrabold tracking-[-0.04em] overflow-hidden w-full pr-4"
        >
          <Smile className="w-[0.56em] flex-none fill-accent self-center" />
          <span className="flex-1 flex justify-between tracking-[-0.02em] select-none">
            <span>d</span>
            <span>r</span>
            <span>a</span>
            <span>v</span>
            <span className="mr-2">a</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
