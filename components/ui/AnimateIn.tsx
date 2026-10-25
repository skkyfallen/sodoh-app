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

/**
 * Kept as a Server Component wrapper for existing section composition.
 * Sections stay visible by default; the single authored entrance lives on the hero image.
 */
export default function AnimateIn({ children, className = "", style }: AnimateInProps) {
  return (
    <div className={className} style={style} data-animate-in>
      {children}
    </div>
  );
}
