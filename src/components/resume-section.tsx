'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { ScrollReveal } from './scroll-reveal';
import FocusReveal from './focus-reveal';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

function SkillsAccordion({ skills }: { skills: { name: string; category: string; displayOrder?: number }[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Sort skills by displayOrder first, then group by category
  const sorted = [...skills].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  // Group skills by category in displayOrder, deduplicate skill names
  const categoryOrder: string[] = [];
  const grouped: Record<string, string[]> = {};
  for (const skill of sorted) {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
      categoryOrder.push(skill.category);
    }
    if (!grouped[skill.category].includes(skill.name)) {
      grouped[skill.category].push(skill.name);
    }
  }

  const categories = categoryOrder.map(cat => [cat, grouped[cat]] as [string, string[]]);

  const toggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="skills-accordion">
      {categories.map(([category, techs], index) => {
        const isOpen = activeIndex === index;
        return (
          <div key={category} className={`skill-accordion-item${isOpen ? ' active' : ''}`}>
            <button
              className="skill-accordion-trigger"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span>{category}</span>
              <span className="skill-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="skill-accordion-content">
              <div>
                <div className="skill-tags">
                  {techs.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ResumeSection() {
  const { profile, skills, experiences, loading } = useData();

  return (
    <section id="resume" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Resume Intro */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="skills-label mb-4">RESUME</div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            {profile?.resumeIntro ? (
              <p className="text-base lg:text-lg text-muted-text leading-relaxed">{profile.resumeIntro}</p>
            ) : undefined}
          </ScrollReveal>
        </div>

        {/* Technical Skills — Accordion FAQ Style */}
        <div className="mb-20">
          <ScrollReveal>
            <div className="skills-faq-container">
              {/* Left side */}
              <div className="skills-faq-header">
                <div className="skills-label">TECHNICAL SKILLS</div>
                {profile?.resumeTechTitle && (
                <FocusReveal
                  text={profile.resumeTechTitle}
                  as="h2"
                  className="journey-title"
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
                )}
              </div>

              {/* Right side */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between py-4">
                      <Skeleton className="h-6 w-40 bg-surface/50" />
                      <Skeleton className="h-8 w-8 rounded-md bg-surface/50" />
                    </div>
                  ))}
                </div>
              ) : (
                <SkillsAccordion skills={skills} />
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Experience & Projects — Journey Style */}
        <div className="mb-20">
          <ScrollReveal>
            <div className="experience-projects">
              <div className="experience-projects-inner">

                {/* LEFT SIDE — Sticky heading */}
                <div className="journey-intro">
                  <div className="skills-label">MY JOURNEY</div>
                  {profile?.resumeExpTitle && (
                  <FocusReveal
                    text={profile.resumeExpTitle}
                    as="h2"
                    className="journey-title"
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
                  )}
                </div>

                {/* RIGHT SIDE — Stacked cards */}
                <div className="journey-cards">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <article key={i} className="journey-card journey-card-skeleton">
                        <div className="journey-date">—</div>
                        <div className="journey-card-content">
                          <Skeleton className="h-8 w-64 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-6" />
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-16 rounded-full" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                          </div>
                        </div>
                      </article>
                    ))
                  ) : experiences.length === 0 ? (
                    <p className="text-muted-text">No experience yet.</p>
                  ) : (
                    experiences.map((exp, index) => {
                      const techs: string[] = (() => {
                        try {
                          let parsed: unknown = exp.technologies;
                          // Defensively unwrap multiple JSON encoding layers
                          for (let i = 0; i < 10; i++) {
                            if (typeof parsed === 'string') {
                              try { parsed = JSON.parse(parsed); } catch { break; }
                            } else break;
                          }
                          return Array.isArray(parsed) ? parsed : [];
                        } catch { return []; }
                      })();
                      const dateStr = [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
                      return (
                        <article
                          key={exp.id}
                          className="journey-card"
                          style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                        >
                          <div className="journey-date">{dateStr}</div>

                          <div className="journey-card-content">
                            <h3 className="journey-card-title">{exp.title}</h3>

                            <p className="journey-card-description">
                              {exp.description}
                            </p>
                            {exp.location && (
                              <p className="journey-card-location">{exp.location}</p>
                            )}

                            {techs.length > 0 && (
                              <div className="journey-card-tech">
                                {techs.map((tech) => (
                                  <span key={tech} className="journey-tech-item">{tech}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Download CV */}
        <ScrollReveal className="text-center">
          {profile?.cvFile ? (
            <a
              href={profile.cvFile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              aria-label="Download Resume PDF"
            >
              <SlideFillButton
                label="Download Resume"
                variant="primary"
              />
            </a>
          ) : (
            <SlideFillButton
              label="Download Resume"
              variant="primary"
              disabled
            />
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
