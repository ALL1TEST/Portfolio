'use client';

import { motion } from 'framer-motion';
import { Award, Calendar, Tag, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

function CertificateCard({ cert, index }: { cert: ReturnType<typeof useData>['certificates'][0]; index: number }) {
  const skills: string[] = (() => {
    try { return JSON.parse(cert.skills); } catch { return []; }
  })();

  return (
    <ScrollReveal delay={index * 0.15}>
      <motion.div
        className="group relative bg-surface border border-stroke/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-brand/30"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand/0 to-transparent group-hover:via-brand/60 transition-all duration-500" />

        <div className="p-6 lg:p-8">
          <div className="flex items-start justify-between mb-6">
            {cert.certificateImage ? (
              <img src={cert.certificateImage} alt={cert.title} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 bg-surface border border-stroke/50 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-brand/60" />
              </div>
            )}
            <div className="flex items-center gap-2">
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-brand transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors duration-300">
            {cert.title}
          </h3>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-text">
              <Tag className="w-3.5 h-3.5" />
              <span>{cert.issuer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-text">
              <Calendar className="w-3.5 h-3.5" />
              <span>{cert.issueDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-stroke/30">
            {skills.map((skill) => (
              <span key={skill} className="px-3 py-1 text-xs font-medium text-brand bg-brand/10 border border-brand/20 rounded-full">
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
  const { certificates, loading } = useData();

  return (
    <section id="certificates" className="relative py-24 lg:py-32 bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Certificates"
          title="Credentials & Learning"
          description="Professional certifications that validate my expertise and commitment to continuous learning."
        />

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface border border-stroke/50 rounded-2xl p-6 lg:p-8">
                <Skeleton className="w-14 h-14 rounded-xl mb-4" />
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {certificates.map((cert, index) => (
              <CertificateCard key={cert.id} cert={cert} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
