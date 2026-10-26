import type { Metadata } from "next";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import { MdLocationOn, MdCall, MdMail } from "react-icons/md";
import { getPageContent, getFAQs } from "@/lib/data";
import { safeHref } from "@/lib/utils";
import type { HeroContent } from "@/types/content";
import { defaultLocale, email, phone, phoneTel, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact a Nigerian Agricultural Products Supplier | Sodoh" },
  description: "Contact Sodoh Nigeria Limited in Abuja about Nigerian agricultural products, sourcing needs, product availability, or partnership enquiries. Call or email our team.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact a Nigerian Agricultural Products Supplier | Sodoh",
    description: "Contact Sodoh Nigeria Limited in Abuja about Nigerian agricultural products, sourcing needs, product availability, or partnership enquiries. Call or email our team.",
    url: "/contact",
    siteName,
    locale: defaultLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact a Nigerian Agricultural Products Supplier | Sodoh",
    description: "Contact Sodoh Nigeria Limited in Abuja about Nigerian agricultural products, sourcing needs, product availability, or partnership enquiries. Call or email our team.",
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
  const hasPublicPhone = contactDetails.some(
    (item) => item.label.toLowerCase().includes("phone") && item.value.replace(/\D/g, "").endsWith("8169927344"),
  );
  const hasPublicEmail = contactDetails.some(
    (item) => item.value.trim().toLowerCase() === email,
  );
  const mapQuery = typeof info?.map_query === "string" ? info.map_query : "Abuja, Nigeria";
  const mapUrl = safeHref(`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`, "https://maps.google.com/");

  return (
    <div className="page-enter">
      <section className="field-paper px-5 pb-20 pt-16 sm:px-8 md:px-12 md:pb-24 md:pt-20 lg:px-16">
        <div className="hero-copy mx-auto max-w-[1440px]">
          <div>
            <h1 className="display-font max-w-[18ch] text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--ink)] [text-wrap:balance]">{hero.title}</h1>
            <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              {hero.subtitle && <p className="measure text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{hero.subtitle}</p>}
              <Link href="#contact-form" className="pressable inline-flex min-h-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--brand)] px-7 text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(1,105,54,0.18)] hover:bg-[var(--brand-hover)] dark:text-[#062a17]">
                {hero.cta_primary_text ?? "Send a message"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--page)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <AnimateIn variant="fade-right">
            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-5 sm:p-8 md:p-10">
                <div id="contact-form" className="scroll-mt-28">
                  <ContactForm />
                </div>
              </CardContent>
            </Card>
          </AnimateIn>

          <AnimateIn variant="fade-left" delay={0.12} className="flex flex-col gap-6">
            <div>
              <h2 className="display-font text-3xl font-semibold tracking-[-0.04em] text-[var(--ink)] md:text-4xl">Contact information</h2>
              <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {contactDetails.length ? contactDetails.map((item) => {
                  const Icon = iconComponents[item.icon as keyof typeof iconComponents] ?? MdMail;
                  return (
                    <div key={item.label} className="flex items-start gap-4 py-4">
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)]">
                        <Icon aria-hidden="true" className="text-lg text-[var(--brand)]" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                        {item.label.toLowerCase().includes("email") && item.value.includes("@") ? (
                          <a href={safeHref(`mailto:${item.value.trim()}`, "mailto:info@sodohnigeria.com")} className="mt-1 inline-block text-sm leading-6 text-[var(--body)] underline decoration-[var(--border-strong)] underline-offset-4 hover:text-[var(--brand)]">{item.value}</a>
                        ) : item.label.toLowerCase().includes("phone") ? (
                          <a href={safeHref(`tel:${item.value.replace(/[^+\d]/g, "")}`, "/contact")} className="mt-1 inline-block whitespace-pre-line text-sm leading-6 text-[var(--body)] underline decoration-[var(--border-strong)] underline-offset-4 hover:text-[var(--brand)]">{item.value}</a>
                        ) : (
                          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[var(--body)]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <>
                    <div className="flex items-start gap-4 py-4">
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)]">
                        <MdLocationOn aria-hidden="true" className="text-lg text-[var(--brand)]" />
                      </span>
                      <div><p className="text-sm font-semibold text-[var(--ink)]">Location</p><p className="mt-1 text-sm leading-6 text-[var(--body)]">Abuja, Federal Capital Territory, Nigeria</p></div>
                    </div>
                    <div className="flex items-start gap-4 py-4">
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)]">
                        <MdMail aria-hidden="true" className="text-lg text-[var(--brand)]" />
                      </span>
                      <div><p className="text-sm font-semibold text-[var(--ink)]">Email</p><a href={`mailto:${email}`} className="mt-1 text-sm leading-6 text-[var(--body)] underline decoration-[var(--border-strong)] underline-offset-4">{email}</a></div>
                    </div>
                  </>
                )}
                {!hasPublicPhone && (
                  <div className="flex items-start gap-4 py-4">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)]">
                      <MdCall aria-hidden="true" className="text-lg text-[var(--brand)]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">Phone</p>
                      <a href={`tel:${phoneTel}`} className="mt-1 inline-block text-sm leading-6 text-[var(--body)] underline decoration-[var(--border-strong)] underline-offset-4 hover:text-[var(--brand)]">{phone}</a>
                    </div>
                  </div>
                )}
                {!hasPublicEmail && contactDetails.length > 0 && (
                  <div className="flex items-start gap-4 py-4">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)]">
                      <MdMail aria-hidden="true" className="text-lg text-[var(--brand)]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">Email</p>
                      <a href={`mailto:${email}`} className="mt-1 inline-block text-sm leading-6 text-[var(--body)] underline decoration-[var(--border-strong)] underline-offset-4 hover:text-[var(--brand)]">{email}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Map showing ${mapQuery}`}
              aria-label={`Map showing ${mapQuery}`}
              className="media-zoom relative block min-h-[250px] overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] shadow-[var(--shadow-card)] sm:min-h-[320px]"
            >
              <p className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-[#10291c] shadow-[0_3px_12px_rgba(10,42,26,0.15)]">
                Map location: {mapQuery}
              </p>
              <span className="pressable absolute bottom-3 left-3 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#10291c] shadow-[0_4px_16px_rgba(10,42,26,0.2)] hover:text-[#016936]">
                Open in Google Maps
              </span>
            </a>
          </AnimateIn>
        </div>
      </section>

      <FAQ faqs={faqs.filter((faq) => faq.public_reviewed)} />
    </div>
  );
}
