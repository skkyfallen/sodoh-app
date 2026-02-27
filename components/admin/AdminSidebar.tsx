"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MdDashboard,
  MdArticle,
  MdShoppingBag,
  MdMail,
  MdBarChart,
  MdQuestionAnswer,
  MdStar,
  MdViewColumn,
  MdLogout,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

const CONTENT_CHILDREN = [
  { href: "/admin/dashboard/content",      label: "Page Text",    Icon: MdArticle },
  { href: "/admin/dashboard/products",     label: "Products",     Icon: MdShoppingBag },
  { href: "/admin/dashboard/stats",        label: "Stats",        Icon: MdBarChart },
  { href: "/admin/dashboard/pillars",      label: "Pillars",      Icon: MdViewColumn },
  { href: "/admin/dashboard/faqs",         label: "FAQs",         Icon: MdQuestionAnswer },
  { href: "/admin/dashboard/testimonials", label: "Testimonials", Icon: MdStar },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isContentActive = CONTENT_CHILDREN.some(
    (c) => pathname === c.href || pathname.startsWith(c.href + "/")
  );
  const [contentOpen, setContentOpen] = useState(isContentActive);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navLinkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      active
        ? "bg-[#016936]/10 text-[#016936]"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;
  };

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-100">
        <Link href="/admin/dashboard/overview" className="flex items-center gap-2">
          <span className="text-lg font-black text-[#016936]">Sodoh</span>
          <span className="text-lg font-black text-slate-900">Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="flex flex-col gap-1">

          {/* Overview */}
          <li>
            <Link href="/admin/dashboard/overview" className={navLinkClass("/admin/dashboard/overview")}>
              <MdDashboard className="text-lg shrink-0" />
              Overview
            </Link>
          </li>

          {/* Site Content — collapsible group */}
          <li>
            <button
              type="button"
              onClick={() => setContentOpen((o) => !o)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isContentActive
                  ? "bg-[#016936]/10 text-[#016936]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <MdArticle className="text-lg shrink-0" />
              <span className="flex-1 text-left">Site Content</span>
              {contentOpen ? (
                <MdExpandLess className="text-base shrink-0 opacity-60" />
              ) : (
                <MdExpandMore className="text-base shrink-0 opacity-60" />
              )}
            </button>

            {contentOpen && (
              <ul className="mt-1 ml-6 flex flex-col gap-0.5 border-l border-slate-100 pl-3">
                {CONTENT_CHILDREN.map(({ href, label, Icon }) => {
                  const active = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          active
                            ? "text-[#016936] bg-[#016936]/5"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="text-base shrink-0" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* Messages */}
          <li>
            <Link href="/admin/dashboard/messages" className={navLinkClass("/admin/dashboard/messages")}>
              <MdMail className="text-lg shrink-0" />
              Messages
            </Link>
          </li>

        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <MdLogout className="text-lg shrink-0" />
          Sign Out
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors mt-1"
        >
          ← Back to Site
        </Link>
      </div>
    </aside>
  );
}
