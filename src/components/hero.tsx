'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useSyncExternalStore } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
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
          <motion.button
            onClick={() => scrollToSection('#projects')}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-brand rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand to-brand-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">View My Work</span>
            <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <motion.button
            onClick={() => scrollToSection('#contact')}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-transparent border border-stroke rounded-lg hover:border-brand/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Contact Me</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-muted-text/50 cursor-pointer"
            onClick={() => scrollToSection('#about')}
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
