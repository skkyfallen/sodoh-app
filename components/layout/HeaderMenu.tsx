"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { BrandMark } from "./BrandMark";
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
      className="flex items-center gap-3 rounded-md focus-visible:outline-offset-4"
      aria-label="Sodoh Nigeria Limited"
    >
      {tone === "paper" ? (
        <BrandMark size={34} variant="bare" />
      ) : (
        <BrandMark size={40} variant="tile" />
      )}
      <span className="leading-none">
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
  const [mounted, setMounted] = useState(open);
  const [previousOpen, setPreviousOpen] = useState(open);

  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (open) {
      setMounted(true);
    }
  }

  useEffect(() => {
    if (open || !mounted) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setMounted(false), reducedMotion ? 0 : 320);
    return () => window.clearTimeout(timeout);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
  }, [open]);

  if (!open && !mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={cn(
        "fixed inset-0 z-[80] flex flex-col bg-[#0c2418] text-white",
        open ? "site-menu-open" : "site-menu-closing"
      )}
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
          <div
            key={link.href}
            className="site-menu-link"
            style={{ animationDelay: `${0.1 + index * 0.07}s` }}
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
          </div>
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
    </div>
  );
}
