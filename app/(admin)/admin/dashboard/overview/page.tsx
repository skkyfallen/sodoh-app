import {
  getContactSubmissionCounts,
  getProducts,
  getStats,
  getPillars,
  getFAQs,
  getTestimonials,
} from "@/lib/data";
import { MdShoppingBag, MdBarChart, MdMail, MdViewColumn, MdQuestionAnswer, MdStar } from "react-icons/md";

export default async function OverviewPage() {
  const [counts, products, stats, pillars, faqs, testimonials] = await Promise.all([
    getContactSubmissionCounts(),
    getProducts(),
    getStats(),
    getPillars(),
    getFAQs(),
    getTestimonials(),
  ]);

  const cards = [
    { label: "Products",        value: products.length,      Icon: MdShoppingBag,   color: "text-blue-600   bg-blue-50" },
    { label: "Stats",           value: stats.length,         Icon: MdBarChart,       color: "text-amber-600  bg-amber-50" },
    { label: "Pillars",         value: pillars.length,       Icon: MdViewColumn,     color: "text-purple-600 bg-purple-50" },
    { label: "FAQs",            value: faqs.length,          Icon: MdQuestionAnswer, color: "text-teal-600   bg-teal-50" },
    { label: "Testimonials",    value: testimonials.length,  Icon: MdStar,           color: "text-pink-600   bg-pink-50" },
    { label: "New Messages",    value: counts.new,           Icon: MdMail,           color: "text-green-600  bg-green-50" },
  ];

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
          >
            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
              <c.Icon className="text-2xl" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{c.value}</p>
              <p className="text-sm font-semibold text-slate-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent messages */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Message Summary</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-green-600">{counts.new}</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">New</p>
            </div>
            <div>
              <p className="text-3xl font-black text-blue-600">{counts.read}</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">Read</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-400">{counts.archived}</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">Archived</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
