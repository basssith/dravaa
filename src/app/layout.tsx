import type { Metadata, Viewport } from 'next';
import { Inter, Syne } from 'next/font/google';
import type { ReactNode } from 'react';
import { CleanMinimalBackground } from '@/components/CleanMinimalBackground';
import { Cursor } from '@/components/Cursor';
import { Footer } from '@/components/Footer';
import { GlassFluidCanvas } from '@/components/GlassFluidCanvas';
import { Header } from '@/components/Header';
import { Menu } from '@/components/Menu';
import { Preloader } from '@/components/Preloader';
import { Reel } from '@/components/Reel';
import { ScrollEffects } from '@/components/ScrollEffects';
import { UIProvider } from '@/components/UIProvider';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-syne', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Drava — Technology should make life feel easier', template: '%s — Drava' },
  description: 'Drava builds a connected ecosystem of applications for spatial work, autonomous intelligence and effortless everyday workflows.',
  icons: { icon: '/assets/drava_logo_smile.png' },
  openGraph: {
    type: 'website',
    siteName: 'Drava',
    title: 'Drava — Connecting everything into one space',
    description: 'Technology should make life feel easier. Explore the Drava ecosystem.'
  }
};

export const viewport: Viewport = { themeColor: '#f2f2ee', colorScheme: 'light' };

// Runs before paint: marks JS as available (hero lines start hidden) and flags the first visit (preloader).
const BOOT = `document.documentElement.classList.add('js');try{if(!sessionStorage.getItem('drava-visited'))document.documentElement.classList.add('is-first')}catch(e){document.documentElement.classList.add('is-first')}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <UIProvider>
          <Preloader />
          <CleanMinimalBackground />
          <Cursor />
          <GlassFluidCanvas />
          <Header />
          <Menu />
          <main id="main" className="relative z-1">
            {children}
          </main>
          <Footer />
          <Reel />
          <ScrollEffects />
        </UIProvider>
      </body>
    </html>
  );
}
