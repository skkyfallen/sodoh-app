"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MdDashboard, MdArticle, MdShoppingBag, MdMail, MdAssignment, MdBarChart,
  MdQuestionAnswer, MdStar, MdViewColumn, MdLogout, MdExpandMore,
  MdExpandLess, MdMenu, MdClose,
} from "react-icons/md";

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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const linkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-white ${active ? "bg-[#0df20d] text-[#102b20]" : "text-white/75 hover:bg-white/10 hover:text-white"}`;
  };

  const nav = (
    <>
      <ul className="flex flex-col gap-1">
        <li><Link href="/admin/dashboard/overview" onClick={() => setMobileOpen(false)} className={linkClass("/admin/dashboard/overview")}><MdDashboard className="shrink-0 text-lg" />Overview</Link></li>
        <li>
          <button type="button" onClick={() => setContentOpen((open) => !open)} aria-expanded={contentOpen} className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-white ${isContentActive ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
            <MdArticle className="shrink-0 text-lg" /><span className="flex-1">Site content</span>{contentOpen ? <MdExpandLess aria-hidden="true" /> : <MdExpandMore aria-hidden="true" />}
          </button>
          {contentOpen && <ul className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/20 pl-3">{CONTENT_CHILDREN.map(({ href, label, Icon }) => <li key={href}><Link href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-white ${pathname === href || pathname.startsWith(`${href}/`) ? "text-[#c9f18c]" : "text-white/65 hover:text-white"}`}><Icon className="shrink-0 text-base" />{label}</Link></li>)}</ul>}
        </li>
        <li><Link href="/admin/dashboard/messages" onClick={() => setMobileOpen(false)} className={linkClass("/admin/dashboard/messages")}><MdMail className="shrink-0 text-lg" />Messages</Link></li>
        <li><Link href="/admin/dashboard/requests" onClick={() => setMobileOpen(false)} className={linkClass("/admin/dashboard/requests")}><MdAssignment className="shrink-0 text-lg" />Product requests</Link></li>
      </ul>
      <div className="mt-auto border-t border-white/15 pt-4">
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white"><MdLogout className="shrink-0 text-lg" />Sign out</button>
        <Link href="/" onClick={() => setMobileOpen(false)} className="mt-1 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white"><span aria-hidden="true">↗</span>Back to site</Link>
      </div>
    </>
  );

  return (
    <>
      <div className="relative z-40 w-full bg-[#102b20] px-5 py-3 text-white md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard/overview" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center bg-[#0df20d] text-[10px] font-black text-[#102b20]">SN</span>
            <span className="text-sm font-semibold">Sodoh <span className="font-normal text-white/60">/ Admin</span></span>
          </Link>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="admin-mobile-navigation" aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"} className="flex size-10 items-center justify-center border border-white/20 text-white focus-visible:outline-white">
            {mobileOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
          </button>
        </div>
        {mobileOpen && <nav id="admin-mobile-navigation" aria-label="Admin navigation" className="mt-4 border-t border-white/15 pt-4">{nav}</nav>}
      </div>

      <aside className="hidden w-[258px] shrink-0 flex-col bg-[#102b20] px-4 py-5 text-white md:flex">
        <Link href="/admin/dashboard/overview" className="flex items-center gap-3 border-b border-white/15 px-2 pb-6">
          <span className="flex size-10 items-center justify-center bg-[#0df20d] text-xs font-black text-[#102b20]">SN</span>
          <span className="leading-tight"><span className="block display-font text-lg font-semibold">Sodoh</span><span className="block text-[9px] font-bold uppercase tracking-[0.17em] text-white/55">Admin workspace</span></span>
        </Link>
        <nav aria-label="Admin navigation" className="flex flex-1 flex-col py-5">{nav}</nav>
        <p className="px-3 pt-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Sodoh Nigeria Limited</p>
      </aside>
    </>
  );
}
