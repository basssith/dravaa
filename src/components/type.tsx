import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/ui';

type LinesProps = {
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  lines: string[];
  /** index of the line that gets the lime highlight */
  highlight?: number;
  /** hero headings reveal after the intro instead of on scroll */
  hero?: boolean;
};

/** Heading split into masked lines that rise in (see ScrollEffects). */
export function Lines({ as: Tag = 'h2', className, lines, highlight, hero }: LinesProps) {
  return (
    <Tag className={className} {...(hero ? {} : { 'data-lines': '' })}>
      {lines.map((text, i) => (
        <span key={i} className="line">
          <span className={cn(i === highlight && 'highlight')}>{text}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Paragraph or heading whose words light up while scrolling.
 * Starts in dim green/grey, scrubs through bright signature green, and locks into pure white.
 */
export function WordScrub({
  text,
  className,
  as: Tag = 'p'
}: {
  text: string;
  className?: string;
  as?: 'p' | 'h2' | 'h3' | 'span';
}) {
  return (
    <Tag className={cn('block w-full', className)} data-words>
      {text.split(' ').map((word, i) => {
        const em = word.startsWith('*');
        const w = em ? word.slice(1) : word;
        return (
          <Fragment key={i}>
            {em ? (
              <span className="w-scrub highlight text-ink font-semibold not-italic [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                {w}
              </span>
            ) : (
              <span className="w-scrub inline will-change-[color,opacity] transition-colors duration-150">
                {w}
              </span>
            )}{' '}
          </Fragment>
        );
      })}
    </Tag>
  );
}

/** Eyebrow tag + heading, the standard section header. */
export function SectionHead({ tag, title, note }: { tag?: string; title: string[]; note?: ReactNode }) {
  return (
    <header className="section-head text-white">
      <div>
        {tag ? <p className="tag text-white/60">{tag}</p> : null}
        <Lines className="t-h2 mt-4 text-white" lines={title} />
      </div>
      {note && <p className="max-w-[36ch] text-white/80">{note}</p>}
    </header>
  );
}
