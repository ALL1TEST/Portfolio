'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
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
          <div className="relative aspect-[16/10] bg-gradient-to-br from-surface to-dark flex items-center justify-center overflow-hidden">
            <span className="text-5xl font-bold text-stroke/20 select-none">{project.title?.charAt(0)}</span>
          </div>
        )}

        {/* Content area below image — clean separation */}
        <div className="p-5 lg:p-6">
          {/* Title */}
          <h3 className="text-lg lg:text-xl font-bold text-white leading-snug mb-2 group-hover:text-brand transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-text leading-relaxed line-clamp-3 mb-4">
            {project.shortDescription}
          </p>

          {/* Tech pills */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[11px] font-medium tracking-wide text-brand/80 border border-brand/20 rounded-full bg-brand/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Links row */}
          <div className="flex items-center gap-3 pt-4 border-t border-stroke/40">
            {project.liveDemoUrl ? (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/vp inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand/25 hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/0 group-hover/vp:bg-white/10 transition-colors duration-300" />
                <ArrowUpRight className="relative w-3.5 h-3.5 transition-transform duration-300 group-hover/vp:translate-x-0.5 group-hover/vp:-translate-y-0.5" />
                <span className="relative">View Project</span>
              </a>
            ) : project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/vp inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand/25 hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/0 group-hover/vp:bg-white/10 transition-colors duration-300" />
                <Github className="relative w-3.5 h-3.5 transition-transform duration-300 group-hover/vp:rotate-12" />
                <span className="relative">View Project</span>
              </a>
            ) : null}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function FeaturedProjects() {
  const { projects, loading } = useData();
  const router = useRouter();

  // Filter featured projects and sort by displayOrder
  const featuredProjects = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section id="featured-projects" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Featured Work"
          title="Featured Projects"
          description="A selection of projects I'm proud of."
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-surface border border-stroke/40">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">No featured projects yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* View All Projects CTA */}
            <ScrollReveal delay={0.3}>
              <div className="mt-12 lg:mt-16 text-center">
                <SlideFillButton
                  label="View All Projects"
                  variant="secondary"
                  onClick={() => router.push('/projects')}
                />
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </section>
  );
}
