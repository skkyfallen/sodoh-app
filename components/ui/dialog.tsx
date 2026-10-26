"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MdClose } from "react-icons/md";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: React.ReactNode;
  className?: string;
  dismissible?: boolean;
};

export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
  className,
  dismissible = true,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("input:not([disabled]), textarea:not([disabled]), button:not([disabled]), select:not([disabled])")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, dismissible]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#071a10]/65 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && dismissible) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            className={cn(
              "max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-t-[20px] bg-[var(--page)] shadow-[0_24px_72px_rgba(0,0,0,0.3)] sm:max-h-[90vh] sm:rounded-[20px]",
              className
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.985, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(4px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({
  titleId,
  title,
  description,
  onClose,
  closeLabel,
  tone = "dark",
}: {
  titleId: string;
  title: string;
  description?: string;
  onClose: () => void;
  closeLabel: string;
  tone?: "dark" | "plain";
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-6 px-5 py-6 sm:px-8 sm:py-7",
        tone === "dark" ? "rounded-t-[20px] bg-[#0d2b1c] text-white sm:rounded-t-[20px]" : "border-b border-[var(--border)]"
      )}
    >
      <div>
        <h2
          id={titleId}
          className="display-font max-w-[18ch] text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl"
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-2 text-sm leading-6", tone === "dark" ? "text-white/85" : "text-[var(--body)]")}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full text-xl transition-colors",
          tone === "dark"
            ? "border border-white/40 text-white hover:bg-white/10"
            : "border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-soft)]"
        )}
      >
        <MdClose aria-hidden="true" />
      </button>
    </div>
  );
}
