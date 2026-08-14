'use client';

import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimate, type Transition } from 'framer-motion';

/* ── helpers ─────────────────────────────────────────────── */

const getOffset = (percent: number): { x: string; y: string } => {
  const clamped = Math.max(0, Math.min(100, percent));
  const emptyRatio = 1 - clamped / 100;
  if (clamped === 0) return { x: '0%', y: 'calc(100% + 20px)' };
  return { x: '0%', y: `${emptyRatio * 100}%` };
};

const wavePath = (period: number, amp: number, invert = false): string => {
  const count = Math.round(400 / period);
  const q = period / 4;
  const a = invert ? amp : -amp;
  let d = 'M 0 15';
  for (let i = 0; i < count; i++) {
    const x0 = i * period;
    d += ` C ${x0 + q} ${15 + a}, ${x0 + period - q} ${15 - a}, ${x0 + period} 15`;
  }
  return `${d} V 40 H 0 Z`;
};

const BACK_PATH = wavePath(200, 9, true);
const FRONT_PATH = wavePath(100, 10);

const DEFAULT_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 800,
  damping: 60,
  mass: 1,
};

/* ── types ──────────────────────────────────────────────── */

export type SlideFillVariant = 'primary' | 'secondary';

type SlideFillButtonProps = {
  label: string;
  variant?: SlideFillVariant;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/* ── variant presets ─────────────────────────────────────── */

const PRESETS: Record<
  SlideFillVariant,
  {
    fill: string;
    textColor: string;
    waterColor: string;
    waterTextColor: string;
    iconColor: string;
    iconHoverColor: string;
  }
> = {
  primary: {
    fill: '#FF3900',
    textColor: '#FFFFFF',
    waterColor: '#FFFFFF',
    waterTextColor: '#030303',
    iconColor: '#FFFFFF',
    iconHoverColor: '#030303',
  },
  secondary: {
    fill: '#FFFFFF',
    textColor: '#030303',
    waterColor: '#FF3900',
    waterTextColor: '#FFFFFF',
    iconColor: '#030303',
    iconHoverColor: '#FFFFFF',
  },
};

/* ── component ──────────────────────────────────────────── */

export function SlideFillButton({
  label,
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  className,
  style,
}: SlideFillButtonProps) {
  const preset = PRESETS[variant];
  const {
    fill,
    textColor,
    waterColor,
    waterTextColor,
    iconColor,
    iconHoverColor,
  } = preset;

  const [scope, animate] = useAnimate();
  const waterRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const backRef = useRef<SVGSVGElement | null>(null);
  const frontRef = useRef<SVGSVGElement | null>(null);
  const loopsRef = useRef<unknown[]>([]);

  const hovered = useRef(false);
  const focused = useRef(false);
  const filled = useRef(false);
  const [box, setBox] = useState({ w: 0, h: 0 });

  /* ── track button size ── */
  useEffect(() => {
    const el = scope.current as HTMLElement | null;
    if (!el) return;
    const read = () =>
      setBox((prev) =>
        prev.w === el.clientWidth && prev.h === el.clientHeight
          ? prev
          : { w: el.clientWidth, h: el.clientHeight }
      );
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);

  /* ── continuous wave loop ── */
  useEffect(() => {
    const specs: Array<[SVGSVGElement | null, number, string[]]> = [
      [backRef.current, 0.81, ['0%', '-50%']],
      [frontRef.current, 0.6, ['-50%', '0%']],
    ];
    const controls = specs
      .map(([el, duration, keys]) =>
        el
          ? animate(el, { x: keys }, { duration, repeat: Infinity, ease: 'linear' })
          : null
      )
      .filter(Boolean);
    loopsRef.current = controls;
    return () => {
      controls.forEach((c: any) => c?.stop());
      loopsRef.current = [];
    };
  }, [animate]);

  const restOffset = getOffset(0);
  const fullOffset = getOffset(100);

  /* ── fill / drain ── */
  const resetToEmpty = useCallback(() => {
    filled.current = false;
    if (waterRef.current) {
      animate(waterRef.current, { x: restOffset.x, y: restOffset.y }, { duration: 0 });
    }
    if (labelRef.current) animate(labelRef.current, { color: textColor }, { duration: 0 });
    if (iconRef.current) animate(iconRef.current, { color: iconColor }, { duration: 0 });
  }, [animate, restOffset.x, restOffset.y, textColor, iconColor]);

  const runFill = useCallback(() => {
    if (waterRef.current) {
      animate(waterRef.current, { x: fullOffset.x, y: fullOffset.y }, DEFAULT_TRANSITION);
    }
    if (labelRef.current) animate(labelRef.current, { color: waterTextColor }, DEFAULT_TRANSITION);
    if (iconRef.current) animate(iconRef.current, { color: iconHoverColor }, DEFAULT_TRANSITION);
  }, [animate, fullOffset.x, fullOffset.y, waterTextColor, iconHoverColor]);

  const runDrain = useCallback(() => {
    if (waterRef.current) {
      animate(waterRef.current, { x: restOffset.x, y: restOffset.y }, DEFAULT_TRANSITION);
    }
    if (labelRef.current) animate(labelRef.current, { color: textColor }, DEFAULT_TRANSITION);
    if (iconRef.current) animate(iconRef.current, { color: iconColor }, DEFAULT_TRANSITION);
  }, [animate, restOffset.x, restOffset.y, textColor, iconColor]);

  /* sync fill state ─ */
  useEffect(() => {
    if (hovered.current || focused.current) runFill();
    else resetToEmpty();
  }, [resetToEmpty, runFill]);

  const sync = useCallback(() => {
    const want = hovered.current || focused.current;
    if (want === filled.current) return;
    filled.current = want;
    if (want) { runFill(); } else { runDrain(); }
  }, [runFill, runDrain]);

  const onPointerEnter = useCallback(() => {
    if (disabled) return;
    hovered.current = true;
    sync();
  }, [sync, disabled]);

  const onPointerLeave = useCallback(() => {
    hovered.current = false;
    sync();
  }, [sync]);

  const onFocus = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      if (disabled) return;
      let visible = true;
      try { visible = e.currentTarget.matches(':focus-visible'); } catch { /* fallback */ }
      if (!visible) return;
      focused.current = true;
      sync();
    },
    [sync, disabled]
  );

  const onBlur = useCallback(() => {
    focused.current = false;
    sync();
  }, [sync]);

  /* ── crest positioning ── */
  const CREST = 16;
  const AHEAD = 15;
  const crestFrame: React.CSSProperties = {
    top: -AHEAD,
    left: 0,
    right: 0,
    height: CREST,
  };

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '100%',
  };

  return (
    <motion.button
      ref={scope}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        minHeight: 56,
        padding: '0 28px',
        borderRadius: 9999,
        border: 'none',
        background: fill,
        color: textColor,
        fontFamily: 'inherit',
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: '1.5em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.35s ease, opacity 0.35s ease',
        ...style,
      }}
    >
      {/* ── Water fill layer ── */}
      <motion.div
        ref={waterRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: waterColor,
          pointerEvents: 'none',
          zIndex: 1,
          x: restOffset.x,
          y: restOffset.y,
        }}
      >
        {/* Wave crest container */}
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            overflow: 'visible',
            ...crestFrame,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 100%' }}>
            {/* Back wave (slower, subtle) */}
            <motion.svg
              ref={backRef}
              viewBox="0 0 400 30"
              preserveAspectRatio="none"
              style={{ ...layerStyle, opacity: 0.45 }}
            >
              <path d={BACK_PATH} fill={waterColor} />
            </motion.svg>

            {/* Front wave (faster, prominent) */}
            <motion.svg
              ref={frontRef}
              viewBox="0 0 400 30"
              preserveAspectRatio="none"
              style={layerStyle}
            >
              <path d={FRONT_PATH} fill={waterColor} />
            </motion.svg>

            {/* Solid fill below the wave edge */}
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% - 2px)',
                left: 0,
                right: 0,
                height: 26,
                background: waterColor,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Arrow icon ── */}
      <motion.span
        ref={iconRef}
        aria-hidden="true"
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 18,
          lineHeight: 1,
          color: iconColor,
          flex: 'none',
          pointerEvents: 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        →
      </motion.span>

      {/* ── Label text ── */}
      <motion.span
        ref={labelRef}
        style={{
          position: 'relative',
          zIndex: 2,
          color: textColor,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}
