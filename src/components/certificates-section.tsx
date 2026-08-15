'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from './scroll-reveal';
import FocusReveal from './focus-reveal';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import type { Certificate } from '@/lib/types';

function parseSkills(skillsJson: string): string[] {
  try {
    const parsed = JSON.parse(skillsJson);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [];
  } catch {
    if (skillsJson && skillsJson.trim()) return skillsJson.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  }
}

function formatIssueYear(dateStr: string): string {
  if (!dateStr) return '';
  const yearMatch = dateStr.match(/\d{4}/);
  return yearMatch ? yearMatch[0] : dateStr;
}

function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  const hasImage = !!cert.certificateImage;
  const href = cert.credentialUrl || '#';
  const skills = parseSkills(cert.skills);
  const year = formatIssueYear(cert.issueDate);

  const subtitleParts: string[] = [];
  if (skills.length > 0) subtitleParts.push(skills[0]);
  if (cert.issuer) subtitleParts.push(cert.issuer);
  if (year) subtitleParts.push(`Issued ${year}`);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="certificate-card"
    >
      {hasImage ? (
        <img src={cert.certificateImage} alt={cert.title} className="certificate-card-image" />
      ) : (
        <div
          className="certificate-card-image"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          }}
        />
      )}

      <div className="certificate-card-content">
        <div />
        <div className="certificate-info">
          <h3 className="certificate-title">{cert.title}</h3>
          {subtitleParts.length > 0 && (
            <p className="certificate-meta">{subtitleParts.join(' · ')}</p>
          )}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-link"
            aria-label={`View credential for ${cert.title}`}
          >
            View Certificate
          </a>
        </div>
      </div>
    </motion.div>
  );
}

const CERT_TITLE_CLASSES = 'text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight';

export function CertificatesSection() {
  const { certificates, loading } = useData();
  const [activeFilter, setActiveFilter] = useState('All');

  // Hardcoded filter categories
  const categories = ['All', 'Cybersecurity', 'PHP', 'Python', 'Computer Hardware'];

  // Filter certificates by selected category
  const filteredCerts = useMemo(() => {
    if (activeFilter === 'All') return certificates;
    return certificates.filter((cert) => cert.category === activeFilter);
  }, [certificates, activeFilter]);

  return (
    <section id="certificates" className="relative py-24 lg:py-32 bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-12">
          <ScrollReveal delay={0}>
            <span className="inline-block px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-text bg-surface border border-stroke rounded-sm mb-5">
              Certificates
            </span>
          </ScrollReveal>
          <FocusReveal
            text="Certificates & Credentials"
            as="h2"
            className={CERT_TITLE_CLASSES}
            blur={20}
            staggerFrom="start"
          />
          <ScrollReveal delay={0.3}>
            <p className="mt-4 text-muted-text max-w-2xl mx-auto text-base leading-relaxed">
              A collection of certifications and professional training I&apos;ve completed throughout my learning journey.
            </p>
          </ScrollReveal>
        </div>

        {/* Filter buttons — centered */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12 lg:mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full border transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20'
                    : 'bg-surface/50 text-muted-text border-stroke/40 hover:text-white hover:border-brand/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Certificate grid */}
        {loading ? (
          <div className="certificates-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="certificate-card">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">
              {activeFilter !== 'All'
                ? `No certificates found for "${activeFilter}".`
                : 'No certificates yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <motion.div layout className="certificates-grid">
            <AnimatePresence mode="popLayout">
              {filteredCerts.map((cert, index) => (
                <CertificateCard key={cert.id} cert={cert} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
