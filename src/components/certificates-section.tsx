'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from './scroll-reveal';
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
  // Extract year from various formats
  const yearMatch = dateStr.match(/\d{4}/);
  return yearMatch ? yearMatch[0] : dateStr;
}

function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  const hasImage = !!cert.certificateImage;
  const href = cert.credentialUrl || '#';
  const skills = parseSkills(cert.skills);
  const year = formatIssueYear(cert.issueDate);

  // Build the subtitle line: "Skill / Category • Issued Year"
  const subtitleParts: string[] = [];
  if (cert.category) {
    subtitleParts.push(cert.category);
  }
  if (skills.length > 0) {
    subtitleParts.push(skills[0]);
  }
  if (year) {
    subtitleParts.push(`Issued ${year}`);
  }

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
      {/* Full-bleed image */}
      {hasImage ? (
        <img
          src={cert.certificateImage}
          alt={cert.title}
          className="certificate-card-image"
        />
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

      {/* Content overlay — title + meta at bottom */}
      <div className="certificate-card-content">
        {/* Spacer for top (no tags) */}
        <div />

        {/* Title + subtitle at bottom-left */}
        <div className="certificate-info">
          <h3 className="certificate-title">{cert.title}</h3>
          {subtitleParts.length > 0 && (
            <p className="certificate-meta">
              {subtitleParts.join(' • ')}
            </p>
          )}
        </div>
      </div>

      {/* Centered View button — appears on hover */}
      {href !== '#' ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="certificate-view-button"
          aria-label={`View credential for ${cert.title}`}
        >
          <span>→</span>
          <span>View</span>
        </a>
      ) : (
        <div className="certificate-view-button" style={{ cursor: 'default' }}>
          <span>→</span>
          <span>View</span>
        </div>
      )}
    </motion.div>
  );
}

export function CertificatesSection() {
  const { certificates, loading } = useData();
  const [activeFilter, setActiveFilter] = useState('All');

  // Dynamically extract categories from certificates in DB
  const categories = useMemo(() => {
    const cats = new Set<string>();
    certificates.forEach((cert) => {
      if (cert.category && cert.category.trim()) {
        cats.add(cert.category.trim());
      }
    });
    // Return sorted: All first, then alphabetically
    return ['All', ...Array.from(cats).sort((a, b) => a.localeCompare(b))];
  }, [certificates]);

  // Filter certificates by selected category
  const filteredCerts = useMemo(() => {
    if (activeFilter === 'All') return certificates;
    return certificates.filter((cert) => cert.category === activeFilter);
  }, [certificates, activeFilter]);

  // Total count for stats
  const totalCount = certificates.length;

  return (
    <section id="certificates" className="relative py-24 lg:py-32 bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with title, subtitle, and stats */}
        <ScrollReveal>
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-text bg-surface border border-stroke rounded-sm mb-5">
              Certificates
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Certificates &amp; Credentials
            </h2>
            <p className="mt-4 text-muted-text max-w-2xl mx-auto text-base leading-relaxed">
              A collection of certifications and professional training I&apos;ve completed throughout my learning journey.
            </p>

            {/* Stats counter */}
            {!loading && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full">
                <span className="text-2xl font-bold text-brand">{totalCount}+</span>
                <span className="text-sm font-medium text-brand/80">Certificates</span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Dynamic filter buttons */}
        {!loading && categories.length > 1 && (
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
        )}

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
