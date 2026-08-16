'use client';

import { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollReveal } from './scroll-reveal';
import { useData } from '@/lib/data-provider';

export function EducationSection() {
  const { profile, education, loading } = useData();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(0);
  }, []);

  // Format the index as two-digit number
  const formatNumber = (index: number) => {
    return String(index + 1).padStart(2, '0');
  };

  return (
    <section id="education" className="education-section">
      <div className="education-inner">
        {/* Section Header */}
        <div className="education-header">
          <div className="education-header-left">
            <span className="inline-block px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-text bg-surface border border-stroke rounded-sm mb-5">EDUCATION</span>
            {profile?.educationPageTitle && (
              <h2 className="education-heading">{profile.educationPageTitle}</h2>
            )}
            {profile?.educationPageDescription && (
              <p className="education-description">{profile.educationPageDescription}</p>
            )}
          </div>
        </div>

        {/* Education List */}
        <div className="education-list">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="education-item education-item-skeleton">
                <div className="education-number-skeleton">
                  <Skeleton className="w-16 h-12 bg-surface/50" />
                </div>
                <div className="education-content-skeleton">
                  <Skeleton className="h-7 w-80 mb-3 bg-surface/50" />
                  <Skeleton className="h-5 w-64 bg-surface/50" />
                </div>
                <div className="education-date-skeleton">
                  <Skeleton className="w-28 h-6 bg-surface/50" />
                </div>
              </div>
            ))
          ) : education.length === 0 ? (
            <div className="education-empty">
              <p>No education entries yet.</p>
            </div>
          ) : (
            education.map((edu, index) => (
              <ScrollReveal key={edu.id} delay={index * 0.08}>
                <article
                  className={`education-item ${activeIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Number */}
                  <div className="education-number">{formatNumber(index)}</div>

                  {/* Content */}
                  <div className="education-content">
                    <h3 className="education-institution">{edu.institution}</h3>
                    <p className="education-degree">
                      {edu.degree}{edu.field ? ` – ${edu.field}` : ''}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="education-date">{edu.year}</div>
                </article>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
