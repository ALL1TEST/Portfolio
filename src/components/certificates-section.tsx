'use client';

import { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

const FILTER_CATEGORIES = ['All', 'Cybersecurity', 'PHP', 'Python', 'Computer Hardware'];

function parseSkills(skillsJson: string): string {
  try {
    const parsed = JSON.parse(skillsJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.join(', ');
    }
    return '';
  } catch {
    // If not valid JSON, return as-is if non-empty
    return skillsJson || '';
  }
}

function CertificateCard({ cert, index }: { cert: ReturnType<typeof useData>['certificates'][0]; index: number }) {
  const hasImage = !!cert.certificateImage;
  const href = cert.credentialUrl || '#';

  // Extract year from issueDate
  const yearMatch = cert.issueDate?.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : '';

  // Parse skills
  const skillsText = parseSkills(cert.skills);

  return (
    <ScrollReveal delay={index * 0.15}>
      <div className="certificate-card group">
        {/* Background image */}
        {hasImage ? (
          <img
            src={cert.certificateImage}
            alt={cert.title}
            className="certificate-card-image"
          />
        ) : (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <span className="text-4xl font-bold text-stroke/30">{cert.title?.charAt(0)}</span>
          </div>
        )}

        {/* Content layer */}
        <div className="certificate-card-content">
          {/* Bottom info */}
          <div className="certificate-info">
            <h2 className="certificate-title">{cert.title}</h2>
            {(skillsText || year) && (
              <p className="text-sm text-white/60 mt-1">
                {skillsText}{skillsText && year && ' • '}<span className="text-white/45">Issued {year}</span>
              </p>
            )}
          </div>
        </div>

        {/* Centered View Credential pill button */}
        {href !== '#' && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-view-button"
            aria-label={`View ${cert.title}`}
          >
            <span>View Credential</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </ScrollReveal>
  );
}

export function CertificatesSection() {
  const { certificates, loading } = useData();
  const [activeFilter, setActiveFilter] = useState('All');

  // Get unique categories from certificate skills
  const filteredCerts = useMemo(() => {
    if (activeFilter === 'All') return certificates;
    return certificates.filter((cert) => {
      const skillsText = parseSkills(cert.skills).toLowerCase();
      const titleLower = cert.title.toLowerCase();
      const issuerLower = cert.issuer.toLowerCase();
      const filterLower = activeFilter.toLowerCase();

      // Match filter against skills, title, or issuer
      return skillsText.includes(filterLower) || titleLower.includes(filterLower) || issuerLower.includes(filterLower);
    });
  }, [certificates, activeFilter]);

  return (
    <section id="certificates" className="relative py-24 lg:py-32 bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Certificates"
          title="Credentials & Learning"
          description="Professional certifications that validate my expertise and commitment to continuous learning."
        />

        {/* Centered filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 lg:mb-16">
          {FILTER_CATEGORIES.map((cat) => (
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

        {/* Grid */}
        {loading ? (
          <div className="certificates-grid">
            {[1, 2].map((i) => (
              <div key={i} className="certificate-card">
                <Skeleton className="absolute inset-0" />
              </div>
            ))}
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">
              {activeFilter !== 'All' ? `No certificates found for "${activeFilter}".` : 'No certificates yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="certificates-grid">
            {filteredCerts.map((cert, index) => (
              <CertificateCard key={cert.id} cert={cert} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
