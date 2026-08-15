'use client';

// FocusReveal — Character-by-character blur + scale reveal animation.
// Uses framer-motion whileInView for viewport-triggered animation.
// The parent element detects viewport entry; children inherit
// the variant state change with per-character stagger delays.

import { motion, useReducedMotion } from 'framer-motion';
import {
  useMemo,
  Fragment,
  type CSSProperties,
  type ElementType,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StaggerFrom = 'start' | 'center' | 'end' | 'random';

type FocusRevealProps = {
  /** The text to animate character by character. */
  text?: string;
  /** Optional inline font overrides. Prefer Tailwind via `className`. */
  font?: CSSProperties;
  /** Optional inline color. Prefer Tailwind via `className`. */
  color?: string;
  /** Tailwind / CSS classes applied to the root heading element. */
  className?: string;
  /** HTML element to render. Default: "h2". */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** Blur amount (px) applied in the hidden state. Clamped 0–20. Default: 14. */
  blur?: number;
  /** Scale value in the hidden state. Default: START_SCALE (1.2). */
  scaleStart?: number;
  /** Direction of the stagger. Default: "start". */
  staggerFrom?: StaggerFrom;
  /** Per-character animation duration in seconds. Default: 0.35. */
  duration?: number;
  /** Seconds between each character's animation start. Default: 0.03. */
  staggerChildren?: number;
  /** Fraction of the element that must be visible to trigger (0–1). Default: 0.3. */
  viewportAmount?: number;
  /** Easing curve — a named string or a cubic-bezier array. Default: EASE_OUT. */
  ease?: string | number[];
  /** Callback fired once every character has finished animating. */
  onComplete?: () => void;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const START_SCALE = 1.2;
const MAX_BLUR = 20;
const EASE_OUT: number[] = [0.215, 0.61, 0.355, 1];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a named easing string or a raw cubic-bezier array into a value
 * that framer-motion's `ease` prop accepts.
 */
function resolveEase(ease?: string | number[]): number[] {
  if (Array.isArray(ease)) return ease;
  switch (ease) {
    case 'easeOut':
      return EASE_OUT;
    case 'easeInOut':
      return [0.42, 0, 0.58, 1];
    case 'easeIn':
      return [0.42, 0, 1, 1];
    default:
      return EASE_OUT;
  }
}

/**
 * Build an array of per-character stagger delays based on direction.
 */
function buildStaggerDelays(
  count: number,
  each: number,
  from: StaggerFrom,
): number[] {
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

  // 'start' — default, left-to-right
  return Array.from({ length: count }, (_, i) => i * each);
}

// ---------------------------------------------------------------------------
// Motion tag map
// ---------------------------------------------------------------------------

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const satisfies Record<string, ElementType>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const FocusReveal = ({
  text = '',
  font,
  color,
  className = '',
  as: Tag = 'h2',
  blur = 14,
  scaleStart = START_SCALE,
  staggerFrom = 'start',
  duration = 0.35,
  staggerChildren = 0.03,
  viewportAmount = 0.3,
  ease,
  onComplete,
}: FocusRevealProps) => {
  const reduceMotion = useReducedMotion();
  const skipMotion = reduceMotion === true;

  const safeBlur = Math.min(Math.max(blur, 0), MAX_BLUR);

  // Split text into words so each word can wrap as a unit on mobile.
  const words = useMemo(() => text.split(' '), [text]);

  // Pre-compute the global start index for each word (for delay lookup).
  const wordStartIndices = useMemo(() => {
    const indices: number[] = [];
    let idx = 0;
    for (const word of words) {
      indices.push(idx);
      idx += word.length;
    }
    return indices;
  }, [words]);

  // Total number of characters (excluding spaces).
  const totalChars = useMemo(
    () => words.reduce((sum, w) => sum + w.length, 0),
    [words],
  );

  // Per-character stagger delays.
  const delays = useMemo(
    () => buildStaggerDelays(totalChars, skipMotion ? 0 : staggerChildren, staggerFrom),
    [totalChars, skipMotion, staggerChildren, staggerFrom],
  );

  // Pre-resolve the easing value once (stable reference).
  const resolvedEase = useMemo(() => resolveEase(ease), [ease]);

  const MotionTag = MOTION_TAGS[Tag];

  // ---------------------------------------------------------------------------
  // Style applied to the root heading element.
  // ---------------------------------------------------------------------------
  const rootStyle: CSSProperties = {
    margin: 0,
    display: 'block',
    width: '100%',
    ...(color ? { color } : null),
    ...(font ?? null),
  };

  // ---------------------------------------------------------------------------
  // Variant objects shared by every character <motion.span>.
  // ---------------------------------------------------------------------------

  const hidden = skipMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: scaleStart, filter: `blur(${safeBlur}px)` };

  const visible = skipMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, filter: 'blur(0px)' };

  const characterVariants = { hidden, visible };

  // ---------------------------------------------------------------------------
  // Reduced motion — render immediately as plain, visible text.
  // ---------------------------------------------------------------------------
  if (skipMotion) {
    return (
      <MotionTag aria-label={text} className={className} style={rootStyle}>
        {text}
      </MotionTag>
    );
  }

  // ---------------------------------------------------------------------------
  // Container variants — the parent element whose whileInView trigger
  // propagates the "visible" label to every child that shares the same
  // variant labels.
  // ---------------------------------------------------------------------------
  const containerVariants = {
    hidden: {},
    visible: {},
  };

  // ---------------------------------------------------------------------------
  // Render — parent handles viewport detection, children inherit state.
  // ---------------------------------------------------------------------------
  return (
    <MotionTag
      aria-label={text}
      className={className}
      style={rootStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      variants={containerVariants}
      onAnimationComplete={onComplete}
    >
      {words.map((word, wordIndex) => (
        <Fragment key={`w-${wordIndex}`}>
          {/* Regular space between words (allows natural line wrapping). */}
          {wordIndex > 0 && (
            <span className="inline-block" aria-hidden="true">
              {'\u0020'}
            </span>
          )}

          {/* Word wrapper — keeps characters inside the same word together. */}
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {word.split('').map((char, charIndex) => {
              const globalIndex = wordStartIndices[wordIndex] + charIndex;

              return (
                <motion.span
                  key={`c-${wordIndex}-${charIndex}`}
                  className="inline-block will-change-[transform,opacity,filter]"
                  variants={characterVariants}
                  transition={{
                    type: 'tween',
                    duration: skipMotion ? 0.15 : duration,
                    delay: delays[globalIndex] ?? 0,
                    ease: resolvedEase,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        </Fragment>
      ))}
    </MotionTag>
  );
};

FocusReveal.displayName = 'FocusReveal';

export default FocusReveal;
export type { FocusRevealProps, StaggerFrom };
