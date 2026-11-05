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

/** Paragraph whose words light up while scrolling. Prefix a word with * to underline it in lime. */
export function WordScrub({ text, className }: { text: string; className?: string }) {
  return (
    <p className={className} data-words>
      {text.split(' ').map((word, i) => {
        const em = word.startsWith('*');
        const w = em ? word.slice(1) : word;
        return (
          <Fragment key={i}>
            {em ? (
              <em className="w not-italic underline decoration-accent decoration-[0.14em] underline-offset-[0.08em] [text-decoration-skip-ink:none]">{w}</em>
            ) : (
              <span className="w">{w}</span>
            )}{' '}
          </Fragment>
        );
      })}
    </p>
  );
}

/** Eyebrow tag + heading, the standard section header. */
export function SectionHead({ tag, title, note }: { tag: string; title: string[]; note?: ReactNode }) {
  return (
    <header className="section-head">
      <div>
        <p className="tag">{tag}</p>
        <Lines className="t-h2 mt-4" lines={title} />
      </div>
      {note && <p className="max-w-[36ch] text-ink-2">{note}</p>}
    </header>
  );
}
