import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  MdEco,
  MdGrass,
  MdSpa,
  MdLocalCafe,
  MdOpacity,
  MdDinnerDining,
} from "react-icons/md";
import type { IconType } from "react-icons";
import { getPageContent, getProducts, getStats } from "@/lib/data";
import type { HeroContent } from "@/types/content";

const iconMap: Record<string, IconType> = {
  MdEco,
  MdGrass,
  MdSpa,
  MdLocalCafe,
  MdOpacity,
  MdDinnerDining,
};

export const metadata: Metadata = {
  title: "Our Products — Sodoh Nigeria Limited",
  description:
    "Explore Sodoh Nigeria Limited's premium agricultural produce — from cassava and maize to cocoa, ginger, palm oil, and yam sourced across Nigeria.",
  openGraph: {
    title: "Our Products — Sodoh Nigeria Limited",
    description:
      "Premium quality agricultural produce sourced sustainably from across Nigeria.",
    type: "website",
  },
};

export const runtime = "edge";
export const revalidate = 60;

export default async function ProductsPage() {
  const [content, products, stats] = await Promise.all([
    getPageContent("products"),
    getProducts(),
    getStats(),
  ]);

  const hero = (content.hero ?? {}) as HeroContent;
  if (!hero.title) hero.title = 'Our Premium Produce';
  const gridHeading = (content.grid_heading as Record<string, string>)?.heading ?? "Our Agricultural Products";
  const ctaBanner = (content.cta_banner ?? {}) as Record<string, string>;
  if (!ctaBanner.heading) ctaBanner.heading = "Ready to source quality produce?";
  if (!ctaBanner.cta_text) ctaBanner.cta_text = "Contact Us Now";
  if (!ctaBanner.cta_href) ctaBanner.cta_href = "/contact";

  /** Split title around highlight_word */
  const renderTitle = () => {
    const word = hero.highlight_word;
    if (!word || !hero.title?.includes(word)) return <>{hero.title}</>;
    const idx = hero.title.indexOf(word);
    const before = hero.title.slice(0, idx);
    const after = hero.title.slice(idx + word.length);
    return (
      <>
        {before}&quot;<span className="relative inline-block">
          <span className="relative z-10 text-white px-2">{word}</span>
          <span aria-hidden="true" className="absolute inset-0 bg-[#016936] rounded-md -skew-x-2" />
        </span>&quot; {after}
      </>
    );
  };
  return (
    <>
      {/* Hero — redesigned to mirror landing page style */}
      <section className="bg-white px-6 pt-20 pb-24 md:px-20 md:pt-28 md:pb-32">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Text column */}
          <div className="flex-1 flex flex-col items-start">
            {hero.badge && (
              <AnimateIn variant="fade-left" delay={80} duration={700}>
                <div className="border-l-4 border-[#016936] pl-3 mb-8">
                  <span className="text-[#016936] text-xs font-bold uppercase tracking-widest">
                    {hero.badge}
                  </span>
                </div>
              </AnimateIn>
            )}

            <AnimateIn variant="fade-left" delay={200} duration={700}>
              <h1 className="text-slate-900 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl max-w-[90vw] lg:max-w-none">
                {renderTitle()}
              </h1>
            </AnimateIn>

            {hero.subtitle && (
              <AnimateIn variant="fade-left" delay={360} duration={700}>
                <p className="text-slate-800 font-semibold text-base md:text-lg leading-relaxed max-w-[95vw] lg:max-w-[60vw] mt-7">
                  {hero.subtitle}
                </p>
              </AnimateIn>
            )}

            {hero.cta_primary_text && hero.cta_primary_href && (
              <AnimateIn variant="fade-left" delay={500} duration={700}>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <Link
                    href={hero.cta_primary_href}
                    className="flex items-center justify-center rounded-full h-12 px-8 bg-[#016936] text-white text-base font-bold transition-all hover:shadow-lg hover:shadow-[#016936]/30 hover:scale-[1.03]"
                  >
                    {hero.cta_primary_text}
                  </Link>
                </div>
              </AnimateIn>
            )}
          </div>

          {/* Stats column */}
          <div className="mt-16 lg:mt-0 grid grid-cols-1 gap-5 w-full lg:w-[340px] shrink-0">
            {stats.map((stat, i) => (
              <AnimateIn key={stat.label} variant="fade-left" delay={300 + i * 120} duration={650}>
                <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-3xl font-black text-[#016936] leading-none">{stat.value}</span>
                  <span className="text-slate-600 text-sm font-semibold leading-snug">{stat.label}</span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 md:px-20 py-16">
        <AnimateIn variant="fade-up" threshold={0.2}>
          <div className="mb-12">
            <h2 className="text-slate-900 text-3xl font-black tracking-tight md:text-4xl mb-4">
              {gridHeading}
            </h2>
            <div className="w-20 h-1 bg-[#0df20d] rounded-full" />
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const Icon = iconMap[product.icon ?? ""] ?? MdEco;
            return (
              <AnimateIn
                key={product.id}
                variant="fade-up"
                delay={i * 100}
                duration={600}
                threshold={0.1}
              >
                <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[#0df20d]/10 hover:border-[#0df20d]/40 transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                  {/* Icon */}
                  <div className="bg-[#0df20d]/10 text-[#0ac20a] size-12 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="text-2xl" />
                  </div>

                  {/* Product image */}
                  {product.image_url && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                      <Image
                        src={product.image_url}
                        alt={product.image_alt ?? product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Copy */}
                  <div className="flex flex-col flex-1 gap-2">
                    <div>
                      <h3 className="text-slate-900 text-xl font-bold leading-tight">
                        {product.title}
                      </h3>
                      {product.region && (
                        <p className="text-[#0ac20a] text-xs font-semibold mt-1">
                          {product.region}
                        </p>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-slate-600 text-sm leading-relaxed flex-1">
                        {product.description}
                      </p>
                    )}
                    <Link
                      href="/contact"
                      className="mt-2 w-full py-2 text-center rounded-xl bg-slate-100 hover:bg-[#0df20d] hover:text-[#102210] transition-colors font-bold text-sm"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-6 md:mx-20 mb-16 rounded-2xl bg-[#0df20d]/10 border border-[#0df20d]/20 py-16 px-8 md:px-16">
        <AnimateIn variant="fade-up" threshold={0.2}>
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="text-slate-900 text-3xl md:text-5xl font-black leading-tight">
              {ctaBanner.heading ?? "Ready to source quality produce?"}
            </h2>
            <p className="text-slate-700 text-base md:text-lg font-medium">
              {ctaBanner.subtitle ?? "Get in touch with us for bulk orders and international export inquiries."}
            </p>
            <Link
              href={ctaBanner.cta_href ?? "/contact"}
              className="flex items-center justify-center rounded-full h-14 px-10 bg-[#0df20d] text-[#102210] text-lg font-bold shadow-lg hover:shadow-[#0df20d]/30 transition-all hover:scale-105"
            >
              {ctaBanner.cta_text ?? "Contact Us Now"}
            </Link>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
