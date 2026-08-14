'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const technologies: string[] = (() => {
    try { return JSON.parse(project.technologies); } catch { return []; }
  })();

  const hasImage = !!project.projectImage;

  return (
    <ScrollReveal delay={index * 0.15} direction="up">
      <motion.div
        className="group rounded-xl overflow-hidden bg-surface border border-stroke/40"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image area — 16:10 landscape */}
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
          <div className="relative aspect-[16/10] bg-gradient-to-br from-surface to-dark flex items-center justify-center">
            <span className="text-5xl font-bold text-stroke/20">{project.title?.charAt(0)}</span>
          </div>
        )}

        {/* Content area below image */}
        <div className="p-5 lg:p-6">
          {/* Tech pills */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[11px] font-medium tracking-wide text-brand/80 border border-brand/20 rounded bg-brand/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg lg:text-xl font-bold text-white leading-snug mb-2 group-hover:text-brand transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-text leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>

          {/* Links row */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stroke/40">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-brand transition-colors duration-300"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white/70 transition-colors duration-300"
              >
                <Github className="w-3.5 h-3.5" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function FeaturedProjects() {
  const { projects, loading } = useData();

  // Filter featured projects and sort by displayOrder
  const featuredProjects = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section id="featured-projects" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Featured"
          title="Featured Projects"
          description="A selection of my best work, showcasing full-stack development and creative problem-solving."
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-surface border border-stroke/40">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">No featured projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProjects.map((project, index) => (
              <FeaturedProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
