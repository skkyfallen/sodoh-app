import type { Metadata } from "next";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import { MdLocationOn, MdCall, MdMail } from "react-icons/md";
import { getPageContent, getFAQs, getStats } from "@/lib/data";
import type { HeroContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Contact Us — Sodoh Nigeria Limited",
  description:
    "Get in touch with Sodoh Nigeria Limited about partnerships, produce supply, or agricultural operations.",
  openGraph: {
    title: "Contact Us — Sodoh Nigeria Limited",
    description: "Get in touch with Sodoh Nigeria Limited for partnership opportunities and agricultural inquiries.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function ContactPage() {
  const [content, faqs, stats] = await Promise.all([
    getPageContent("contact"),
    getFAQs(),
    getStats(),
  ]);

  const hero = (content.hero ?? {}) as HeroContent;
  if (!hero.title) hero.title = "Get in touch with Sodoh Nigeria";
  const info = content.info as Record<string, unknown> | undefined;
  const contactDetails = (info?.details ?? []) as Array<{ icon: string; label: string; value: string }>;
  const mapQuery = (info?.map_query ?? "Abuja, Nigeria") as string;
  const iconComponents = { MdLocationOn, MdCall, MdMail };
  const contactHref = hero.cta_primary_href ?? "mailto:info@sodohnigeria.com";

  return (
    <>
      <section className="bg-[#f7f7ef] px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] items-end gap-10 lg:grid-cols-[1fr_0.55fr] lg:gap-20">
          <AnimateIn variant="fade-up">
            {hero.badge && <p className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]"><span className="h-px w-9 bg-[#016936]" />{hero.badge}</p>}
            <h1 className="display-font max-w-[13ch] text-[clamp(2.8rem,5.8vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#17241d]">{hero.title}</h1>
            {hero.subtitle && <p className="mt-6 max-w-xl text-base leading-7 text-[#4b5c50] md:text-lg md:leading-8">{hero.subtitle}</p>}
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <div className="border-t border-[#cbd5cb] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#016936]">A good place to start</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#59685d]">Share a little about your needs and the right person on our team will get back to you.</p>
              <Link href={contactHref} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#016936] underline decoration-[#0df20d] underline-offset-4 hover:text-[#014e29]">{hero.cta_primary_text ?? "Send us a message"}<span aria-hidden="true">↗</span></Link>
            </div>
          </AnimateIn>
        </div>
        {stats.length > 0 && <div className="mx-auto mt-12 grid max-w-[1320px] grid-cols-2 gap-y-5 border-t border-[#d9dfd7] pt-6 sm:grid-cols-3 sm:gap-8">{stats.slice(0, 3).map((stat) => <div key={stat.label} className="flex items-baseline gap-3"><span className="display-font text-2xl font-semibold text-[#016936]">{stat.value}</span><span className="text-xs leading-5 text-[#526157]">{stat.label}</span></div>)}</div>}
      </section>

      <main className="bg-white px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div id="contact-form" className="bg-[#f7f7ef] p-5 sm:p-8 md:p-10">
            <ContactForm />
          </div>

          <AnimateIn variant="fade-up" delay={100} className="flex flex-col gap-9">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">Reach our team</p>
              <h2 className="display-font text-3xl font-medium tracking-[-0.04em] text-[#17241d] md:text-4xl">Contact information</h2>
              <div className="mt-7 divide-y divide-[#d9e1da] border-y border-[#d9e1da]">
                {contactDetails.length ? contactDetails.map((item) => {
                  const Icon = iconComponents[item.icon as keyof typeof iconComponents] ?? MdMail;
                  return <div key={item.label} className="flex items-start gap-4 py-5"><Icon aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-[#016936]" /><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#506054]">{item.label}</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#17241d]">{item.value}</p></div></div>;
                }) : <><div className="flex items-start gap-4 py-5"><MdLocationOn aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-[#016936]" /><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#506054]">Location</p><p className="mt-1 text-sm leading-6 text-[#17241d]">Abuja, Federal Capital Territory, Nigeria</p></div></div><div className="flex items-start gap-4 py-5"><MdMail aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-[#016936]" /><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#506054]">Email</p><a href="mailto:info@sodohnigeria.com" className="mt-1 text-sm text-[#17241d] underline decoration-[#0df20d] underline-offset-4">info@sodohnigeria.com</a></div></div></>}
              </div>
            </div>

            <div className="relative min-h-[270px] overflow-hidden border border-[#d9e1da] bg-[#eaf0e8]">
              <iframe
                title={`Map showing ${mapQuery}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[0.35]"
              />
              <a href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 left-3 bg-white px-4 py-2 text-xs font-bold text-[#17241d] shadow-sm transition-colors hover:text-[#016936]">Open in Google Maps ↗</a>
            </div>
          </AnimateIn>
        </div>
      </main>

      <FAQ faqs={faqs} />
    </>
  );
}
