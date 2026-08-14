'use client';

import { SiteLayout } from '@/components/site-layout';
import { Hero } from '@/components/hero';
import { TechMarquee } from '@/components/tech-marquee';
import { AboutPreview } from '@/components/about-preview';
import { FeaturedProjects } from '@/components/featured-projects';
import { CertificatesSection } from '@/components/certificates-section';
import { ResumeSection } from '@/components/resume-section';
import { ContactSection } from '@/components/contact-section';

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <TechMarquee />
      <AboutPreview />
      <FeaturedProjects />
      <CertificatesSection />
      <ResumeSection />
      <ContactSection />
    </SiteLayout>
  );
}
