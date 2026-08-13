'use client';

import { Navbar } from '@/components/navbar';
import { AnimatedBackground } from '@/components/animated-background';
import { Hero } from '@/components/hero';
import { TechMarquee } from '@/components/tech-marquee';
import { AboutPreview } from '@/components/about-preview';
import { ProjectsSection } from '@/components/projects-section';
import { CertificatesSection } from '@/components/certificates-section';
import { ResumeSection } from '@/components/resume-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <TechMarquee />
        <AboutPreview />
        <ProjectsSection />
        <CertificatesSection />
        <ResumeSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
