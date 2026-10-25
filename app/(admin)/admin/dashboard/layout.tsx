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
    <div className="admin-shell flex min-h-[100dvh] flex-col md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 pb-10 pt-5 sm:px-8 md:px-10 md:pb-14 md:pt-7">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex min-h-11 items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4">
            <p className="text-sm font-medium text-[var(--admin-muted)]">Content and enquiries</p>
            <Link href="/" className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-[var(--admin-ink)] underline decoration-[var(--admin-border)] underline-offset-4 transition-colors hover:text-[#016936]">View public site</Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
