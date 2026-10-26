import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import { SiteCta } from "@/components/sections/SiteCta";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductLedger } from "@/components/products/ProductLedger";
import { getPageContent, getProducts } from "@/lib/data";
import { safeHref } from "@/lib/utils";
import type { HeroContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Products — Sodoh Nigeria",
  description: "Browse agricultural products listed by Sodoh Nigeria Limited and ask the team about supply details.",
  openGraph: {
    title: "Products — Sodoh Nigeria",
    description: "Browse the Sodoh Nigeria agricultural product catalogue.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [content, products] = await Promise.all([
    getPageContent("products"),
    getProducts(),
  ]);
  const publicProducts = products.filter((product) => product.public_reviewed);

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
      <section className="field-paper px-5 pb-20 pt-16 sm:px-8 md:px-12 md:pb-28 md:pt-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="hero-copy">
            <h1 className="display-font max-w-[18ch] text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--ink)] [text-wrap:balance]">{hero.title}</h1>
            <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              {hero.subtitle && <p className="measure text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{hero.subtitle}</p>}
              {hero.cta_primary_text && hero.cta_primary_href && <Link href={safeHref(hero.cta_primary_href, "/contact")} className="pressable inline-flex min-h-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--brand)] px-7 text-[15px] font-semibold text-white hover:bg-[var(--brand-hover)] dark:text-[#062a17]">{hero.cta_primary_text} <span aria-hidden="true" className="ml-2">→</span></Link>}
            </div>
          </div>
          <figure className="media-zoom relative mt-10 min-h-[280px] overflow-hidden rounded-[24px_72px_24px_24px] bg-[var(--surface-muted)] shadow-[var(--shadow-lift)] sm:min-h-[380px] lg:min-h-[46vh]">
            <Image src="/images/produce-fields.jpg" alt="Fresh produce arranged for market" fill priority sizes="100vw" className="object-cover" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-[#071a10]/70 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-sm">Representative agricultural photography</figcaption>
          </figure>
        </div>
      </section>

      <section id="catalogue" className="scroll-mt-24 bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <AnimateIn className="mb-8 flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-font max-w-[16ch] text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.0] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">{gridHeading}</h2>
            <p className="max-w-[45ch] text-sm leading-6 text-[var(--body)]">Ask our team about the products listed, along with availability, specifications, and volumes.</p>
          </AnimateIn>

          {publicProducts.length === 0 ? (
            <EmptyState
              title="The catalogue is being updated"
              body="Contact our team to discuss what you are looking for."
              action={
                <Link href="/contact" className="pressable inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[var(--brand)] px-6 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] dark:text-[#062a17]">Contact us</Link>
              }
            />
          ) : (
            <ProductLedger products={publicProducts} showRequest />
          )}
        </div>
      </section>

      <SiteCta
        heading={ctaHeading}
        body="Tell us what you need. Our team can discuss the next step with you."
        ctaText={ctaText}
        ctaHref={ctaHref}
      />
    </div>
  );
}
