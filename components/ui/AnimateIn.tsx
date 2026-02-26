"use client";

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

type AnimVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "zoom";

interface AnimateInProps {
  children: ReactNode;
  variant?: AnimVariant;
  delay?: number;          // ms
  duration?: number;       // ms
  threshold?: number;
  className?: string;
  style?: CSSProperties;
}

const variants: Record<AnimVariant, { hidden: CSSProperties; visible: CSSProperties }> = {
  "fade-up": {
    hidden: { opacity: 0, transform: "translateY(40px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-down": {
    hidden: { opacity: 0, transform: "translateY(-40px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-left": {
    hidden: { opacity: 0, transform: "translateX(-40px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  "fade-right": {
    hidden: { opacity: 0, transform: "translateX(40px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  zoom: {
    hidden: { opacity: 0, transform: "scale(0.85)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
};

export default function AnimateIn({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = "",
  style = {},
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const { hidden, visible } = variants[variant];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...(inView ? visible : hidden),
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
