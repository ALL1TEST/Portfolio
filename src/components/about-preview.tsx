'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from './section-heading';
import { ScrollReveal } from './scroll-reveal';
import { useData } from '@/lib/data-provider';

export function AboutPreview() {
  const { profile } = useData();

  const scrollToResume = () => {
    const element = document.getElementById('resume');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const title = profile?.professionalTitle?.split('|')[0]?.trim() || 'Full Stack';
  const specialty = profile?.professionalTitle?.split('|')[1]?.trim() || 'AI & Automation';

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="About" title="Who I Am" align="center" />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-surface rounded-2xl border border-stroke/50 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-brand/20 animate-pulse-glow" />
                  <div className="absolute w-20 h-20 rounded-full border border-brand/40" />
                  <div className="absolute w-8 h-8 bg-brand/20 rounded-full blur-xl" />
                </div>
                <div className="absolute top-4 left-4 w-12 h-[1px] bg-brand/50" />
                <div className="absolute top-4 left-4 w-[1px] h-12 bg-brand/50" />
                <div className="absolute bottom-4 right-4 w-12 h-[1px] bg-brand/50" />
                <div className="absolute bottom-4 right-4 w-[1px] h-12 bg-brand/50" />
                <div className="absolute bottom-6 left-6 text-brand/60 font-mono text-xs tracking-widest">
                  {profile?.brandName?.substring(0, 2).toUpperCase() || 'CV'}
                </div>
                <div className="absolute top-6 right-6 text-muted-text/40 font-mono text-xs">
                  &lt;/&gt;
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div>
            <ScrollReveal direction="right" delay={0.1}>
              <p className="text-base lg:text-lg text-muted-text leading-relaxed">
                {profile?.aboutText || 'Développeur Full Stack spécialisé en React, Laravel et MySQL, passionné par la création d\'applications web modernes. Intéressé par l\'intelligence artificielle, l\'automatisation et le développement de solutions innovantes.'}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Focus', value: title },
                  { label: 'Specialty', value: specialty },
                  { label: 'Experience', value: '3+ Years' },
                  { label: 'Location', value: profile?.location || 'Morocco' },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-surface/50 border border-stroke/30 rounded-xl">
                    <p className="text-xs font-medium text-muted-text uppercase tracking-wider">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <motion.button
                onClick={scrollToResume}
                className="mt-8 portfolio-btn portfolio-btn-secondary"
                whileTap={{ scale: 0.95 }}
              >
                <span className="portfolio-btn-content">
                  <span>Learn More</span>
                  <ArrowRight className="btn-arrow w-[18px] h-[18px]" />
                </span>
                <span className="portfolio-btn-bg" />
              </motion.button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
