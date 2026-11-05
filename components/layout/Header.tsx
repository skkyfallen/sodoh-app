"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import type { SxProps, Theme } from "@mui/material/styles";
import HeaderMenu from "./HeaderMenu";
import { BrandMark } from "./BrandMark";
import NextLink from "@/components/mui/NextLink";
import SodohCtaButton from "@/components/sections/SodohCtaButton";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { sodohButtonBaseSx } from "@/components/sections/sodoh-mui";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
];

function Wordmark({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <NextLink
      href="/"
      aria-label="Sodoh Nigeria Limited"
      className="group flex min-h-[44px] items-center gap-3 rounded-md focus-visible:outline-offset-4"
    >
      <BrandMark
        size={62}
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
    </NextLink>
  );
}

const desktopNavSx = (active: boolean): SxProps<Theme> => ({
  ...sodohButtonBaseSx,
  minHeight: 44,
  paddingLeft: 1.75,
  paddingRight: 1.75,
  borderRadius: "10px",
  fontSize: "1.0625rem",
  backgroundColor: active ? "var(--brand)" : "transparent",
  color: active ? "#ffffff" : "var(--body)",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: active ? "var(--brand-hover)" : "var(--surface-soft)",
    color: active ? "#ffffff" : "var(--ink)",
    boxShadow: "none",
    transform: "none",
  },
});

const slimNavSx = (active: boolean): SxProps<Theme> => ({
  ...sodohButtonBaseSx,
  minHeight: 40,
  paddingLeft: 1.5,
  paddingRight: 1.5,
  borderRadius: "10px",
  fontSize: "0.875rem",
  backgroundColor: active ? "var(--brand)" : "transparent",
  color: active ? "#ffffff" : "var(--body)",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: active ? "var(--brand-hover)" : "var(--surface-soft)",
    color: active ? "#ffffff" : "var(--ink)",
    boxShadow: "none",
    transform: "none",
  },
});

const menuTriggerSx: SxProps<Theme> = {
  ...sodohButtonBaseSx,
  display: { xs: "inline-flex", md: "none" },
  minHeight: 48,
  border: "1px solid var(--border-strong)",
  color: "var(--ink)",
  fontSize: "0.9375rem",
  paddingLeft: 2,
  paddingRight: 2,
  "&:hover": { backgroundColor: "var(--surface-soft)" },
};

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

  // Scroll locking, focus trapping, Escape/backdrop handling and focus
  // restoration for the mobile menu are owned by the MUI Drawer in
  // HeaderMenu (Modal behaviour), so no extra listeners live here.

  const slimVisible = pastMasthead && !menuOpen;

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
              href="mailto:info@sodohnigerialtd.com"
              className="hidden font-medium text-white/85 transition-colors hover:text-white sm:block"
            >
              info@sodohnigerialtd.com
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
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Button
                  key={link.href}
                  component={NextLink}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  sx={desktopNavSx(active)}
                >
                  {link.label}
                </Button>
              );
            })}
            <span className="ml-3 inline-flex">
              <SodohCtaButton href="/contact" variant="dark">
                Contact us
              </SodohCtaButton>
            </span>
          </nav>
          <Button
            type="button"
            onClick={openMenu}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            startIcon={<MenuIcon aria-hidden="true" />}
            sx={menuTriggerSx}
          >
            Menu
          </Button>
        </div>
      </div>

      {/* Slim bar — appears only after scrolling past the masthead */}
      <AppBar
        position="fixed"
        elevation={0}
        aria-hidden={!slimVisible}
        sx={{
          zIndex: 40,
          backgroundColor: "color-mix(in srgb, var(--page) 95%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "none",
          color: "var(--ink)",
          transition:
            "opacity 300ms cubic-bezier(0.16,1,0.3,1), transform 300ms cubic-bezier(0.16,1,0.3,1), visibility 300ms",
          ...(slimVisible
            ? { opacity: 1, transform: "translateY(0)", visibility: "visible" }
            : {
                opacity: 0,
                transform: "translateY(-100%)",
                visibility: "hidden",
                pointerEvents: "none",
              }),
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            maxWidth: 1440,
            mx: "auto",
            minHeight: 64,
            height: 64,
            px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <NextLink
            href="/"
            aria-label="Sodoh Nigeria Limited"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-offset-4"
          >
            <BrandMark size={42} variant="tile" />
            <span className="display-font text-xl font-bold tracking-[-0.04em] text-[var(--ink)]">
              Sodoh
            </span>
          </NextLink>
          <div className="flex items-center gap-2">
            <nav aria-label="Quick navigation" className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Button
                    key={link.href}
                    component={NextLink}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    sx={slimNavSx(active)}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </nav>
            <SodohCtaButton href="/contact" variant="dark" size="sm">
              Contact us
            </SodohCtaButton>
            <IconButton
              type="button"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              sx={{
                width: 44,
                height: 44,
                display: { xs: "inline-flex", md: "none" },
                borderRadius: "12px",
                border: "1px solid var(--border)",
                color: "var(--ink)",
                transition:
                  "background-color 240ms cubic-bezier(0.16,1,0.3,1), border-color 240ms",
                "&:hover": { backgroundColor: "var(--surface-soft)" },
              }}
            >
              <MenuIcon aria-hidden="true" />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <HeaderMenu
        open={menuOpen}
        pathname={pathname}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
