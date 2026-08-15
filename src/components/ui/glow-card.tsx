'use client';

import { useRef, useCallback } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className = '' }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glow-card ${className}`}
    >
      <div className="glow-border-glow" aria-hidden="true" />
      <div className="glow-spotlight" aria-hidden="true" />
      <div className="glow-card-content">
        {children}
      </div>
    </div>
  );
}
