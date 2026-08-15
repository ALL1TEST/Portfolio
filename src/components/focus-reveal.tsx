'use client';

// Focus Reveal — Character-by-character blur + scale reveal
// Uses native IntersectionObserver for reliable viewport detection.
// Animation triggers ONCE when the element enters the viewport.

import {
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type CSSProperties,
  type ElementType,
} from 'react';

type StaggerFrom = 'start' | 'center' | 'end' | 'random';

type FocusRevealProps = {
  text?: string;
  /** Optional inline font overrides. Prefer Tailwind via `className`. */
  font?: CSSProperties;
  /** Optional inline color. Prefer Tailwind via `className`. */
  color?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** Blur amount in hidden state (0–20). Default: 14. */
  blur?: number;
  /** Scale in hidden state. Default: 1.15. */
  scaleStart?: number;
  /** Stagger direction for characters. Default: "start". */
  staggerFrom?: StaggerFrom;
  /** Duration per character animation in seconds. Default: 0.4. */
  duration?: number;
  /** Seconds between each character's animation start. Default: 0.03. */
  staggerChildren?: number;
  /** Portion of element that must be visible to trigger. Default: 0.3. */
  viewportAmount?: number;
  onComplete?: () => void;
};

const MAX_BLUR = 20;
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const satisfies Record<string, ElementType>;

const buildDelays = (
  count: number,
  each: number,
  from: StaggerFrom,
): number[] => {
  if (count === 0) return [];
  if (from === 'random') {
    const order = Array.from({ length: count }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order.map((rank) => rank * each);
  }
  if (from === 'end') {
    return Array.from({ length: count }, (_, i) => (count - 1 - i) * each);
  }
  if (from === 'center') {
    const mid = (count - 1) / 2;
    return Array.from({ length: count }, (_, i) => Math.abs(i - mid) * each);
  }
  return Array.from({ length: count }, (_, i) => i * each);
};

const FocusReveal = ({
  text = 'FOCUS REVEAL',
  font,
  color,
  className = '',
  as: Tag = 'h2',
  blur = 14,
  scaleStart = 1.15,
  staggerFrom = 'start',
  duration = 0.4,
  staggerChildren = 0.03,
  viewportAmount = 0.3,
  onComplete,
}: FocusRevealProps) => {
  const reduceMotion = useReducedMotion();
  const skipMotion = reduceMotion === true;

  // Track whether the element has entered the viewport
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef(false);

  // Native IntersectionObserver — most reliable viewport detection
  useEffect(() => {
    const el = containerRef.current;
    if (!el || triggeredRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggeredRef.current = true;
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: viewportAmount },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [viewportAmount]);

  const safeBlur = Math.min(Math.max(blur, 0), MAX_BLUR);

  // Build per-character stagger delays
  const delays = useMemo(
    () => buildDelays(text.length, skipMotion ? 0 : staggerChildren, staggerFrom),
    [text.length, skipMotion, staggerChildren, staggerFrom],
  );

  // Fire onComplete after last character animation finishes
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });
  const handleLastCharComplete = useCallback(() => {
    onCompleteRef.current?.();
  }, []);

  const MotionTag = MOTION_TAGS[Tag];

  const rootStyle: CSSProperties = {
    margin: 0,
    display: 'block',
    width: '100%',
    ...(color ? { color } : null),
    ...(font ?? null),
  };

  // Reduced motion: render plain text immediately visible
  if (skipMotion) {
    return (
      <div ref={containerRef}>
        <MotionTag aria-label={text} className={className} style={rootStyle}>
          {text}
        </MotionTag>
      </div>
    );
  }

  // Before viewport entry: invisible placeholder (preserves layout space)
  if (!isVisible) {
    return (
      <div ref={containerRef}>
        <MotionTag
          aria-label={text}
          className={className}
          style={{ ...rootStyle, visibility: 'hidden' }}
        >
          {text}
        </MotionTag>
      </div>
    );
  }

  // After viewport entry: mount animated characters
  // initial=hidden, animate=visible → guaranteed animation because values differ
  const chars = text.split('');
  const lastIndex = chars.length - 1;

  return (
    <div ref={containerRef}>
      <MotionTag
        aria-label={text}
        className={className}
        style={rootStyle}
      >
        {chars.map((char, index) => {
          const delay = delays[index] ?? 0;

          return (
            <span
              key={`${index}-${char}`}
              className="inline-block whitespace-nowrap"
              aria-hidden="true"
            >
              <motion.span
                className="inline-block will-change-[transform,opacity,filter]"
                initial={{
                  opacity: 0,
                  scale: scaleStart,
                  filter: `blur(${safeBlur}px)`,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                transition={{
                  type: 'tween',
                  duration,
                  delay,
                  ease: EASE_OUT,
                }}
                onAnimationComplete={
                  index === lastIndex ? handleLastCharComplete : undefined
                }
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            </span>
          );
        })}
      </MotionTag>
    </div>
  );
};

FocusReveal.displayName = 'FocusReveal';

export default FocusReveal;
export type { FocusRevealProps, StaggerFrom };
