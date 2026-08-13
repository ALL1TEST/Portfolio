'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from './section-heading';
import { ScrollReveal } from './scroll-reveal';

export function AboutPreview() {
  const scrollToResume = () => {
    const element = document.getElementById('resume');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About"
          title="Who I Am"
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Abstract visual */}
          <ScrollReveal direction="left">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-surface rounded-2xl border border-stroke/50 overflow-hidden">
                {/* Animated grid inside */}
                <div className="absolute inset-0 grid-bg opacity-40" />
                {/* Center accent */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-brand/20 animate-pulse-glow" />
                  <div className="absolute w-20 h-20 rounded-full border border-brand/40" />
                  <div className="absolute w-8 h-8 bg-brand/20 rounded-full blur-xl" />
                </div>
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-12 h-[1px] bg-brand/50" />
                <div className="absolute top-4 left-4 w-[1px] h-12 bg-brand/50" />
                <div className="absolute bottom-4 right-4 w-12 h-[1px] bg-brand/50" />
                <div className="absolute bottom-4 right-4 w-[1px] h-12 bg-brand/50" />
                {/* Initials */}
                <div className="absolute bottom-6 left-6 text-brand/60 font-mono text-xs tracking-widest">
                  A.A
                </div>
                <div className="absolute top-6 right-6 text-muted-text/40 font-mono text-xs">
                  &lt;/&gt;
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Content */}
          <div>
            <ScrollReveal direction="right" delay={0.1}>
              <p className="text-base lg:text-lg text-muted-text leading-relaxed">
                Développeur Full Stack spécialisé en React, Laravel et MySQL,
                passionné par la création d&apos;applications web modernes. Intéressé
                par l&apos;intelligence artificielle, l&apos;automatisation et le développement
                de solutions innovantes.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Focus', value: 'Full Stack' },
                  { label: 'Specialty', value: 'AI & Automation' },
                  { label: 'Experience', value: '3+ Years' },
                  { label: 'Location', value: 'Morocco' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 bg-surface/50 border border-stroke/30 rounded-xl"
                  >
                    <p className="text-xs font-medium text-muted-text uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <motion.button
                onClick={scrollToResume}
                className="mt-8 group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-stroke rounded-lg hover:border-brand/50 hover:bg-brand/5 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
