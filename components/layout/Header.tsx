"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MdLocalFlorist, MdMenu, MdClose } from 'react-icons/md';

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  // contact removed; 'Get in Touch' button handles contact navigation
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[#0df20d]/10 backdrop-blur-md"
      style={{
        backgroundColor: scrolled ? "rgba(245,248,245,0.97)" : "rgba(245,248,245,0.80)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        paddingTop: scrolled ? "12px" : "16px",
        paddingBottom: scrolled ? "12px" : "16px",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        transition: "background-color 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease, padding-bottom 0.3s ease",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 shrink-0"
        style={{ transition: "transform 0.3s ease", transform: scrolled ? "scale(0.95)" : "scale(1)" }}
      >
        <div className="size-8 bg-[#0df20d] rounded-lg flex items-center justify-center text-[#102210]">
          <MdLocalFlorist className="text-base" />
        </div>
        <h2 className="text-slate-900 text-xl font-black leading-tight tracking-tight">
          Sodoh{" "}
          <span className="text-[#0df20d]">Nigeria Limited</span>
        </h2>
      </Link>

      {/* Desktop nav */}
      <div className="flex flex-1 justify-end gap-8 items-center">
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                  isActive
                    ? "text-[#0df20d] border-[#0df20d]"
                    : "text-slate-700 border-transparent hover:text-[#0df20d] hover:border-[#0df20d]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden md:flex min-w-[140px] cursor-pointer items-center justify-center rounded-full h-10 px-5 bg-[#0df20d] text-[#102210] text-sm font-bold transition-transform hover:scale-105 active:scale-95"
        >
          Get in Touch
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <MdClose className="text-slate-800" /> : <MdMenu className="text-slate-800" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f5f8f5] border-b border-[#0df20d]/10 px-6 py-4 flex flex-col gap-4 md:hidden shadow-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-semibold transition-colors ${
                  isActive ? "text-[#0df20d]" : "text-slate-700 hover:text-[#0df20d]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center rounded-full h-10 px-5 bg-[#0df20d] text-[#102210] text-sm font-bold w-full"
          >
            Get in Touch
          </Link>
        </div>
      )}
    </header>
  );
}
