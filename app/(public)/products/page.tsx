import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import { SiteCta } from "@/components/sections/SiteCta";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductLedger } from "@/components/products/ProductLedger";
import { getPageContent, getProducts, getStats, getTestimonials } from "@/lib/data";
import { safeHref } from "@/lib/utils";
import type { HeroContent } from "@/types/content";
import { ogImagePath, ogLocale, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Nigerian Agricultural Products for Export | Sodoh Nigeria" },
  description: "Explore Nigerian agricultural products listed by Sodoh Nigeria Limited and contact our team about product availability, specifications, and supply requirements.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Nigerian Agricultural Products for Export | Sodoh Nigeria",
    description: "Explore Nigerian agricultural products listed by Sodoh Nigeria Limited and contact our team about product availability, specifications, and supply requirements.",
    url: "/products",
    siteName,
    images: [{ url: ogImagePath, width: 256, height: 161, alt: "Sodoh Nigeria Limited" }],
    locale: ogLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nigerian Agricultural Products for Export | Sodoh Nigeria",
    description: "Explore Nigerian agricultural products listed by Sodoh Nigeria Limited and contact our team about product availability, specifications, and supply requirements.",
    images: [ogImagePath],
  },
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [content, products, stats, testimonials] = await Promise.all([
    getPageContent("products"),
    getProducts(),
    getStats(),
    getTestimonials(),
  ]);
  const publicProducts = products.filter((product) => product.public_reviewed);
  const publicStats = stats.filter((stat) => stat.public_reviewed);
  const approvedTestimonial = testimonials.find((testimonial) => testimonial.public_reviewed);

  const storedHero = (content.hero ?? {}) as HeroContent & { public_reviewed?: boolean };
  const safeHero: HeroContent = {
    title: "Products from Nigeria",
    subtitle: "Browse the current catalogue and send an enquiry to discuss product availability and supply requirements.",
    cta_primary_text: "Contact us",
    cta_primary_href: "/contact",
  };
  const hero = storedHero.public_reviewed
    ? { ...safeHero, ...storedHero, title: storedHero.title || safeHero.title }
    : safeHero;
  const gridHeading = (content.grid_heading as Record<string, string> | undefined)?.heading ?? "Current catalogue";
  const storedCta = (content.cta_banner ?? {}) as Record<string, unknown> & { public_reviewed?: boolean };
  const ctaBanner = storedCta.public_reviewed ? storedCta as Record<string, string> : {};
  const ctaHeading = ctaBanner.heading ?? "Looking for something specific?";
  const ctaText = ctaBanner.cta_text ?? "Contact us";
  const ctaHref = safeHref(ctaBanner.cta_href, "/contact");

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden bg-[#071a10] px-5 pb-14 pt-12 sm:px-8 md:px-12 md:pb-20 md:pt-16 lg:px-16">
        <div aria-hidden="true" className="hero-bg absolute inset-0">
          <Image src="/images/produce-fields.jpg" alt="Fresh produce arranged for market" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[#071a10]/80" />
        <div className="relative mx-auto max-w-[1440px]">
          <div className="hero-copy">
            <h1 className="display-font max-w-[18ch] text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white [text-wrap:balance]">{hero.title}</h1>
            <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              {hero.subtitle && <p className="measure text-base leading-7 text-white/90 md:text-lg md:leading-8">{hero.subtitle}</p>}
              {hero.cta_primary_text && hero.cta_primary_href && <Link href={safeHref(hero.cta_primary_href, "/contact")} className="pressable inline-flex min-h-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--brand)] px-7 text-[15px] font-semibold text-white hover:bg-[var(--brand-hover)] dark:text-[#062a17]">{hero.cta_primary_text} <span aria-hidden="true" className="ml-2">→</span></Link>}
            </div>
          </div>
          <figcaption className="mt-7 inline-flex max-w-xs rounded-full bg-[#071a10]/70 px-4 py-2 text-[13px] font-medium leading-5 text-white backdrop-blur-sm">Representative agricultural photography</figcaption>
        </div>
      </section>

      <section id="catalogue" className="scroll-mt-24 bg-[var(--surface)] px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <AnimateIn className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-font max-w-[16ch] text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.0] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">{gridHeading}</h2>
          </AnimateIn>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
            <div className="min-w-0">
              {publicProducts.length === 0 ? (
                <EmptyState
                  title="The catalogue is being updated"
                  body="Contact our team to discuss what you are looking for."
                  action={
                    <Link href="/contact" className="pressable inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[var(--brand)] px-6 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] dark:text-[#062a17]">Contact us</Link>
                  }
                />
              ) : (
                <ProductLedger products={publicProducts} showRequest compact />
              )}
            </div>

            <aside aria-label="Product enquiries" className="rounded-[18px] border border-[#17452c] bg-[#0c2418] p-6 text-white shadow-[0_18px_40px_rgba(7,26,16,0.12)] lg:sticky lg:top-28">
              <h3 className="display-font text-2xl font-semibold leading-tight tracking-[-0.035em] text-white [text-wrap:balance]">{ctaHeading}</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">Ask our team about the products listed, along with availability, specifications, and volumes.</p>
              <Link href={ctaHref} className="pressable mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--brand)] px-5 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] dark:text-[#062a17]">
                {ctaText}<span aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {(publicStats.length > 0 || approvedTestimonial) && (
        <section aria-label={publicStats.length > 0 ? "Sodoh Nigeria in numbers" : "Approved quote"} className="border-t border-white/10 bg-[#0c2418] px-5 py-8 text-white sm:px-8 md:px-12 md:py-10 lg:px-16">
          <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)] lg:items-center lg:gap-12">
            {publicStats.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 sm:gap-x-8">
                {publicStats.map((stat) => (
                  <div key={stat.id} className="border-l border-white/20 pl-4">
                    <p className="display-font text-3xl font-semibold tracking-[-0.04em] text-[#a7f3d0] sm:text-4xl">{stat.value}</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-white">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
            {approvedTestimonial && (
              <figure className="border-t border-white/20 pt-6 lg:border-l lg:border-t-0 lg:py-2 lg:pl-8">
                <blockquote className="display-font text-lg font-medium leading-7 tracking-[-0.02em] text-white/95 [text-wrap:balance]">
                  <span aria-hidden="true" className="text-[#a7f3d0]">“</span>{approvedTestimonial.quote}<span aria-hidden="true" className="text-[#a7f3d0]">”</span>
                </blockquote>
                <figcaption className="mt-3 text-xs leading-5 text-white/70">
                  <span className="font-semibold text-white">{approvedTestimonial.author_name}</span>
                  {approvedTestimonial.author_role && <span> · {approvedTestimonial.author_role}</span>}
                  <span className="ml-2 font-semibold uppercase tracking-[0.1em] text-[#a7f3d0]">Approved quote</span>
                </figcaption>
              </figure>
            )}
          </div>
        </section>
      )}

      <SiteCta
        heading={ctaHeading}
        body="Tell us what you need. Our team can discuss the next step with you."
        ctaText={ctaText}
        ctaHref={ctaHref}
      />
    </div>
  );
}
