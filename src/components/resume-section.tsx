'use client';

import { motion } from 'framer-motion';
import {
  Code2, Globe, Server, Database, Brain, Layout, Cloud, Search,
  Users, Lightbulb, RefreshCw,
} from 'lucide-react';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: Record<string, React.ElementType> = {
  Code2, Globe, Server, Database, Brain, Layout, Cloud, Search,
  Users, Lightbulb, RefreshCw,
};

function SkillCard({ category, skills, index }: {
  category: string;
  skills: string[];
  index: number;
}) {
  const Icon = iconMap[skills[0]?.icon] || Code2;
  return (
    <ScrollReveal delay={index * 0.05}>
      <motion.div
        className="group p-4 bg-surface/50 border border-stroke/30 rounded-xl hover:border-brand/30 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand" />
          </div>
          <h4 className="text-sm font-semibold text-white">{category}</h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="px-2.5 py-1 text-xs text-muted-text bg-dark/50 border border-stroke/20 rounded-md hover:text-white hover:border-brand/30 transition-colors cursor-default"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function ResumeSection() {
  const { profile, skills, education, experiences, languages, softSkills, loading } = useData();

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="resume" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Resume"
          title="My Journey"
          description="A comprehensive overview of my skills, experience, and education."
        />

        {/* Profile */}
        <ScrollReveal className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-base lg:text-lg text-muted-text leading-relaxed">
              {profile?.aboutText || 'Développeur Full Stack spécialisé en React, Laravel et MySQL.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Technical Skills */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Technical Skills</h3>
          </ScrollReveal>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(groupedSkills).map(([category, catSkills], index) => (
                <SkillCard key={category} category={category} skills={catSkills} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Experience & Projects — Journey Style */}
        <div className="mb-20">
          <ScrollReveal>
            <div className="experience-projects">
              <div className="experience-projects-inner">

                {/* LEFT SIDE — Sticky heading */}
                <div className="journey-intro">
                  <div className="journey-label">MY JOURNEY</div>
                  <h2 className="journey-title">Experience &amp; Projects</h2>
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

        {/* Education */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Education</h3>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-6">
            {loading ? (
              [1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            ) : (
              education.map((edu, index) => (
                <ScrollReveal key={edu.id} delay={index * 0.1}>
                  <motion.div
                    className="group relative p-6 bg-surface/50 border border-stroke/30 rounded-xl hover:border-brand/30 transition-all duration-300"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-brand transition-colors">{edu.degree}</h4>
                        <p className="text-sm text-muted-text">{edu.field}</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium text-brand bg-brand/10 border border-brand/20 rounded-full">{edu.year}</span>
                    </div>
                    <p className="text-sm text-muted-text">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                  </motion.div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>

        {/* Languages & Soft Skills */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <ScrollReveal direction="left">
            <div className="p-6 bg-surface/50 border border-stroke/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Languages</h3>
              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 rounded-lg" />)
                ) : (
                  languages.map((lang, index) => (
                    <motion.div
                      key={lang.id}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-sm font-medium text-white">{lang.name}</span>
                      <span className="text-xs font-medium text-brand bg-brand/10 px-3 py-1 rounded-full">{lang.level}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="p-6 bg-surface/50 border border-stroke/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Soft Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {loading ? (
                  [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)
                ) : (
                  softSkills.map((skill, index) => {
                    const Icon = iconMap[skill.icon] || Lightbulb;
                    return (
                      <motion.div
                        key={skill.id}
                        className="group flex items-center gap-3 p-3 bg-dark/50 rounded-lg hover:bg-surface transition-colors"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-brand" />
                        </div>
                        <span className="text-sm text-muted-text group-hover:text-white transition-colors">{skill.name}</span>
                      </motion.div>
                    );
                  })
                )}
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
          {!profile?.cvFile && (
            <p className="mt-3 text-xs text-muted-text">CV file coming soon</p>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
