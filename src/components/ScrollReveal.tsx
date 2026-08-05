'use client';

import React, { useEffect, useRef, ReactNode } from 'react';

type SRVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'flip-up'
  | 'flip-left'
  | 'flip-right'
  | 'zoom'
  | 'typewriter'
  | 'blur-glow';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: SRVariant;
  delay?: number; // ms
  threshold?: number; // 0–1
  className?: string;
  as?: React.ElementType;
}

/**
 * ScrollReveal — wraps children and animates them into view using IntersectionObserver.
 * Works with the CSS classes defined in globals.css (.sr-hidden, .sr-visible, .sr-<variant>).
 *
 * Usage:
 *   <ScrollReveal variant="fade-up" delay={100}>
 *     <YourCard />
 *   </ScrollReveal>
 */
export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  threshold = 0.12,
  className = '',
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial hidden state
    el.classList.add('sr-hidden', `sr-${variant}`);

    let timer: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            el.classList.remove('sr-hidden');
            el.classList.add('sr-visible');
          }, delay);
        } else {
          clearTimeout(timer);
          el.classList.remove('sr-visible');
          el.classList.add('sr-hidden');
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [variant, delay, threshold]);

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
