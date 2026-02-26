"use client";

import Link from "next/link";
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
} from "react-icons/md";

const navItems = [
  { href: "/admin/dashboard/overview",     label: "Overview",      Icon: MdDashboard },
  { href: "/admin/dashboard/content",      label: "Site Content",  Icon: MdArticle },
  { href: "/admin/dashboard/products",     label: "Products",      Icon: MdShoppingBag },
  { href: "/admin/dashboard/stats",        label: "Stats",         Icon: MdBarChart },
  { href: "/admin/dashboard/pillars",      label: "Pillars",       Icon: MdViewColumn },
  { href: "/admin/dashboard/faqs",         label: "FAQs",          Icon: MdQuestionAnswer },
  { href: "/admin/dashboard/testimonials", label: "Testimonials",  Icon: MdStar },
  { href: "/admin/dashboard/messages",     label: "Messages",      Icon: MdMail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
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
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[#016936]/10 text-[#016936]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="text-lg shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
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
