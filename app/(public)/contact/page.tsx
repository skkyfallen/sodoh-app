import type { Metadata } from "next";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import { MdLocationOn, MdCall, MdMail } from "react-icons/md";
import { getPageContent, getFAQs } from "@/lib/data";
import type { HeroContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Contact — Sodoh Nigeria",
  description: "Contact Sodoh Nigeria Limited about products, supply requirements, and partnerships.",
  openGraph: {
    title: "Contact — Sodoh Nigeria",
    description: "Contact the Sodoh Nigeria team about products and partnerships.",
    type: "website",
  },
};

export const revalidate = 60;

const iconComponents = { MdLocationOn, MdCall, MdMail };

export default async function ContactPage() {
  const [content, faqs] = await Promise.all([
    getPageContent("contact"),
    getFAQs(),
  ]);

  const storedHero = (content.hero ?? {}) as HeroContent & { public_reviewed?: boolean };
  const safeHero: HeroContent = {
    title: "Contact Sodoh Nigeria",
    subtitle: "Tell us what you are looking for and our team will help direct your enquiry.",
    cta_primary_text: "Send a message",
    cta_primary_href: "#contact-form",
  };
  const hero = storedHero.public_reviewed
    ? { ...safeHero, ...storedHero, title: storedHero.title || safeHero.title }
    : safeHero;
  const info = content.info as Record<string, unknown> | undefined;
  const contactDetails = Array.isArray(info?.details)
    ? info.details as Array<{ icon: string; label: string; value: string }>
    : [];
  const mapQuery = typeof info?.map_query === "string" ? info.map_query : "Abuja, Nigeria";

  return (
    <>
      <section className="bg-[var(--surface-soft)] px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-7 sm:flex-row sm:items-end sm:justify-between">
          <AnimateIn>
            <h1 className="display-font max-w-[14ch] text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">{hero.title}</h1>
            {hero.subtitle && <p className="mt-5 max-w-[58ch] text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{hero.subtitle}</p>}
          </AnimateIn>
          <Link href="#contact-form" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#062a17]">
            {hero.cta_primary_text ?? "Send a message"}
          </Link>
        </div>
      </section>

      <section className="bg-[var(--surface)] px-5 py-12 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div id="contact-form" className="scroll-mt-28 rounded-2xl bg-[var(--surface-soft)] p-5 sm:p-8 md:p-10">
            <ContactForm />
          </div>

          <AnimateIn className="flex flex-col gap-8">
            <div>
              <h2 className="display-font text-3xl font-semibold tracking-[-0.04em] text-[var(--ink)] md:text-4xl">Contact information</h2>
              <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {contactDetails.length ? contactDetails.map((item) => {
                  const Icon = iconComponents[item.icon as keyof typeof iconComponents] ?? MdMail;
                  return (
                    <div key={item.label} className="flex items-start gap-4 py-4">
                      <Icon aria-hidden="true" className="mt-1 shrink-0 text-xl text-[var(--brand)]" />
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                        {item.label.toLowerCase().includes("email") && item.value.includes("@") ? (
                          <a href={`mailto:${item.value.trim()}`} className="mt-1 inline-block text-sm leading-6 text-[var(--body)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--brand)]">{item.value}</a>
                        ) : item.label.toLowerCase().includes("phone") ? (
                          <a href={`tel:${item.value.replace(/[^+\d]/g, "")}`} className="mt-1 inline-block whitespace-pre-line text-sm leading-6 text-[var(--body)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--brand)]">{item.value}</a>
                        ) : (
                          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[var(--body)]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <>
                    <div className="flex items-start gap-4 py-4">
                      <MdLocationOn aria-hidden="true" className="mt-1 shrink-0 text-xl text-[var(--brand)]" />
                      <div><p className="text-sm font-semibold text-[var(--ink)]">Location</p><p className="mt-1 text-sm leading-6 text-[var(--body)]">Abuja, Federal Capital Territory, Nigeria</p></div>
                    </div>
                    <div className="flex items-start gap-4 py-4">
                      <MdMail aria-hidden="true" className="mt-1 shrink-0 text-xl text-[var(--brand)]" />
                      <div><p className="text-sm font-semibold text-[var(--ink)]">Email</p><a href="mailto:info@sodohnigeria.com" className="mt-1 text-sm leading-6 text-[var(--body)] underline decoration-[var(--border)] underline-offset-4">info@sodohnigeria.com</a></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="relative min-h-[250px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] sm:min-h-[320px]">
              <iframe
                title={`Map showing ${mapQuery}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[0.35]"
              />
              <p className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-[#10291c] shadow-[0_3px_12px_rgba(10,42,26,0.15)]">
                Map location: {mapQuery}
              </p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 left-3 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#10291c] shadow-[0_4px_16px_rgba(10,42,26,0.2)] transition-colors hover:text-[#016936]">
                Open in Google Maps
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      <FAQ faqs={faqs.filter((faq) => faq.public_reviewed)} />
    </>
  );
}
