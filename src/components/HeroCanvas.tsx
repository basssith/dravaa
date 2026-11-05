'use client';

import dynamic from 'next/dynamic';

// three.js + R3F load as their own chunk, client-only, and only on pages that render this.
const RobotScene = dynamic(() => import('./RobotScene'), { ssr: false });

export function HeroCanvas() {
  return <RobotScene />;
}
