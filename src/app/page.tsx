'use client';

import { SiteLayout } from '@/components/site-layout';
import { Hero } from '@/components/hero';
import { TechMarquee } from '@/components/tech-marquee';
import { AboutPreview } from '@/components/about-preview';

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <TechMarquee />
      <AboutPreview />
    </SiteLayout>
  );
}
