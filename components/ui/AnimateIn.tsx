"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type AnimVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "zoom";

interface AnimateInProps {
  children: ReactNode;
  variant?: AnimVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
}

const variants: Record<AnimVariant, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  "fade-up": { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  "fade-down": { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  "fade-left": { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  "fade-right": { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  zoom: { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } },
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
  const prefersReducedMotion = useReducedMotion();
  const animation = variants[variant];

  return (
    <motion.div
      className={className}
      data-animate-in
      initial={prefersReducedMotion ? false : animation.hidden}
      whileInView={animation.visible}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration / 1000,
        delay: prefersReducedMotion ? 0 : delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
