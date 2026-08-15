'use client';

import { useRef } from 'react';
import { ScrollReveal } from './scroll-reveal';
import FocusReveal from './focus-reveal';
import { useOnceInView } from './use-once-in-view';

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  label,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const titleRef = useRef(null);
  const titleInView = useOnceInView(titleRef, '-60px');

  const titleClasses = 'text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight';

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
      <div ref={titleRef}>
        {titleInView ? (
          <FocusReveal
            text={title}
            as="h2"
            className={titleClasses}
            blur={15}
            trigger={true}
            transition={{
              type: 'tween',
              duration: 0.35,
              staggerChildren: 0.03,
              ease: 'easeOut',
            }}
          />
        ) : (
          <h2 className={titleClasses} aria-label={title} style={{ visibility: 'hidden' }}>
            {title}
          </h2>
        )}
      </div>
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
