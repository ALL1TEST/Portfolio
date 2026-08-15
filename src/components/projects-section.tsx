'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, ChevronUp, ChevronDown } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { GlowCard } from '@/components/ui/glow-card';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const technologies: string[] = (() => {
    try { return JSON.parse(project.technologies); } catch { return []; }
  })();

  const hasImage = !!project.projectImage;

  return (
    <ScrollReveal delay={index * 0.12} direction="up">
      <GlowCard>
      <motion.div
        className="group rounded-xl overflow-hidden bg-surface border border-stroke/40 flex flex-col"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image area — dedicated space with taller aspect ratio */}
        {hasImage ? (
          <a
            href={project.liveDemoUrl || project.githubUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-[16/10] overflow-hidden"
          >
            <img
              src={project.projectImage}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Floating arrow */}
            <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </a>
        ) : (
          <div className="relative aspect-[16/10] bg-gradient-to-br from-surface to-dark flex items-center justify-center overflow-hidden">
            <span className="text-6xl font-bold text-stroke/15 select-none">{project.title?.charAt(0)}</span>
          </div>
        )}

        {/* Content area — clearly separated from image with generous padding */}
        <div className="p-6 lg:p-8 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-bold text-white leading-snug mb-3 group-hover:text-brand transition-colors duration-300 whitespace-nowrap">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm lg:text-base text-muted-text leading-relaxed line-clamp-3 mb-5">
            {project.shortDescription}
          </p>

          {/* Tech pills */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-[11px] font-medium tracking-wide text-brand/80 border border-brand/20 rounded-full bg-brand/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Spacer to push links to bottom */}
          <div className="mt-auto" />

          {/* Links row */}
          <div className="flex items-center gap-3 pt-5 border-t border-stroke/40">
            <a
              href={project.liveDemoUrl || project.githubUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-brand rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand/25 hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-colors duration-300" />
              <ArrowUpRight className="relative w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              <span className="relative">View Project</span>
            </a>
            {project.githubUrl && project.liveDemoUrl && project.githubUrl !== project.liveDemoUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-white/40 hover:text-white/70 transition-colors duration-300"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
      </GlowCard>
    </ScrollReveal>
  );
}

const INITIAL_SHOW = 3;

export function ProjectsSection() {
  const { projects, loading } = useData();
  const [showAll, setShowAll] = useState(false);

  const hasMore = projects.length > INITIAL_SHOW;
  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_SHOW);

  return (
    <section id="projects" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Projects"
          labelStyle="skills"
          title="Selected Projects"
          description="A curated showcase of work spanning full-stack development, automation, and web applications."
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-surface border border-stroke/40 flex flex-col">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-6 lg:p-8 space-y-3 flex-1">
                  <Skeleton className="h-7 w-56" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="mt-12 lg:mt-16 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group/toggle relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white/80 bg-surface border border-stroke/50 rounded-full overflow-hidden transition-all duration-300 hover:text-white hover:border-brand/40 hover:shadow-lg hover:shadow-brand/15 hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 bg-brand/0 group-hover/toggle:bg-brand/10 transition-colors duration-300" />
                  {showAll ? (
                    <>
                      <ChevronUp className="relative w-4 h-4 transition-transform duration-300 group-hover/toggle:-translate-y-0.5" />
                      <span className="relative">Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="relative w-4 h-4 transition-transform duration-300 group-hover/toggle:translate-y-0.5" />
                      <span className="relative">Show More</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
