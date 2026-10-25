import Link from "next/link";
import { getProducts, getStats, getPillars, getFAQs, getTestimonials } from "@/lib/data";
import { getContactSubmissionCounts } from "@/lib/data-admin";
import { MdShoppingBag, MdBarChart, MdMail, MdViewColumn, MdQuestionAnswer, MdStar } from "react-icons/md";

export default async function OverviewPage() {
  const [counts, products, stats, pillars, faqs, testimonials] = await Promise.all([
    getContactSubmissionCounts(), getProducts(), getStats(), getPillars(), getFAQs(), getTestimonials(),
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
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#016936]">Workspace overview</p>
        <h1 className="mb-2 text-3xl font-semibold">A clear view of the work.</h1>
        <p className="max-w-xl text-sm leading-6 text-[#59685d]">Keep site content current and follow up on new enquiries from one place.</p>
      </div>

      <section aria-labelledby="inbox-heading" className="grid overflow-hidden bg-[#123d2a] text-white md:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col items-start justify-between gap-8 p-6 sm:p-8 md:p-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b5eb71]">Your inbox</p>
            <h2 id="inbox-heading" className="display-font mt-4 text-6xl font-medium tracking-[-0.05em] text-[#d6f28c]">{counts.new}</h2>
            <p className="mt-2 text-sm text-white/75">new message{counts.new === 1 ? "" : "s"} to review</p>
          </div>
          <Link href="/admin/dashboard/messages" className="inline-flex min-h-11 items-center bg-[#0df20d] px-5 text-xs font-bold text-[#102b20] transition-colors hover:bg-[#c8f6c8] focus-visible:outline-white">Open messages <span aria-hidden="true" className="ml-4 text-base">↗</span></Link>
        </div>
        <div className="grid grid-cols-3 border-t border-white/15 md:border-l md:border-t-0">
          {[
            { label: "Read", value: counts.read },
            { label: "Archived", value: counts.archived },
            { label: "All content", value: sections.reduce((sum, item) => sum + item.value, 0) },
          ].map((item) => <div key={item.label} className="border-r border-t border-white/15 p-4 first:border-l-0 sm:p-7 md:border-t-0"><p className="display-font text-2xl font-medium text-white sm:text-3xl">{item.value}</p><p className="mt-2 text-[10px] font-medium text-white/70 sm:text-xs">{item.label}</p></div>)}
        </div>
      </section>

      <section aria-labelledby="content-heading" className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#dce4dc] pb-4">
          <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#016936]">Site management</p><h2 id="content-heading" className="display-font text-2xl font-semibold tracking-tight text-[#17241d]">Published content</h2></div>
          <Link href="/admin/dashboard/content" className="text-xs font-bold text-[#016936] underline decoration-[#b4d29f] underline-offset-4 hover:text-[#014e29]">Edit page text ↗</Link>
        </div>
        <div className="divide-y divide-[#dce4dc] border-y border-[#dce4dc]">
          {sections.map(({ label, value, Icon, href }, i) => <Link key={label} href={href} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-4 transition-colors hover:bg-white/70 sm:grid-cols-[3rem_1fr_auto_auto] sm:gap-5"><span className="font-mono text-[10px] text-[#849187]">0{i + 1}</span><span className="flex items-center gap-3 text-sm font-semibold text-[#34463a]"><Icon aria-hidden="true" className="text-lg text-[#016936]" />{label}</span><span className="text-sm font-semibold text-[#17241d]">{value}</span><span aria-hidden="true" className="hidden text-sm text-[#016936] transition-transform group-hover:translate-x-1 sm:block">↗</span></Link>)}
        </div>
      </section>
    </div>
  );
}
