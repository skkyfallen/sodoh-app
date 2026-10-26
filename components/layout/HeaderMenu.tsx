"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdClose } from "react-icons/md";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
];

function Wordmark({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <Link
      href="/"
      className="rounded-md leading-none focus-visible:outline-offset-4"
      aria-label="Sodoh Nigeria home"
    >
      <span
        className={cn(
          "display-font block text-[1.9rem] font-bold leading-none tracking-[-0.05em] sm:text-[2.4rem]",
          tone === "ink" ? "text-[var(--ink)]" : "text-white"
        )}
      >
        Sodoh
      </span>
      <span
        className={cn(
          "mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.28em]",
          tone === "ink" ? "text-[var(--muted)]" : "text-white/60"
        )}
      >
        Nigeria Limited
      </span>
    </Link>
  );
}

type HeaderMenuProps = {
  open: boolean;
  pathname: string;
  onClose: () => void;
};

export default function HeaderMenu({ open, pathname, onClose }: HeaderMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[80] flex flex-col bg-[#0c2418] text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mx-auto flex h-[76px] w-full max-w-[1440px] shrink-0 items-center justify-between px-5 sm:px-8">
            <Wordmark tone="paper" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="inline-flex min-h-12 items-center gap-2 rounded-[14px] border border-white/30 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MdClose aria-hidden="true" className="text-xl" />
              Close
            </button>
          </div>
          <nav
            aria-label="Menu"
            className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-center gap-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8"
          >
            {[...navLinks, { label: "Contact", href: "/contact" }].map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + index * 0.07,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={onClose}
                  className={cn(
                    "display-font group flex items-baseline gap-4 border-b border-white/10 py-4 text-[clamp(2.4rem,9vw,4rem)] font-semibold leading-none tracking-[-0.04em] transition-colors",
                    pathname === link.href ? "text-[#7be2a6]" : "text-white hover:text-[#7be2a6]"
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="text-2xl text-white/30 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#7be2a6]"
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="mx-auto w-full max-w-[1440px] shrink-0 px-5 pb-10 sm:px-8">
            <div className="flex flex-col gap-1 border-t border-white/10 pt-5 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
              <p>Abuja, Federal Capital Territory, Nigeria</p>
              <a
                href="mailto:info@sodohnigeria.com"
                className="font-semibold text-white/85 hover:text-white"
              >
                info@sodohnigeria.com
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
