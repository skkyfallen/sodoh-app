import Link from "next/link";
import {
  getAdminFAQs,
  getAdminPillars,
  getAdminProducts,
  getAdminStats,
  getAdminTestimonials,
  getContactSubmissionCounts,
} from "@/lib/data-admin";
import { MdShoppingBag, MdBarChart, MdViewColumn, MdQuestionAnswer, MdStar } from "react-icons/md";

export default async function OverviewPage() {
  const [counts, products, stats, pillars, faqs, testimonials] = await Promise.all([
    getContactSubmissionCounts(), getAdminProducts(), getAdminStats(), getAdminPillars(), getAdminFAQs(), getAdminTestimonials(),
  ]);

  const sections = [
    { label: "Products", value: products.length, Icon: MdShoppingBag, href: "/admin/dashboard/products" },
    { label: "Statistics", value: stats.length, Icon: MdBarChart, href: "/admin/dashboard/stats" },
    { label: "Quality pillars", value: pillars.length, Icon: MdViewColumn, href: "/admin/dashboard/pillars" },
    { label: "FAQs", value: faqs.length, Icon: MdQuestionAnswer, href: "/admin/dashboard/faqs" },
    { label: "Testimonials", value: testimonials.length, Icon: MdStar, href: "/admin/dashboard/testimonials" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="mb-2">Your workspace at a glance</h1>
        <p className="max-w-[64ch] text-sm leading-6 text-[var(--admin-muted)]">Review new messages and keep the public site content current.</p>
      </header>

      <section aria-labelledby="inbox-heading" className="overflow-hidden rounded-2xl bg-[#102b20] text-white">
        <div className="grid md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start justify-between gap-7 p-6 sm:p-8 md:p-10">
            <div>
              <h2 id="inbox-heading" className="display-font text-2xl font-semibold tracking-[-0.03em] text-white">Messages to review</h2>
              <p className="display-font mt-4 text-6xl font-semibold tracking-[-0.05em] text-white">{counts.new}</p>
              <p className="mt-1 text-sm text-white/85">new message{counts.new === 1 ? "" : "s"}</p>
            </div>
            <Link href="/admin/dashboard/messages" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d7f6e7] px-5 text-sm font-semibold text-[#064e3b] transition-colors hover:bg-white focus-visible:outline-white">Open messages</Link>
          </div>
          <dl className="grid grid-cols-3 border-t border-white/20 md:border-l md:border-t-0">
            {[
              { label: "Read", value: counts.read },
              { label: "Archived", value: counts.archived },
              { label: "Content items", value: sections.reduce((sum, item) => sum + item.value, 0) },
            ].map((item) => (
              <div key={item.label} className="border-r border-white/20 p-4 last:border-r-0 sm:p-7">
                <dt className="mt-2 text-xs text-white/80 sm:text-sm">{item.label}</dt>
                <dd className="display-font mt-1 text-2xl font-semibold text-white sm:text-3xl">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="content-heading" className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4">
          <h2 id="content-heading" className="display-font text-2xl font-semibold tracking-[-0.03em]">Published content</h2>
          <Link href="/admin/dashboard/content" className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-[#016936] underline decoration-[var(--admin-border)] underline-offset-4 hover:text-[#014e29]">Edit page text</Link>
        </div>
        <div className="divide-y divide-[var(--admin-border)] border-y border-[var(--admin-border)]">
          {sections.map(({ label, value, Icon, href }) => (
            <Link key={label} href={href} className="grid min-h-14 grid-cols-[2rem_1fr_auto] items-center gap-3 px-2 py-3 transition-colors hover:bg-[var(--admin-surface)] sm:grid-cols-[2.5rem_1fr_auto] sm:gap-4 sm:px-3">
              <Icon aria-hidden="true" className="text-lg text-[#016936]" />
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-sm font-semibold tabular-nums text-[var(--admin-muted)]">{value}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
