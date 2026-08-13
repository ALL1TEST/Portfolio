'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectCard({ project, index }: { project: ReturnType<typeof useData>['projects'][0]; index: number }) {
  const technologies: string[] = (() => {
    try { return JSON.parse(project.technologies); } catch { return []; }
  })();

  const dateStr = [project.startDate, project.endDate].filter(Boolean).join(' – ');

  return (
    <ScrollReveal delay={index * 0.15} direction={index % 2 === 0 ? 'left' : 'right'}>
      <motion.div
        className="group relative bg-surface border border-stroke/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-brand/30"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand/0 to-transparent group-hover:via-brand/60 transition-all duration-500" />

        {project.projectImage && (
          <div className="relative h-48 overflow-hidden">
            <img src={project.projectImage} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          </div>
        )}

        <div className="p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-brand font-mono text-sm font-bold">0{index + 1}</span>
              <span className="text-xs text-muted-text font-medium">{dateStr}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-text/0 group-hover:text-brand transition-all duration-300" />
          </div>

          <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-brand transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-sm text-muted-text leading-relaxed mb-6">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-stroke/30">
            {technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 text-xs font-medium text-brand bg-brand/10 border border-brand/20 rounded-full">
                {tech}
              </span>
            ))}
          </div>

          {(project.githubUrl || project.liveDemoUrl) && (
            <div className="flex gap-3 mt-4">
              {project.liveDemoUrl && (
                <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline">
                  Live Demo →
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-text hover:text-white transition-colors">
                  View Code →
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  const { projects, loading } = useData();

  return (
    <section id="projects" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Projects"
          title="Featured Work"
          description="A selection of projects that showcase my skills in full-stack development, from management systems to web applications."
        />

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-stroke/50 rounded-2xl p-6 lg:p-8">
                <Skeleton className="h-4 w-16 mb-3" />
                <Skeleton className="h-6 w-40 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-text">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
