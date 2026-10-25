import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import { getPageContent, getProducts } from "@/lib/data";
import type { HeroContent } from "@/types/content";
import ProductRequestButton from "@/components/products/ProductRequestButton";

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
  const ctaHref = ctaBanner.cta_href ?? "/contact";

  const layouts = ["lg:col-span-7", "lg:col-span-5 lg:mt-20", "lg:col-span-5", "lg:col-span-7 lg:-mt-8"];

  return (
    <>
      <section className="bg-[var(--surface-soft)] px-5 pb-12 pt-10 sm:px-8 md:px-12 md:pb-16 md:pt-14 lg:px-16">
        <div className="mx-auto grid max-w-[1440px] items-center gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <AnimateIn>
            <h1 className="display-font max-w-[12ch] text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">{hero.title}</h1>
            {hero.subtitle && <p className="mt-6 max-w-[58ch] text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{hero.subtitle}</p>}
            {hero.cta_primary_text && hero.cta_primary_href && <Link href={hero.cta_primary_href} className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#062a17]">{hero.cta_primary_text}</Link>}
          </AnimateIn>
          <figure className="relative min-h-[300px] overflow-hidden rounded-[24px_72px_24px_24px] bg-[var(--surface-muted)] sm:min-h-[430px] lg:min-h-[520px]">
            <Image src="/images/produce-fields.jpg" alt="Fresh produce arranged for market" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            <figcaption className="absolute bottom-0 left-0 bg-[#092418]/65 px-4 py-3 text-sm text-white backdrop-blur-sm">Representative agricultural photography</figcaption>
          </figure>
        </div>
      </section>

      <section id="catalogue" className="scroll-mt-24 bg-[var(--surface)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-10 flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-font max-w-[15ch] text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--ink)] md:text-4xl [text-wrap:balance]">{gridHeading}</h2>
            <p className="max-w-[45ch] text-sm leading-6 text-[var(--body)]">Ask our team about the products listed, along with availability, specifications, and volumes.</p>
          </div>

          {publicProducts.length === 0 ? (
            <div className="flex flex-col items-start gap-4 border-y border-[var(--border)] py-10">
              <p className="text-sm leading-6 text-[var(--body)]">The catalogue is being updated. Contact our team to discuss what you are looking for.</p>
              <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#062a17]">Contact us</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12 lg:gap-y-16">
              {publicProducts.map((product, index) => (
                <AnimateIn key={product.id} className={layouts[index % layouts.length]}>
                  <article id={`product-${product.slug}`} className="scroll-mt-28 h-full min-w-0">
                    {product.image_url ? (
                      <div className={`relative w-full overflow-hidden rounded-2xl bg-[var(--surface-muted)] ${index % 4 === 0 ? "aspect-[1.2/1]" : "aspect-[1.55/1]"}`}>
                        <Image src={product.image_url} alt={product.image_alt || `${product.title} produce`} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition-transform duration-500 hover:scale-[1.025]" />
                      </div>
                    ) : (
                      <div className={`flex w-full items-end rounded-2xl bg-[var(--surface-muted)] p-5 ${index % 4 === 0 ? "aspect-[1.2/1]" : "aspect-[1.55/1]"}`}>
                        <p className="text-sm leading-5 text-[var(--muted)]">Product image not provided</p>
                      </div>
                    )}
                    <div className="flex flex-col gap-4 border-b border-[var(--border)] py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div className="max-w-[62ch]">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="display-font text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)]">{product.title}</h3>
                          {product.region && <span className="text-sm text-[var(--muted)]">{product.region}</span>}
                        </div>
                        {product.description && <p className="mt-2 text-sm leading-6 text-[var(--body)]">{product.description}</p>}
                      </div>
                      <div className="w-full shrink-0 sm:w-44"><ProductRequestButton product={product} /></div>
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#0d2b1c] px-5 py-14 text-white sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="display-font max-w-[16ch] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl [text-wrap:balance]">{ctaHeading}</h2>
            <p className="mt-3 max-w-[58ch] text-sm leading-6 text-white/85">Tell us what you need. Our team can discuss the next step with you.</p>
          </div>
          <Link href={ctaHref} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#a7f3d0] px-6 text-sm font-semibold text-[#064e3b] transition-transform hover:-translate-y-px active:translate-y-0">{ctaText}</Link>
        </div>
      </section>
    </>
  );
}
