import type { Metadata } from "next";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard — Sodoh Nigeria",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto px-5 pb-10 pt-5 sm:px-8 md:px-10 md:pb-14 md:pt-7">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-9 flex items-center justify-between border-b border-[#dce4dc] pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#708076]">Sodoh <span className="mx-2 text-[#a2afa5]">/</span> Operations</p>
            <Link href="/" className="text-xs font-semibold text-[#526157] underline decoration-[#b7c4b8] underline-offset-4 transition-colors hover:text-[#016936]">View public site ↗</Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
