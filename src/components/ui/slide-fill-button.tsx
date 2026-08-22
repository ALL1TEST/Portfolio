'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import Link from 'next/link';

/* -- helpers ------------------------------------------------ */

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

/* -- types -------------------------------------------------- */

export type SlideFillVariant = 'primary' | 'secondary';

type SlideFillButtonProps = {
  label: string;
  href?: string;
  ariaLabel?: string;
  variant?: SlideFillVariant;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/* -- variant presets ---------------------------------------- */

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

/* -- component ---------------------------------------------- */

export function SlideFillButton({
  label,
  href,
  ariaLabel,
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

  const [isHovered, setIsHovered] = useState(false);

  const restOffset = getOffset(0);
  const fullOffset = getOffset(100);

  const onPointerEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const onPointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const onFocus = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const onBlur = useCallback(() => {
    setIsHovered(false);
  }, []);

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

  const commonStyle: React.CSSProperties = {
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
    color: isHovered ? waterTextColor : textColor,
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: '1.5em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform 0.35s ease, opacity 0.35s ease, color 0.35s ease',
    ...style,
  };

  const content = (
    <>
      {/* Water fill layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: waterColor,
          pointerEvents: 'none',
          zIndex: 1,
          transform: isHovered ? `translate3d(${fullOffset.x}, ${fullOffset.y}, 0)` : `translate3d(${restOffset.x}, ${restOffset.y}, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
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
            {/* Back wave */}
            <svg
              viewBox="0 0 400 30"
              preserveAspectRatio="none"
              className="animate-wave-back"
              style={{ ...layerStyle, opacity: 0.45 }}
            >
              <path d={BACK_PATH} fill={waterColor} />
            </svg>

            {/* Front wave */}
            <svg
              viewBox="0 0 400 30"
              preserveAspectRatio="none"
              className="animate-wave-front"
              style={layerStyle}
            >
              <path d={FRONT_PATH} fill={waterColor} />
            </svg>

            {/* Solid fill below wave edge */}
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
      </div>

      {/* Arrow icon */}
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 18,
          lineHeight: 1,
          color: isHovered ? iconHoverColor : iconColor,
          flex: 'none',
          pointerEvents: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          transition: 'color 0.35s ease',
        }}
      >
        →
      </span>

      {/* Label text */}
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          color: isHovered ? waterTextColor : textColor,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          transition: 'color 0.35s ease',
        }}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel || label}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
        style={commonStyle}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel || label}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
      style={commonStyle}
    >
      {content}
    </button>
  );
}
