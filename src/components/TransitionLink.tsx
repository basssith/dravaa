'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useUI } from './UIProvider';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

/** next/link (keeps prefetching) that routes through the page wipe and smooth #hash scrolling. */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = useUI();
  return (
    <Link
      href={href}
      target={target}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || target === '_blank') return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
