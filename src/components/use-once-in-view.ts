'use client';

import { useRef, useState, useEffect } from 'react';

/**
 * Returns `true` once the referenced element enters the viewport.
 * After that, it stays `true` forever (once-only trigger).
 * Uses a native IntersectionObserver — starts as `false` and only
 * flips to `true` when the element is genuinely visible.
 */
export function useOnceInView(
  ref: React.RefObject<HTMLElement | null>,
  rootMargin = '-60px',
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
