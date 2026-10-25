"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className={`sticky top-0 z-50 border-b border-[#dfe5dc] transition-shadow duration-300 ${scrolled ? "bg-[#f8f8f2]/95 shadow-[0_8px_26px_rgba(23,36,29,0.06)] backdrop-blur-md" : "bg-[#f8f8f2]"}`}>
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16">
        <Link href="/" className="group flex items-center gap-3" aria-label="Sodoh Nigeria home">
          <span className="relative flex size-9 items-center justify-center bg-[#016936] text-[11px] font-bold tracking-tight text-white">
            SN<span aria-hidden="true" className="absolute -bottom-1 -right-1 size-2.5 bg-[#0df20d]" />
          </span>
          <span className="leading-tight">
            <span className="block display-font text-base font-semibold tracking-[-0.03em] text-[#17241d] sm:text-lg">Sodoh</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#607165]">Nigeria Limited</span>
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-sm font-semibold transition-colors ${active ? "text-[#016936]" : "text-[#49594e] hover:text-[#016936]"}`}
                >
                  {link.label}
                  {active && <span aria-hidden="true" className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#0df20d]" />}
                </Link>
              );
            })}
          </nav>
          <Link href="/contact" className="hidden min-h-11 items-center justify-center bg-[#016936] px-5 text-sm font-bold text-white transition-colors hover:bg-[#014e29] md:inline-flex">
            Talk to our team<span aria-hidden="true" className="ml-3 text-base">↗</span>
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center border border-[#d5ded5] text-[#17241d] md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#dfe5dc] bg-[#f8f8f2] px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:px-3">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`px-3 py-3 text-base font-semibold ${active ? "text-[#016936]" : "text-[#49594e]"}`}>{link.label}</Link>;
            })}
            <Link href="/contact" className="mt-2 flex min-h-12 items-center justify-center bg-[#016936] px-5 text-sm font-bold text-white">Talk to our team <span aria-hidden="true" className="ml-3">↗</span></Link>
          </div>
        </nav>
      )}
    </header>
  );
}
