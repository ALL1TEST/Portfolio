'use client';

import { ScrollReveal } from './scroll-reveal';

const technologies = [
  { name: 'React', icon: '⚛' },
  { name: 'Laravel', icon: '🔷' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Node.js', icon: '⬢' },
  { name: 'MySQL', icon: '🗄' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Docker', icon: '🐳' },
  { name: 'GitHub', icon: '🐙' },
  { name: 'Oracle Cloud', icon: '☁' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'PHP', icon: '🐘' },
];

export function TechMarquee() {
  const duplicated = [...technologies, ...technologies, ...technologies];

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden border-y border-stroke/30">
      <ScrollReveal>
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-text/60">
            Technologies I Work With
          </span>
        </div>
      </ScrollReveal>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark to-transparent z-10" />

        <div className="flex overflow-hidden">
          <div className="flex gap-4 animate-marquee">
            {duplicated.map((tech, i) => (
              <div
                key={`${tech.name}-${i}`}
                className="group flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-surface/50 border border-stroke/30 rounded-xl hover:border-brand/30 hover:bg-surface transition-all duration-300 cursor-default"
              >
                <span className="text-xl">{tech.icon}</span>
                <span className="text-sm font-medium text-muted-text group-hover:text-white transition-colors whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
