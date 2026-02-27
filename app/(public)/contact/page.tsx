import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import StatsStack from "@/components/ui/StatsStack";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import { MdLocationOn, MdCall, MdMail } from 'react-icons/md';
import { getPageContent, getStats, getFAQs } from "@/lib/data";
import type { HeroContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Contact Us — Sodoh Nigeria Limited",
  description:
    "Get in touch with Sodoh Nigeria Limited. Reach out for partnership opportunities, general inquiries, or to learn more about our agricultural operations.",
  openGraph: {
    title: "Contact Us — Sodoh Nigeria Limited",
    description:
      "Get in touch with Sodoh Nigeria Limited for partnership opportunities and agricultural inquiries.",
    type: "website",
  },
};

export const runtime = "edge";
export const revalidate = 60;

export default async function ContactPage() {
  const [content, stats, faqs] = await Promise.all([
    getPageContent("contact"),
    getStats(),
    getFAQs(),
  ]);

  const hero = (content.hero ?? {}) as HeroContent;
  if (!hero.title) hero.title = "Get in Touch with Sodoh Nigeria";
  const info = content.info as Record<string, unknown> | undefined;
  const contactDetails = (info?.details ?? []) as Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  const mapQuery = (info?.map_query ?? "Abuja,Nigeria") as string;

  const iconComponents: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    MdLocationOn,
    MdCall,
    MdMail,
  };

  return (
    <>
      {/* Hero (landing page style) */}
      <section className="bg-white px-6 pt-20 pb-24 md:px-20 md:pt-28 md:pb-32 flex items-center">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* Left column text */}
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
                {hero.title}
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
                <Link
                  href={hero.cta_primary_href}
                  className="mt-12 flex items-center justify-center rounded-full h-12 px-8 bg-[#016936] text-white text-base font-bold transition-transform transition-shadow duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.04]"
                >
                  {hero.cta_primary_text}
                </Link>
              </AnimateIn>
            )}
          </div>

          {/* Right column stats stack */}
          <AnimateIn variant="fade-left" delay={300} duration={700}>
            <StatsStack stats={stats} />
          </AnimateIn>
        </div>
      </section>
      <main className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <ContactForm />

        {/* Contact Details + Map */}
        <AnimateIn variant="fade-left" duration={700} delay={150} threshold={0.1}>
          <div className="flex flex-col gap-8">
            {/* Info card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <div className="flex flex-col gap-6">
                {contactDetails.map((item) => {
                  const Icon = iconComponents[item.icon] ?? MdMail;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="bg-[#0df20d]/20 p-3 rounded-lg text-[#0ac20a] shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.label}</p>
                        <p className="text-slate-600 text-sm whitespace-pre-line mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-slate-200 h-64 relative shadow-sm">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAAc6CFMHOR4Hx_kuZ37K5vYBDkcaZd_NY3EVlcX1npyjUxAXE8KLrqVdYI4Vuoebd1nmmWjAdW9ZALWVUg26RpB_wwusTQ7hd2M7eKUT0m0pbiRt_SogJ2t7yUUKF4H6BuAKVokGebzNtiA8MJrJVXjtvnXmF9uOGUtEXhrv8c-39u9IiJVHcF72RUzqUuQ8Ivy8MPRxYunPfOLqGDgE8pAk30168ps2FsCA0t6fA4mZdIYN2qh7YjA7aNMBTevni17LxKadH1E-n"
                alt={`Map of ${mapQuery}`}
                fill
                className="object-cover grayscale contrast-75 opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-2 rounded-full shadow-lg border-2 border-[#0df20d]">
                  <MdLocationOn className="text-[#0df20d]" style={{ fontSize: "1.5rem" }} />
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm hover:bg-white transition-colors"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </AnimateIn>
      </main>

      {/* FAQ */}
      <FAQ faqs={faqs} />
    </>
  );
}
