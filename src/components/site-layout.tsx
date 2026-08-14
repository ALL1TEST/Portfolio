'use client';

import { DataProvider } from '@/lib/data-provider';
import { Navbar } from '@/components/navbar';
import { AnimatedBackground } from '@/components/animated-background';
import { Footer } from '@/components/footer';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <div className="relative min-h-screen bg-dark">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </div>
    </DataProvider>
  );
}
