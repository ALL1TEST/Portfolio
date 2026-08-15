'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { ScrollReveal } from './scroll-reveal';
import FocusReveal from './focus-reveal';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

function SkillsAccordion({ skills }: { skills: { name: string; category: string }[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Group skills by category, deduplicate
  const grouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    if (!acc[skill.category].includes(skill.name)) {
      acc[skill.category].push(skill.name);
    }
    return acc;
  }, {});

  const categories = Object.entries(grouped);

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
        {/* Technical Skills — Accordion FAQ Style */}
        <div className="mb-20">
          <ScrollReveal>
            <div className="skills-faq-container">
              {/* Left side */}
              <div className="skills-faq-header">
                <div className="skills-label">TECHNICAL SKILLS</div>
                <FocusReveal
                  text="Technologies I"
                  as="h2"
                  className="skills-faq-title"
                  blur={14}
                  scaleStart={1.3}
                  duration={0.35}
                  staggerChildren={0.03}
                  staggerFrom="start"
                />
                <FocusReveal
                  text="work with"
                  as="h2"
                  className="skills-faq-title"
                  blur={14}
                  scaleStart={1.3}
                  duration={0.35}
                  staggerChildren={0.03}
                  staggerFrom="start"
                />
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
                  <div className="journey-label">MY JOURNEY</div>
                  <FocusReveal
                    text="Experience & Projects"
                    as="h2"
                    className="journey-title"
                    blur={14}
                    scaleStart={1.3}
                    duration={0.35}
                    staggerChildren={0.03}
                    staggerFrom="start"
                  />
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
                      const techs: string[] = (() => { try { return JSON.parse(exp.technologies); } catch { return []; } })();
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
                              {exp.location && (
                                <span className="journey-card-location"> · {exp.location}</span>
                              )}
                            </p>

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
          <SlideFillButton
            label="Download Resume"
            variant="primary"
            disabled={!profile?.cvFile}
            onClick={() => {
              if (profile?.cvFile) {
                window.open(profile.cvFile, '_blank');
              }
            }}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
