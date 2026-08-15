'use client';

import { ScrollReveal } from './scroll-reveal';
import { motion } from 'framer-motion';
import { useData } from '@/lib/data-provider';

const stats = [
  { value: '6+', label: 'Certificates' },
  { value: '14+', label: 'Projects' },
  { value: '8+', label: 'Technologies' },
];

export function AchievementStats() {
  return (
    <section className="relative py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1} direction="up">
              <motion.div
                className="relative flex flex-col items-center text-center py-8 lg:py-10 px-4"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                {/* Divider lines between stats (not on first item) */}
                {index > 0 && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-stroke/40 hidden sm:block" />
                )}

                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-none">
                  {stat.value}
                </span>
                <span className="mt-2 text-xs sm:text-sm font-medium text-muted-text uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
