'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, ChevronUp, ChevronDown } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { GlowCard } from '@/components/ui/glow-card';
import type { Project } from '@/lib/types';

export function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const technologies: string[] = (() => {
    try { return JSON.parse(project.technologies); } catch { return []; }
  })();

  const hasImage = !!project.projectImage;
  const description = project.fullDescription || project.shortDescription || '';
  const isLongDescription = description.length > 130;

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
            <Image
              src={project.projectImage}
              alt={`${project.title} - Project by Abdellah Ait-Si (CodeVirtox)`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
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
          <h3 className="text-xl lg:text-2xl font-bold text-white leading-snug mb-3 group-hover:text-brand transition-colors duration-300 break-words">
            {project.title}
          </h3>

          {/* Description */}
          <div className="mb-5">
            <p className={`text-sm lg:text-base text-muted-text leading-relaxed ${isLongDescription && !isExpanded ? 'line-clamp-3' : ''}`}>
              {description}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-brand hover:text-brand-light font-medium transition-colors mt-2 inline-flex items-center gap-1 focus:outline-none"
              >
                {isExpanded ? (
                  <>
                    Show Less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>

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
              aria-label={`View ${project.title} project live demo or repository`}
              className="group/vp relative inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-brand rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand/25 hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 bg-white/0 group-hover/vp:bg-white/10 transition-colors duration-300" />
              <ArrowUpRight className="relative w-3.5 h-3.5 transition-transform duration-300 group-hover/vp:translate-x-0.5 group-hover/vp:-translate-y-0.5" />
              <span className="relative">View Project</span>
            </a>
            {project.githubUrl && project.liveDemoUrl && project.githubUrl !== project.liveDemoUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source code for ${project.title} on GitHub`}
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
