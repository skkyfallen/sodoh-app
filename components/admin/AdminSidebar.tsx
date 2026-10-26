"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import {
  MdDashboard, MdArticle, MdShoppingBag, MdMail, MdAssignment, MdBarChart,
  MdQuestionAnswer, MdStar, MdViewColumn, MdLogout, MdExpandMore,
  MdMenu, MdClose,
} from "react-icons/md";
import { cn } from "@/lib/utils";

const CONTENT_CHILDREN = [
  { href: "/admin/dashboard/content", label: "Page text", Icon: MdArticle },
  { href: "/admin/dashboard/products", label: "Products", Icon: MdShoppingBag },
  { href: "/admin/dashboard/stats", label: "Statistics", Icon: MdBarChart },
  { href: "/admin/dashboard/pillars", label: "Quality pillars", Icon: MdViewColumn },
  { href: "/admin/dashboard/faqs", label: "FAQs", Icon: MdQuestionAnswer },
  { href: "/admin/dashboard/testimonials", label: "Testimonials", Icon: MdStar },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isContentActive = CONTENT_CHILDREN.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const [contentOpen, setContentOpen] = useState(isContentActive);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    setSigningOut(true);
    setLogoutError(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/admin/login");
      router.refresh();
    } catch {
      setSigningOut(false);
      setLogoutError(true);
      return;
    }
  };

  const linkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return cn(
      "flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-white",
      active ? "bg-[var(--admin-active)] text-[#0b3b22]" : "text-white/80 hover:bg-white/10 hover:text-white"
    );
  };

  const nav = (
    <>
      <ul className="flex flex-col gap-1">
        <li>
          <Link href="/admin/dashboard/overview" onClick={() => setMobileOpen(false)} aria-current={pathname === "/admin/dashboard/overview" ? "page" : undefined} className={linkClass("/admin/dashboard/overview")}>
            <MdDashboard aria-hidden="true" className="shrink-0 text-lg" />Overview
          </Link>
        </li>
        <li>
          <button type="button" onClick={() => setContentOpen((open) => !open)} aria-expanded={contentOpen} className={cn("flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-white", isContentActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white")}>
            <MdArticle aria-hidden="true" className="shrink-0 text-lg" />
            <span className="flex-1">Site content</span>
            <MdExpandMore aria-hidden="true" className={cn("transition-transform duration-200", contentOpen && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {contentOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="ml-4 mt-1 flex flex-col gap-0.5 overflow-hidden border-l border-white/20 pl-3"
              >
                {CONTENT_CHILDREN.map(({ href, label, Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={href}>
                      <Link href={href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-white", active ? "bg-white/10 text-[#d7f6e7]" : "text-white/70 hover:bg-white/10 hover:text-white")}>
                        <Icon aria-hidden="true" className="shrink-0 text-base" />{label}
                      </Link>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
        <li>
          <Link href="/admin/dashboard/messages" onClick={() => setMobileOpen(false)} aria-current={pathname.startsWith("/admin/dashboard/messages") ? "page" : undefined} className={linkClass("/admin/dashboard/messages")}>
            <MdMail aria-hidden="true" className="shrink-0 text-lg" />Messages
          </Link>
        </li>
        <li>
          <Link href="/admin/dashboard/requests" onClick={() => setMobileOpen(false)} aria-current={pathname.startsWith("/admin/dashboard/requests") ? "page" : undefined} className={linkClass("/admin/dashboard/requests")}>
            <MdAssignment aria-hidden="true" className="shrink-0 text-lg" />Product requests
          </Link>
        </li>
      </ul>
      <div className="mt-8 border-t border-white/15 pt-4">
        <button type="button" onClick={handleLogout} disabled={signingOut} className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white disabled:cursor-wait disabled:opacity-60">
          <MdLogout aria-hidden="true" className="shrink-0 text-lg" />{signingOut ? "Signing out…" : "Sign out"}
        </button>
        <Link href="/" onClick={() => setMobileOpen(false)} className="mt-1 flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white">
          View public site
        </Link>
        {logoutError && <p role="alert" className="mt-3 px-3 text-sm leading-5 text-[#ffd0ca]">Could not sign out. Check your connection and try again.</p>}
      </div>
    </>
  );

  return (
    <>
      <div className="admin-sidebar sticky top-0 z-40 w-full bg-[#0c2418] px-5 py-3 text-white md:hidden">
        <div className="flex min-h-11 items-center justify-between">
          <Link href="/admin/dashboard/overview" className="rounded-md leading-tight focus-visible:outline-white">
            <span className="display-font block text-lg font-semibold tracking-[-0.035em]">Sodoh</span>
            <span className="text-xs text-white/70">Admin workspace</span>
          </Link>
          <button ref={mobileMenuButtonRef} type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="admin-mobile-navigation" aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"} className="flex size-11 items-center justify-center rounded-full border border-white/30 text-white focus-visible:outline-white">
            {mobileOpen ? <MdClose aria-hidden="true" className="text-xl" /> : <MdMenu aria-hidden="true" className="text-xl" />}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.nav
              id="admin-mobile-navigation"
              aria-label="Admin navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              onKeyDown={(event) => { if (event.key === "Escape") { setMobileOpen(false); mobileMenuButtonRef.current?.focus(); } }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-white/15 pt-4">{nav}</div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <aside className="admin-sidebar sticky top-0 hidden h-[100dvh] w-[264px] shrink-0 flex-col overflow-y-auto bg-[#0c2418] px-4 py-5 text-white md:flex">
        <Link href="/admin/dashboard/overview" className="rounded-md border-b border-white/15 px-2 pb-5 leading-tight focus-visible:outline-white">
          <span className="display-font block text-xl font-semibold tracking-[-0.035em]">Sodoh</span>
          <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">Admin workspace</span>
        </Link>
        <nav aria-label="Admin navigation" className="flex flex-1 flex-col py-5">{nav}</nav>
        <p className="px-3 pt-3 text-xs text-white/55">Sodoh Nigeria Limited</p>
      </aside>
    </>
  );
}
