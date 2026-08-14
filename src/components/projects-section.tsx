'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectCard({ project, index }: { project: ReturnType<typeof useData>['projects'][0]; index: number }) {
  const technologies: string[] = (() => {
    try { return JSON.parse(project.technologies); } catch { return []; }
  })();

  const hasImage = !!project.projectImage;

  return (
    <ScrollReveal delay={index * 0.12} direction="up">
      <motion.a
        href={project.liveDemoUrl || project.githubUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-xl"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image container with landscape aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {hasImage ? (
            <img
              src={project.projectImage}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-stroke/30">{project.title?.charAt(0)}</span>
            </div>
          )}

          {/* Dark gradient overlay — transparent top to near-black bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Floating link indicator */}
          {project.liveDemoUrl && (
            <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Project info at bottom over the gradient */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 lg:p-6">
            {/* Technologies row */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase text-white/60 bg-white/[0.08] backdrop-blur-sm rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Project title */}
            <h3 className="text-lg lg:text-xl font-bold text-white leading-snug mb-1.5 group-hover:text-brand transition-colors duration-300">
              {project.title}
            </h3>

            {/* Project description */}
            <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
              {project.shortDescription}
            </p>

            {/* Links row */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
              {project.liveDemoUrl && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/70 group-hover:text-brand transition-colors duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Live Demo
                </span>
              )}
              {project.githubUrl && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/40 group-hover:text-white/70 transition-colors duration-300">
                  <Github className="w-3.5 h-3.5" />
                  Source Code
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.a>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  const { projects, loading } = useData();

  return (
    <section id="projects" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header — badge + heading */}
        <ScrollReveal delay={0}>
          <div className="text-center mb-14 lg:mb-20">
            <span className="inline-block px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-text bg-surface border border-stroke rounded-sm mb-5">
              Projects
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Selected Projects
            </h2>
            <p className="mt-4 text-muted-text max-w-xl mx-auto text-base leading-relaxed">
              A curated showcase of work spanning full-stack development, automation, and web applications.
            </p>
          </div>
        </ScrollReveal>

        {/* Project grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-surface">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
