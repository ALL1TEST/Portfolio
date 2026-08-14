'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useSyncExternalStore } from 'react';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { useData } from '@/lib/data-provider';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className="inline-flex overflow-hidden">
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ y: 100, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const mounted = useMounted();
  const { profile, loading } = useData();

  const fullName = profile?.fullName || 'ABDELLAH AIT-SI';
  const parts = fullName.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand/10 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand/5 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-text bg-surface/80 border border-stroke rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Available for Work
          </span>
        </motion.div>

        <motion.h1
          className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatedText text={firstName} delay={0.4} />
          <br />
          <span className="text-brand">
            <AnimatedText text={lastName || 'AIT-SI'} delay={0.6} />
          </span>
        </motion.h1>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={mounted && !loading ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <p className="text-lg sm:text-xl md:text-2xl font-light text-white/80 tracking-wide">
            {profile?.professionalTitle?.split('|').map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-brand mx-3">|</span>}
                {part.trim()}
              </span>
            )) || 'Full Stack Developer | AI & Automation'}
          </p>
        </motion.div>

        <motion.p
          className="mt-6 max-w-2xl mx-auto text-sm sm:text-base text-muted-text leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted && !loading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {profile?.shortBio || 'Building modern web applications and smart automated solutions.'}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <SlideFillButton
            label="View My Work"
            variant="primary"
            onClick={() => scrollToSection('#projects')}
          />

          <SlideFillButton
            label="Contact Me"
            variant="secondary"
            onClick={() => scrollToSection('#contact')}
          />
        </motion.div>
      </div>
    </section>
  );
}
