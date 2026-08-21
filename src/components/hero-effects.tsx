'use client';

import { useEffect, useState } from 'react';
import { HeroGlow } from './hero-glow';
import DigitalRain from './digital-rain';

export function HeroEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mount canvas animations after the initial frame paints the hero LCP element
    const id = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(() => setMounted(true), { timeout: 100 })
      : setTimeout(() => setMounted(true), 50);

    return () => {
      if (typeof cancelIdleCallback !== 'undefined' && typeof id === 'number') {
        cancelIdleCallback(id);
      } else {
        clearTimeout(id as NodeJS.Timeout);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <HeroGlow />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <DigitalRain
          headColor="rgba(255,57,0,0.45)"
          trailColor="rgba(154,154,154,0.15)"
          glyphSize={14}
          speed={5}
          density={30}
          trail={18}
          shuffle={true}
        />
      </div>
    </>
  );
}
