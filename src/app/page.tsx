'use client';

import { DataProvider } from '@/lib/data-provider';
import { Navbar } from '@/components/navbar';
import { AnimatedBackground } from '@/components/animated-background';
import { Hero } from '@/components/hero';
import { TechMarquee } from '@/components/tech-marquee';
import { AboutPreview } from '@/components/about-preview';
import { ProjectsSection } from '@/components/projects-section';
import { CertificatesSection } from '@/components/certificates-section';
import { EducationSection } from '@/components/education-section';
import { ResumeSection } from '@/components/resume-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <DataProvider>
      <div className="relative min-h-screen bg-dark">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <TechMarquee />
          <AboutPreview />
          <ProjectsSection />
          <CertificatesSection />
          <EducationSection />
          <ResumeSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </DataProvider>
  );
}
