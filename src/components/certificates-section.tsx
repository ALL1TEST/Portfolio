'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from './scroll-reveal';
import FocusReveal from './focus-reveal';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
  return dateStr.trim();
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
      {/* Certificate image — fully visible background */}
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

      {/* Glass content panel — positioned at the bottom of the card */}
      <div className="certificate-glass-panel backdrop-blur-2xl backdrop-saturate-[1.4]">
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

const VISIBLE_LIMIT = 2;

export function CertificatesSection() {
  const { profile, certificates, loading } = useData();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);

  // Dynamically derive filter categories from actual certificate data
  const categories = useMemo(() => {
    const cats = new Set<string>();
    certificates.forEach((cert) => {
      if (cert.category && cert.category.trim()) cats.add(cert.category.trim());
    });
    return ['All', ...Array.from(cats).sort()];
  }, [certificates]);

  // Filter certificates by selected category
  const filteredCerts = useMemo(() => {
    if (activeFilter === 'All') return certificates;
    return certificates.filter((cert) => cert.category === activeFilter);
  }, [certificates, activeFilter]);

  // Show More / Show Less
  const visibleCerts = showAll ? filteredCerts : filteredCerts.slice(0, VISIBLE_LIMIT);
  const hasMore = filteredCerts.length > VISIBLE_LIMIT;

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
          {profile?.certificatesPageTitle && (
          <FocusReveal
            text={profile.certificatesPageTitle}
            as="h2"
            className={CERT_TITLE_CLASSES}
            blur={20}
            staggerFrom="start"
            transition={{
              type: "tween",
              duration: 0.3,
              delay: 0,
              ease: "easeOut",
              staggerChildren: 0.035,
            }}
          />
          )}
          {profile?.certificatesPageDescription && (
            <ScrollReveal delay={0.3}>
              <p className="mt-4 text-muted-text max-w-2xl mx-auto text-base leading-relaxed">
                {profile.certificatesPageDescription}
              </p>
            </ScrollReveal>
          )}
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
          <>
            <motion.div layout className="certificates-grid">
              <AnimatePresence mode="popLayout">
                {visibleCerts.map((cert, index) => (
                  <CertificateCard key={cert.id} cert={cert} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="mt-12 lg:mt-16 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group/toggle relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white/80 bg-surface border border-stroke/50 rounded-full overflow-hidden transition-all duration-300 hover:text-white hover:border-brand/40 hover:shadow-lg hover:shadow-brand/15 hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 bg-brand/0 group-hover/toggle:bg-brand/10 transition-colors duration-300" />
                  {showAll ? (
                    <>
                      <ChevronUp className="relative w-4 h-4 transition-transform duration-300 group-hover/toggle:-translate-y-0.5" />
                      <span className="relative">Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="relative w-4 h-4 transition-transform duration-300 group-hover/toggle:translate-y-0.5" />
                      <span className="relative">Show More</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
