'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';

interface Project {
  number: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  date: string;
}

const projects: Project[] = [
  {
    number: '01',
    title: 'DentClinic',
    description:
      'Development of a complete dental clinic management application with comprehensive features for appointment management, patient records, and financial tracking.',
    features: [
      'Appointment management',
      'Patient management',
      'Administrative interfaces',
      'Process automation',
      'Financial management',
    ],
    technologies: ['Laravel', 'PHP', 'MySQL', 'FilamentPHP'],
    date: 'May 2026 – June 2026',
  },
  {
    number: '02',
    title: 'CRUD Étudiant',
    description:
      'Development of an application for managing student information with full CRUD operations and database management capabilities.',
    features: [
      'Create student records',
      'View student records',
      'Update student records',
      'Delete student records',
      'Database management',
    ],
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS'],
    date: 'April 2025 – May 2025',
  },
  {
    number: '03',
    title: 'Library Management System',
    description:
      'Development of an application for managing and organizing a collection of books with browsing and data interaction capabilities.',
    features: [
      'Browse books',
      'Organize books',
      'Manage book data',
      'Data interaction',
    ],
    technologies: ['JavaScript', 'HTML', 'CSS'],
    date: 'February 2023 – March 2023',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <ScrollReveal delay={index * 0.15} direction={index % 2 === 0 ? 'left' : 'right'}>
      <motion.div
        className="group relative bg-surface border border-stroke/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-brand/30"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand/0 to-transparent group-hover:via-brand/60 transition-all duration-500" />

        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-brand font-mono text-sm font-bold">
                {project.number}
              </span>
              <span className="text-xs text-muted-text font-medium">
                {project.date}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-text/0 group-hover:text-brand transition-all duration-300" />
          </div>

          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-brand transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-text leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Features */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-text/60 mb-3">
              Key Features
            </p>
            <ul className="space-y-1.5">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-text"
                >
                  <span className="w-1 h-1 bg-brand/60 rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-stroke/30">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium text-brand bg-brand/10 border border-brand/20 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Projects"
          title="Featured Work"
          description="A selection of projects that showcase my skills in full-stack development, from management systems to web applications."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.number} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
