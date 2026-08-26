'use client';

/**
 * AosBox — renders a div with data-aos attributes only after client hydration.
 * Prevents SSR/client mismatch (React hydration error) caused by AOS injecting
 * classes like "aos-init aos-animate" on the client that weren't in the server HTML.
 *
 * Usage:
 *   <AosBox animation="fade-up" delay={200} className="...">
 *     ...children...
 *   </AosBox>
 */

import React, { useEffect, useState } from 'react';

interface AosBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: React.ElementType;
}

export default function AosBox({
  animation = 'fade-up',
  delay,
  duration,
  once,
  as: Tag = 'div',
  children,
  ...rest
}: AosBoxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aosProps = mounted
    ? {
        'data-aos': animation,
        ...(delay !== undefined && { 'data-aos-delay': String(delay) }),
        ...(duration !== undefined && { 'data-aos-duration': String(duration) }),
        ...(once !== undefined && { 'data-aos-once': String(once) }),
      }
    : {};

  return (
    <Tag {...rest} {...aosProps}>
      {children}
    </Tag>
  );
}
