'use client';

// Focus Reveal — Character-by-character blur + scale reveal
// Uses framer-motion viewport detection via a wrapper div.

import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from 'framer-motion';
import {
  useMemo,
  useRef,
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
  /** Scale in hidden state. Default: 1.3. */
  scaleStart?: number;
  /** Stagger direction for characters. Default: "start". */
  staggerFrom?: StaggerFrom;
  /** Duration per character animation in seconds. Default: 0.35. */
  duration?: number;
  /** Seconds between each character's animation start. Default: 0.03. */
  staggerChildren?: number;
  /** Portion of element that must be visible to trigger. Default: 0.3. */
  viewportAmount?: number;
  onComplete?: () => void;
};

const MAX_BLUR = 20;
const EASE_OUT: Transition['ease'] = [0.215, 0.61, 0.355, 1];

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
  scaleStart = 1.3,
  staggerFrom = 'start',
  duration = 0.35,
  staggerChildren = 0.03,
  viewportAmount = 0.3,
  onComplete,
}: FocusRevealProps) => {
  const reduceMotion = useReducedMotion();
  const skipMotion = reduceMotion === true;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: viewportAmount });

  const safeBlur = Math.min(Math.max(blur, 0), MAX_BLUR);

  // Build per-character stagger delays
  const delays = useMemo(
    () => buildDelays(text.length, skipMotion ? 0 : staggerChildren, staggerFrom),
    [text.length, skipMotion, staggerChildren, staggerFrom],
  );

  // Build per-character transition objects
  const charTransitions = useMemo(
    () =>
      delays.map((d) => ({
        type: 'tween' as const,
        duration: skipMotion ? 0.15 : duration,
        delay: d,
        ease: EASE_OUT,
      })),
    [delays, duration, skipMotion],
  );

  const MotionTag = MOTION_TAGS[Tag];

  const rootStyle: CSSProperties = {
    margin: 0,
    display: 'block',
    width: '100%',
    ...(color ? { color } : null),
    ...(font ?? null),
  };

  // When not in view → hidden state. When in view → visible state.
  // useInView starts as false for off-screen elements, so initial render
  // gets animate="hidden" while initial="hidden" — but framer-motion
  // applies `initial` styles on first render before `animate`, ensuring
  // the hidden state is visible. When isInView becomes true, animate
  // switches to "visible" and the stagger animation triggers.
  const charHidden: Record<string, unknown> = skipMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: scaleStart, filter: `blur(${safeBlur}px)` };

  const charVisible: Record<string, unknown> = skipMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, filter: 'blur(0px)' };

  const chars = text.split('');

  return (
    <div ref={containerRef}>
      <MotionTag
        aria-label={text}
        className={className}
        style={rootStyle}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0 } },
        }}
        onAnimationComplete={onComplete}
      >
        {chars.map((char, index) => (
          <span
            key={`${index}-${char}`}
            className="inline-block whitespace-nowrap"
            aria-hidden="true"
          >
            <motion.span
              className="inline-block will-change-[transform,opacity,filter]"
              variants={{
                hidden: charHidden,
                visible: charVisible,
              }}
              transition={charTransitions[index] ?? { duration, ease: EASE_OUT }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        ))}
      </MotionTag>
    </div>
  );
};

FocusReveal.displayName = 'FocusReveal';

export default FocusReveal;
export type { FocusRevealProps, StaggerFrom };
