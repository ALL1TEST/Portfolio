'use client';

import { ArrowRight, Award } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useData } from '@/lib/data-provider';
import { Skeleton } from '@/components/ui/skeleton';

function CertificateCard({ cert, index }: { cert: ReturnType<typeof useData>['certificates'][0]; index: number }) {
  const hasImage = !!cert.certificateImage;
  const href = cert.credentialUrl || '#';

  // Extract year from issueDate for the tag pill
  const yearMatch = cert.issueDate?.match(/\b(19|20)\d{2}\b/);
  const yearText = yearMatch ? yearMatch[0] : cert.issueDate || '';

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
            <Award className="w-20 h-20 text-stroke/20" />
          </div>
        )}

        {/* Content layer — tags top-right, info bottom-left */}
        <div className="certificate-card-content">
          {/* Top row: tags pushed to the right */}
          <div className="certificate-tags">
            <span className="certificate-tag">{cert.issuer}</span>
            {yearText && <span className="certificate-tag">{yearText}</span>}
          </div>

          {/* Bottom: title + meta */}
          <div className="certificate-info">
            <h2 className="certificate-title">{cert.title}</h2>
            <p className="certificate-meta">{cert.issuer}</p>
          </div>
        </div>

        {/* Centered View button — hidden until hover (always visible on mobile) */}
        {href !== '#' && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-view-button"
            aria-label={`View ${cert.title}`}
          >
            <span>→</span>
            <span>View</span>
          </a>
        )}
      </div>
    </ScrollReveal>
  );
}

export function CertificatesSection() {
  const { certificates, loading } = useData();

  return (
    <section id="certificates" className="relative py-24 lg:py-32 bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <ScrollReveal delay={0}>
          <div className="text-center mb-14 lg:mb-20">
            <span className="inline-block px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-text bg-surface border border-stroke rounded-sm mb-5">
              Certificates
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Credentials &amp; Learning
            </h2>
            <p className="mt-4 text-muted-text max-w-xl mx-auto text-base leading-relaxed">
              Professional certifications that validate my expertise and commitment to continuous learning.
            </p>
          </div>
        </ScrollReveal>

        {/* Grid */}
        {loading ? (
          <div className="certificates-grid">
            {[1, 2].map((i) => (
              <div key={i} className="certificate-card">
                <Skeleton className="absolute inset-0" />
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">No certificates yet. Check back soon!</p>
          </div>
        ) : (
          <div className="certificates-grid">
            {certificates.map((cert, index) => (
              <CertificateCard key={cert.id} cert={cert} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
