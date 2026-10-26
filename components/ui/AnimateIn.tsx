"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

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

const hiddenTransforms: Record<AnimVariant, string> = {
  "fade-up": "translate3d(0, 26px, 0)",
  "fade-down": "translate3d(0, -26px, 0)",
  "fade-left": "translate3d(30px, 0, 0)",
  "fade-right": "translate3d(-30px, 0, 0)",
  fade: "none",
  zoom: "scale(0.96)",
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Progressive-enhancement scroll reveal.
 *
 * Server output and the first paint always render content in place and fully
 * visible — never `opacity: 0` — so the page is complete with no JavaScript,
 * before hydration, and in browsers where IntersectionObserver never fires
 * (background tabs, old WebViews, aggressive data-savers).
 *
 * After mount, elements that are still well below the fold are briefly armed
 * hidden (off-screen, so nothing flashes) and eased in with a CSS
 * transform/opacity transition when they enter the viewport. A timed fallback
 * guarantees they reveal even if the observer never fires. Reduced-motion
 * preferences always render in place with no animation.
 */
export default function AnimateIn({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.7,
  threshold = 0.12,
  className = "",
  style,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > -40) return;
    setArmed(true);

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setShown(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);

    let frame = 0;
    const checkInView = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94 && r.bottom > -40) {
        reveal();
        teardown();
      }
    };
    const scheduleCheck = () => {
      if (!frame) frame = window.requestAnimationFrame(checkInView);
    };

    const fallback = window.setTimeout(() => {
      reveal();
      teardown();
    }, 2500);

    const teardown = () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("touchmove", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      if (frame) window.cancelAnimationFrame(frame);
    };

    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("touchmove", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);
    return teardown;
  }, [threshold]);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={
        {
          ...style,
          opacity: hidden ? 0 : 1,
          transform: hidden ? hiddenTransforms[variant] : "none",
          willChange: hidden ? ("opacity, transform" as const) : undefined,
          transitionProperty: armed ? "opacity, transform" : undefined,
          transitionDuration: armed ? `${duration}s` : undefined,
          transitionDelay: armed ? `${delay}s` : undefined,
          transitionTimingFunction: armed ? EASE : undefined,
        } as CSSProperties
      }
      data-animate-in
      data-revealed={hidden ? "false" : "true"}
    >
      {children}
    </div>
  );
}
