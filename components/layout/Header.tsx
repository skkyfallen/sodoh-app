"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const linkClass = (href: string) =>
    `relative inline-flex min-h-11 items-center text-sm font-semibold transition-colors focus-visible:rounded-md ${pathname === href ? "text-[var(--brand)]" : "text-[var(--body)] hover:text-[var(--brand)]"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--page)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16">
        <Link href="/" className="rounded-md leading-tight focus-visible:outline-offset-4" aria-label="Sodoh Nigeria home">
          <span className="display-font block text-xl font-semibold tracking-[-0.045em] text-[var(--ink)] sm:text-2xl">Sodoh</span>
          <span className="block text-xs text-[var(--muted)]">Nigeria Limited</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={linkClass(link.href)}>
              {link.label}
              {pathname === link.href && <span aria-hidden="true" className="absolute inset-x-0 bottom-1 h-0.5 rounded-full bg-[var(--brand)]" />}
            </Link>
          ))}
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(1,105,54,0.14)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--brand-hover)] active:translate-y-0 dark:text-[#062a17]">
            Contact us
          </Link>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <MdClose aria-hidden="true" className="text-xl" /> : <MdMenu aria-hidden="true" className="text-xl" />}
        </button>
      </div>

      <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!menuOpen} className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 md:hidden">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:px-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={`flex min-h-12 items-center rounded-lg px-3 text-base font-semibold ${pathname === link.href ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--body)] hover:bg-[var(--surface-soft)]"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#062a17]">
            Contact us
          </Link>
        </div>
      </nav>
    </header>
  );
}
