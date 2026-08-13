'use client';

import { motion } from 'framer-motion';
import { Award, Calendar, Tag } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  icon: string;
}

const certificates: Certificate[] = [
  {
    title: 'PHP Essential Training',
    issuer: 'LinkedIn Learning',
    date: 'April 2025',
    skills: ['PHP', 'Back-End Web Development'],
    icon: '📘',
  },
  {
    title: 'Foundations of Cybersecurity',
    issuer: 'Google',
    date: 'May 2025',
    skills: ['Cybersecurity', 'Network Security'],
    icon: '🔐',
  },
];

function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  return (
    <ScrollReveal delay={index * 0.15}>
      <motion.div
        className="group relative bg-surface border border-stroke/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-brand/30"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand/0 to-transparent group-hover:via-brand/60 transition-all duration-500" />

        <div className="p-6 lg:p-8">
          {/* Icon and badge */}
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 bg-surface border border-stroke/50 rounded-xl flex items-center justify-center text-2xl">
              {cert.icon}
            </div>
            <Award className="w-5 h-5 text-brand/40 group-hover:text-brand transition-colors duration-300" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors duration-300">
            {cert.title}
          </h3>

          {/* Issuer and Date */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-text">
              <Tag className="w-3.5 h-3.5" />
              <span>{cert.issuer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-text">
              <Calendar className="w-3.5 h-3.5" />
              <span>{cert.date}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-stroke/30">
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-medium text-brand bg-brand/10 border border-brand/20 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function CertificatesSection() {
  return (
    <section
      id="certificates"
      className="relative py-24 lg:py-32 bg-gradient-dark"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Certificates"
          title="Credentials & Learning"
          description="Professional certifications that validate my expertise and commitment to continuous learning."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certificates.map((cert, index) => (
            <CertificateCard key={cert.title} cert={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
