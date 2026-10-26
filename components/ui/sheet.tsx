"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "right";
};

export function Sheet({ open, onClose, label, children, className, side = "top" }: SheetProps) {
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const initial = side === "right" ? { x: 48, opacity: 0 } : { y: -16, opacity: 0 };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-[#071a10]/45 md:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={cn(
              "fixed z-[70] bg-[var(--surface)] shadow-[0_24px_64px_rgba(0,0,0,0.25)] md:hidden",
              side === "right"
                ? "inset-y-0 right-0 w-[min(22rem,88vw)] overflow-y-auto border-l border-[var(--border)]"
                : "inset-x-0 top-0 max-h-[86dvh] overflow-y-auto rounded-b-3xl border-b border-[var(--border)]",
              className
            )}
            initial={reduceMotion ? false : initial}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { ...initial }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
