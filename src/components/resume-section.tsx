'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Globe,
  Server,
  Database,
  Brain,
  Layout,
  Cloud,
  Search,
  MapPin,
  Calendar,
  Download,
  Users,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';

interface SkillCategory {
  icon: React.ElementType;
  title: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  { icon: Code2, title: 'Programming', skills: ['JavaScript', 'PHP', 'Python', 'SQL'] },
  { icon: Globe, title: 'Web', skills: ['HTML', 'CSS', 'React', 'Next.js', 'Tailwind CSS'] },
  { icon: Server, title: 'Back-end', skills: ['Laravel', 'Node.js'] },
  { icon: Database, title: 'Databases', skills: ['MySQL', 'MongoDB'] },
  { icon: Brain, title: 'AI & Automation', skills: ['AI Tools', 'Workflow Automation', 'API Integration'] },
  { icon: Layout, title: 'CMS', skills: ['WordPress', 'Elementor'] },
  { icon: Cloud, title: 'Tools & Cloud', skills: ['Git', 'GitHub', 'Docker', 'VS Code', 'Oracle Cloud'] },
  { icon: Search, title: 'SEO', skills: ['Web Optimization'] },
];

interface Experience {
  title: string;
  date: string;
  location: string;
  description: string;
  technologies: string[];
}

const experiences: Experience[] = [
  {
    title: 'DentClinic',
    date: 'May 2026 – June 2026',
    location: 'Oulad Teima, Morocco',
    description: 'Development of a dental clinic management application.',
    technologies: ['Laravel', 'PHP', 'MySQL', 'FilamentPHP'],
  },
  {
    title: 'CRUD Étudiant',
    date: 'April 2025 – May 2025',
    location: 'Oulad Teima, Morocco',
    description: 'Development of a student management application.',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS'],
  },
  {
    title: 'Library Management System',
    date: 'February 2023 – March 2023',
    location: 'Oulad Teima, Morocco',
    description: 'Development of a library management application.',
    technologies: ['JavaScript', 'HTML', 'CSS'],
  },
];

interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
}

const education: Education[] = [
  {
    degree: 'Diplôme de Technicien Spécialisé',
    field: 'Développement Digital',
    institution: 'OFPPT',
    location: 'Oulad Teima',
    year: '2024',
  },
  {
    degree: 'Baccalauréat',
    field: 'Sciences de la Vie et de la Terre',
    institution: 'Lycée Qualifiant Al Araar',
    location: 'Essaouira',
    year: '2020 – 2021',
  },
];

interface Language {
  name: string;
  level: string;
}

const languages: Language[] = [
  { name: 'Arabic', level: 'Native' },
  { name: 'Amazigh', level: 'Native' },
  { name: 'French', level: 'Intermediate' },
  { name: 'English', level: 'Technical' },
];

const softSkills = [
  { name: 'Project Management', icon: Calendar },
  { name: 'Teamwork', icon: Users },
  { name: 'Adaptability', icon: RefreshCw },
  { name: 'Problem Solving', icon: Lightbulb },
];

function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  const Icon = category.icon;
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
          <h4 className="text-sm font-semibold text-white">{category.title}</h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {category.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs text-muted-text bg-dark/50 border border-stroke/20 rounded-md hover:text-white hover:border-brand/30 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function ResumeSection() {
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
              Développeur Full Stack spécialisé en React, Laravel et MySQL,
              passionné par la création d&apos;applications web modernes. Intéressé
              par l&apos;intelligence artificielle, l&apos;automatisation et le développement
              de solutions innovantes.
            </p>
          </div>
        </ScrollReveal>

        {/* Technical Skills */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Technical Skills
            </h3>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillCategories.map((category, index) => (
              <SkillCard key={category.title} category={category} index={index} />
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Experience & Projects
            </h3>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-6">
            {experiences.map((exp, index) => (
              <ScrollReveal key={exp.title} delay={index * 0.1}>
                <motion.div
                  className="group relative p-6 bg-surface/50 border border-stroke/30 rounded-xl hover:border-brand/30 transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute top-6 -left-3 w-6 h-[1px] bg-stroke/30" />
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                        {exp.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-muted-text">
                          <Calendar className="w-3 h-3" />
                          {exp.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-text">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-text mb-3">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs text-brand bg-brand/10 border border-brand/20 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Education
            </h3>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-6">
            {education.map((edu, index) => (
              <ScrollReveal key={edu.degree} delay={index * 0.1}>
                <motion.div
                  className="group relative p-6 bg-surface/50 border border-stroke/30 rounded-xl hover:border-brand/30 transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-muted-text">{edu.field}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium text-brand bg-brand/10 border border-brand/20 rounded-full">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-sm text-muted-text">
                    {edu.institution}, {edu.location}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Languages & Soft Skills */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Languages */}
          <ScrollReveal direction="left">
            <div className="p-6 bg-surface/50 border border-stroke/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Languages</h3>
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-sm font-medium text-white">
                      {lang.name}
                    </span>
                    <span className="text-xs font-medium text-brand bg-brand/10 px-3 py-1 rounded-full">
                      {lang.level}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Soft Skills */}
          <ScrollReveal direction="right">
            <div className="p-6 bg-surface/50 border border-stroke/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Soft Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {softSkills.map((skill, index) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
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
                      <span className="text-sm text-muted-text group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Download CV */}
        <ScrollReveal className="text-center">
          <motion.button
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-brand rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand to-brand-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Download Resume</span>
            <Download className="relative w-4 h-4" />
          </motion.button>
          <p className="mt-3 text-xs text-muted-text">
            CV file coming soon
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
