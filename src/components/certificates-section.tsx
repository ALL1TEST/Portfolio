'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Award } from 'lucide-react';
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

function formatIssueDate(dateStr: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(match[2], 10) - 1;
    if (monthIndex >= 0 && monthIndex <= 11) return `${months[monthIndex]} ${match[1]}`;
  }
  return dateStr;
}

function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  const hasImage = !!cert.certificateImage;
  const href = cert.credentialUrl || '#';
  const skills = parseSkills(cert.skills);
  const formattedDate = formatIssueDate(cert.issueDate);

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
      className="cert-v2-card group"
    >
      {/* Image / Thumbnail area */}
      <div className="cert-v2-image-area">
        {hasImage ? (
          <img src={cert.certificateImage} alt={cert.title} className="cert-v2-image" />
        ) : (
          <div className="cert-v2-image-placeholder">
            <Award className="w-10 h-10 text-stroke/30" />
            <span className="text-xs text-stroke/40 mt-2 uppercase tracking-wider">No Image</span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="cert-v2-content">
        {/* Category badge */}
        {cert.category && (
          <span className="cert-v2-category-badge">{cert.category}</span>
        )}

        {/* Title */}
        <h3 className="cert-v2-title">{cert.title}</h3>

        {/* Issuer */}
        <p className="cert-v2-issuer">{cert.issuer}</p>

        {/* Issue date */}
        {formattedDate && (
          <p className="cert-v2-date">
            Issued {formattedDate}
          </p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="cert-v2-skills">
            <span className="cert-v2-skills-label">Skills:</span>
            <span className="cert-v2-skills-text">
              {skills.join(' • ')}
            </span>
          </div>
        )}

        {/* View Credential button */}
        {href !== '#' && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-v2-view-btn"
            aria-label={`View credential for ${cert.title}`}
          >
            <span>View Credential</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
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
          <div className="cert-v2-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="cert-v2-card">
                <div className="cert-v2-image-area">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="cert-v2-content">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
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
          <motion.div layout className="cert-v2-grid">
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
