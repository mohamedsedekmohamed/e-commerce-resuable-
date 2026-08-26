'use client';

/**
 * RevealBox — drop-in replacement for AosBox / data-aos.
 * Uses IntersectionObserver + CSS transitions. Zero hydration issues.
 *
 * Supported animations: fade-up | fade-left | fade-right | zoom-in | fade-in
 *
 * Usage:
 *   <RevealBox animation="fade-up" delay={200} className="...">
 *     ...
 *   </RevealBox>
 */

import React, { CSSProperties } from 'react';
import { useReveal } from '@/hooks/useReveal';

type Animation = 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade-in';

interface RevealBoxProps extends React.HTMLAttributes<HTMLElement> {
  animation?: Animation;
  delay?: number;       // ms
  duration?: number;    // ms, default 600
  distance?: number;    // px offset for translate, default 28
  as?: React.ElementType;
  threshold?: number;
}

const hiddenTransform: Record<Animation, string> = {
  'fade-up':    'translateY(VAR)',
  'fade-left':  'translateX(VAR)',
  'fade-right': 'translateX(-VAR)',
  'zoom-in':    'scale(0.93)',
  'fade-in':    'none',
};

export default function RevealBox({
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  distance = 28,
  as: Tag = 'div',
  threshold = 0.1,
  className,
  style,
  children,
  ...rest
}: RevealBoxProps) {
  const { ref, visible } = useReveal<HTMLElement>({ threshold, once: true });

  const distancePx = `${distance}px`;
  const transform = hiddenTransform[animation].replace('VAR', distancePx);

  const hiddenStyle: CSSProperties = {
    opacity: 0,
    transform: transform !== 'none' ? transform : undefined,
    transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  const visibleStyle: CSSProperties = {
    opacity: 1,
    transform: 'none',
    transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    willChange: 'auto',
  };

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...(visible ? visibleStyle : hiddenStyle), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
