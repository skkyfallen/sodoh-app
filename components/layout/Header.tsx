"use client";

import Link from "next/link";
import HeaderMenu from "./HeaderMenu";
import { BrandMark } from "./BrandMark";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdMenu } from "react-icons/md";
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
      aria-label="Sodoh Nigeria Limited"
      className="group flex items-center gap-3 rounded-md focus-visible:outline-offset-4"
    >
      <BrandMark
        size={46}
        variant="tile"
        priority
        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-[1.04]"
      />
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastMasthead, setPastMasthead] = useState(false);
  const pathname = usePathname();
  const pastMastheadRef = useRef(false);

  const openMenu = () => {
    setMenuOpen(true);
  };

  // Reset pattern: close the menu when the route changes, adjusted during
  // render instead of in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    let frame: number | null = null;
    const updatePastMasthead = () => {
      frame = null;
      const nextPastMasthead = window.scrollY > 420;
      if (pastMastheadRef.current === nextPastMasthead) return;

      pastMastheadRef.current = nextPastMasthead;
      setPastMasthead(nextPastMasthead);
    };
    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updatePastMasthead);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const desktopLink = (href: string) => {
    const active = pathname === href;
    return cn(
      "inline-flex min-h-11 items-center rounded-[10px] px-3.5 text-[17px] font-semibold transition-colors duration-200",
      active
        ? "bg-[var(--brand)] text-white dark:text-[#062a17]"
        : "text-[var(--body)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
    );
  };

  return (
    <>
      {/* Utility strip — market info, full bleed */}
      <div className="bg-[#0c2418] text-white">
        <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-4 px-5 text-[13px] sm:px-8 md:px-12 lg:px-16">
          <p className="hidden truncate text-white/70 md:block">
            Abuja, Federal Capital Territory, Nigeria
          </p>
          <p className="truncate text-white/70 md:hidden">Abuja, Nigeria</p>
          <div className="flex shrink-0 items-center gap-4">
            <a
              href="mailto:info@sodohnigeria.com"
              className="hidden font-medium text-white/85 transition-colors hover:text-white sm:block"
            >
              info@sodohnigeria.com
            </a>
            <span aria-hidden="true" className="hidden h-3 w-px bg-white/25 sm:block" />
            <p className="flex items-center gap-2 font-semibold text-[#7be2a6]">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7be2a6] opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#7be2a6]" />
              </span>
              Catalogue live · Enquiries open
            </p>
          </div>
        </div>
      </div>

      {/* Masthead — static, oversized, editorial */}
      <div className="border-b border-[var(--border)] bg-[var(--page)]">
        <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-5 py-6 sm:px-8 md:px-12 md:py-8 lg:px-16">
          <Wordmark />
          <nav aria-label="Main navigation" className="hidden items-center gap-1.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={desktopLink(link.href)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="pressable ml-3 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[#0c2418] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand)]"
            >
              Contact us
            </Link>
          </nav>
          <button
            type="button"
            onClick={openMenu}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="inline-flex min-h-12 items-center gap-2 rounded-[14px] border border-[var(--border-strong)] px-4 text-[15px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)] md:hidden"
          >
            <MdMenu aria-hidden="true" className="text-xl" />
            Menu
          </button>
        </div>
      </div>

      {/* Slim bar — appears only after scrolling past the masthead */}
      <div
        aria-hidden={!(pastMasthead && !menuOpen)}
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--page)]/95 backdrop-blur-md transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          pastMasthead && !menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 md:px-12 lg:px-16">
          <Link
            href="/"
            aria-label="Sodoh Nigeria Limited"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-offset-4"
          >
            <BrandMark size={34} variant="tile" />
            <span className="display-font text-xl font-bold tracking-[-0.04em] text-[var(--ink)]">
              Sodoh
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav aria-label="Quick navigation" className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-10 items-center rounded-[10px] px-3 text-sm font-semibold transition-colors",
                    pathname === link.href
                      ? "bg-[var(--brand)] text-white dark:text-[#062a17]"
                      : "text-[var(--body)] hover:bg-[var(--surface-soft)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[#0c2418] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand)]"
            >
              Contact us
            </Link>
            <button
              type="button"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="inline-flex size-11 items-center justify-center rounded-[12px] border border-[var(--border)] text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)] md:hidden"
            >
              <MdMenu aria-hidden="true" className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <HeaderMenu
        open={menuOpen}
        pathname={pathname}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
