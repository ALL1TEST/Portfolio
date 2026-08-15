'use client';

import { ScrollReveal } from './scroll-reveal';
import FocusReveal from './focus-reveal';

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

const TITLE_CLASSES = 'text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight';

export function SectionHeading({
  label,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 lg:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {label && (
        <ScrollReveal delay={0}>
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-brand bg-brand/10 rounded-full border border-brand/20 mb-4">
            {label}
          </span>
        </ScrollReveal>
      )}
      <FocusReveal
        text={title}
        as="h2"
        className={TITLE_CLASSES}
        blur={20}
        staggerFrom="start"
        transition={{
          type: "tween",
          duration: 0.3,
          delay: 0,
          ease: "easeOut",
          staggerChildren: 0.035,
        }}
      />
      {description && (
        <ScrollReveal delay={0.3}>
          <p className="mt-4 text-muted-text max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
