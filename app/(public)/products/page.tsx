import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import { getPageContent, getProducts, getStats } from "@/lib/data";
import type { HeroContent } from "@/types/content";
import ProductRequestButton from "@/components/products/ProductRequestButton";

export const metadata: Metadata = {
  title: "Our Products — Sodoh Nigeria Limited",
  description:
    "Explore Sodoh Nigeria Limited's premium agricultural produce — sourced sustainably from farming communities across Nigeria.",
  openGraph: {
    title: "Our Products — Sodoh Nigeria Limited",
    description: "Premium quality agricultural produce sourced sustainably from across Nigeria.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [content, products, stats] = await Promise.all([
    getPageContent("products"),
    getProducts(),
    getStats(),
  ]);

  const hero = (content.hero ?? {}) as HeroContent;
  if (!hero.title) hero.title = "Our Premium Produce";
  const gridHeading = (content.grid_heading as Record<string, string>)?.heading ?? "Harvested with care. Ready for the world.";
  const ctaBanner = (content.cta_banner ?? {}) as Record<string, string>;
  if (!ctaBanner.heading) ctaBanner.heading = "Looking for a reliable supply?";
  if (!ctaBanner.cta_text) ctaBanner.cta_text = "Start a conversation";
  if (!ctaBanner.cta_href) ctaBanner.cta_href = "/contact";

  const renderTitle = () => {
    const word = hero.highlight_word;
    if (!word || !hero.title.includes(word)) return <>{hero.title}</>;
    const idx = hero.title.indexOf(word);
    return <>{hero.title.slice(0, idx)}<span className="text-[#016936]">{word}</span>{hero.title.slice(idx + word.length)}</>;
  };

  const cardLayouts = [
    "lg:col-span-7",
    "lg:col-span-5 lg:mt-20",
    "lg:col-span-5",
    "lg:col-span-7 lg:-mt-8",
  ];

  return (
    <>
      <section className="bg-[#f7f7ef] px-5 pb-14 pt-12 sm:px-8 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <AnimateIn variant="fade-up" className="py-4 lg:py-10">
            {hero.badge && <p className="mb-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]"><span className="h-px w-9 bg-[#016936]" />{hero.badge}</p>}
            <h1 className="display-font max-w-[11ch] text-[clamp(2.9rem,6vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#17241d]">{renderTitle()}</h1>
            {hero.subtitle && <p className="mt-7 max-w-lg text-base leading-7 text-[#4b5c50] md:text-lg md:leading-8">{hero.subtitle}</p>}
            {hero.cta_primary_text && hero.cta_primary_href && <Link href={hero.cta_primary_href} className="mt-9 inline-flex min-h-12 items-center bg-[#016936] px-6 text-sm font-bold text-white transition-colors hover:bg-[#014e29]">{hero.cta_primary_text}<span aria-hidden="true" className="ml-5 text-lg">↗</span></Link>}
          </AnimateIn>
          <AnimateIn variant="fade" delay={100} duration={700}>
            <figure className="relative min-h-[360px] overflow-hidden rounded-bl-[8rem] rounded-tr-[8rem] bg-[#d2ddcb] sm:min-h-[490px] lg:min-h-[600px]">
              <Image src="/images/produce-fields.jpg" alt="Fresh vegetables prepared for market" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102210]/65 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 p-6 text-sm font-medium text-white sm:p-8">Sourced in Nigeria, prepared for your market.</figcaption>
            </figure>
          </AnimateIn>
        </div>
        {stats.length > 0 && <div className="mx-auto mt-12 grid max-w-[1440px] grid-cols-2 gap-y-5 border-t border-[#d9dfd7] pt-6 sm:grid-cols-3 sm:gap-8">{stats.slice(0, 3).map((stat) => <div key={stat.label} className="flex items-baseline gap-3"><span className="display-font text-2xl font-semibold text-[#016936]">{stat.value}</span><span className="text-xs leading-5 text-[#526157]">{stat.label}</span></div>)}</div>}
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12 grid gap-5 border-b border-[#d9e1da] pb-8 md:grid-cols-[1fr_0.6fr] md:items-end">
            <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">Our catalogue</p><h2 className="display-font max-w-[17ch] text-3xl font-medium leading-tight tracking-[-0.04em] text-[#17241d] md:text-5xl">{gridHeading}</h2></div>
            <p className="max-w-sm text-sm leading-6 text-[#59685d]">Talk to our team about availability, quality specifications, and volumes for your market.</p>
          </div>

          {products.length === 0 ? (
            <div className="border-y border-[#d9e1da] py-14 text-center text-sm text-[#59685d]">Our product catalogue is being updated. Please check back soon.</div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12 lg:gap-y-16">
              {products.map((product, i) => (
                <AnimateIn key={product.id} variant="fade-up" delay={Math.min(i, 5) * 55} duration={500} className={cardLayouts[i % cardLayouts.length]}>
                  <article className="group h-full">
                    {product.image_url ? (
                      <div className={`relative w-full overflow-hidden bg-[#e8ece4] ${i % 4 === 0 ? "aspect-[1.25/1]" : "aspect-[1.55/1]"}`}>
                        <Image src={product.image_url} alt={product.image_alt ?? product.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                      </div>
                    ) : (
                      <div className={`flex w-full items-end bg-[#e8ece4] p-5 ${i % 4 === 0 ? "aspect-[1.25/1]" : "aspect-[1.55/1]"}`}>
                        <p className="border-l-2 border-[#016936] pl-3 text-xs font-semibold leading-5 text-[#526157]">Product photography coming soon</p>
                      </div>
                    )}
                    <div className="flex flex-col border-b border-[#d9e1da] pb-5 pt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div className="max-w-xl">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="display-font text-2xl font-semibold tracking-[-0.03em] text-[#17241d]">{product.title}</h3>
                          {product.region && <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#016936]">{product.region}</span>}
                        </div>
                        {product.description && <p className="mt-2 max-w-xl text-sm leading-6 text-[#59685d]">{product.description}</p>}
                      </div>
                      <div className="mt-5 w-full shrink-0 sm:mt-0 sm:w-40"><ProductRequestButton product={product} /></div>
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#123d2a] px-5 py-16 text-white sm:px-8 md:px-12 md:py-20 lg:px-16">
        <AnimateIn variant="fade-up"><div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b5eb71]">Bulk orders & export enquiries</p><h2 className="display-font max-w-[14ch] text-3xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">{ctaBanner.heading}</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/70 md:text-base">{ctaBanner.subtitle ?? "Tell us what you need. We’ll help you find the right product and supply plan."}</p></div><Link href={ctaBanner.cta_href} className="inline-flex min-h-12 shrink-0 items-center bg-[#0df20d] px-6 text-sm font-bold text-[#102210] transition-colors hover:bg-[#c8f6c8] focus-visible:outline-white">{ctaBanner.cta_text}<span aria-hidden="true" className="ml-5 text-lg">↗</span></Link></div></AnimateIn>
      </section>
    </>
  );
}
