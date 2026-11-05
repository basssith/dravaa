import { ArrowDot } from '@/components/icons';
import { TransitionLink } from '@/components/TransitionLink';
import { Lines } from '@/components/type';
import { pill } from '@/lib/ui';

export default function NotFound() {
  return (
    <section data-hero className="flex min-h-[86svh] flex-col justify-end px-gutter pt-[calc(var(--spacing-header)+--spacing(8))] pb-8">
      <p className="tag mb-auto">[ 404 ]</p>
      <Lines as="h1" hero className="t-h1 mb-8" lines={['This page', 'went', 'missing.']} highlight={2} />
      <div className="border-t border-line pt-6">
        <TransitionLink href="/" className={pill('dark')}>
          Back home
          <ArrowDot />
        </TransitionLink>
      </div>
    </section>
  );
}
