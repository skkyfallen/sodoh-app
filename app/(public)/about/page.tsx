import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import { getPageContent } from "@/lib/data";
import type { HeroContent } from "@/types/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Sodoh Nigeria",
  description: "Learn about Sodoh Nigeria Limited and how to enquire about agricultural products and partnerships.",
  openGraph: {
    title: "About Sodoh Nigeria",
    description: "Learn about Sodoh Nigeria Limited and how to get in touch.",
    type: "website",
  },
};

const DEFAULT_HERO: HeroContent = {
  title: "About Sodoh Nigeria",
  subtitle: "Sodoh Nigeria Limited is an agricultural company. Explore the product catalogue and contact our team to discuss what you are looking for.",
  cta_primary_text: "View products",
  cta_primary_href: "/products",
  cta_secondary_text: "Contact us",
  cta_secondary_href: "/contact",
};

const DEFAULT_OPERATIONS = {
  heading: "A place to begin",
  body: "Browse the products currently listed on our site, then contact our team with questions about availability, volumes, or partnership enquiries. Our team can discuss the details with you before you make a decision.",
};

const DEFAULT_VALUES = {
  heading: "How to work with us",
  items: [
    { title: "Browse products", description: "See the agricultural products currently listed in our catalogue." },
    { title: "Share your needs", description: "Tell our team which products, volumes, or partnership details you want to discuss." },
    { title: "Talk through the details", description: "Ask questions about the listed product and agree on next steps directly with our team." },
  ],
};

const DEFAULT_CTA = {
  heading: "Have a question for our team?",
  subtitle: "Get in touch about a product or partnership enquiry.",
  cta_text: "Contact us",
  cta_href: "/contact",
};

type Milestone = { year: string; title: string; description: string };
type Person = { name: string; role: string; bio: string };

function parseObj<T extends Record<string, unknown>>(value: unknown, fallback: T): T {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as T;
  return fallback;
}

function parseArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value as T[] : fallback;
}

export default async function AboutPage() {
  const content = await getPageContent("about");
  const heroContent = parseObj(content.hero, DEFAULT_HERO as Record<string, unknown>) as HeroContent & { public_reviewed?: boolean };
  const hero = heroContent.public_reviewed
    ? { ...DEFAULT_HERO, ...heroContent, title: heroContent.title || DEFAULT_HERO.title }
    : DEFAULT_HERO;

  const operationsContent = parseObj(content.operations, DEFAULT_OPERATIONS as Record<string, unknown>) as typeof DEFAULT_OPERATIONS & { public_reviewed?: boolean };
  const operations = operationsContent.public_reviewed ? operationsContent : DEFAULT_OPERATIONS;
  const valuesContent = parseObj(content.values, DEFAULT_VALUES as Record<string, unknown>) as Record<string, unknown> & { public_reviewed?: boolean };
  const values = valuesContent.public_reviewed ? valuesContent : DEFAULT_VALUES;
  const valuesHeading = typeof values.heading === "string" ? values.heading : DEFAULT_VALUES.heading;
  const valueItems = parseArray(values.items, DEFAULT_VALUES.items) as typeof DEFAULT_VALUES.items;
  const ctaContent = parseObj(content.cta_banner, DEFAULT_CTA as Record<string, unknown>) as typeof DEFAULT_CTA & { public_reviewed?: boolean };
  const cta = ctaContent.public_reviewed ? ctaContent : DEFAULT_CTA;
  const timelineContent = parseObj(content.timeline, { heading: "Our journey", milestones: [] } as Record<string, unknown> & { public_reviewed?: boolean });
  const milestones = timelineContent.public_reviewed
    ? parseArray(timelineContent.milestones, [] as Milestone[]).filter((item) => item.year && item.title && item.description)
    : [];
  const peopleContent = parseObj(content.people, { heading: "Our team", members: [] } as Record<string, unknown> & { public_reviewed?: boolean });
  const people = peopleContent.public_reviewed
    ? parseArray(peopleContent.members, [] as Person[]).filter((person) => person.name && person.role && person.bio)
    : [];
  const operationsHeading = typeof operations.heading === "string" ? operations.heading : DEFAULT_OPERATIONS.heading;
  const paragraphs = typeof operations.body === "string" ? operations.body.split("\n\n").filter(Boolean) : [DEFAULT_OPERATIONS.body];
  const ctaHeading = typeof cta.heading === "string" ? cta.heading : DEFAULT_CTA.heading;
  const ctaSubtitle = typeof cta.subtitle === "string" ? cta.subtitle : DEFAULT_CTA.subtitle;
  const ctaText = typeof cta.cta_text === "string" ? cta.cta_text : DEFAULT_CTA.cta_text;

  return (
    <>
      <section className="bg-[var(--surface-soft)] px-5 py-10 sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <AnimateIn>
            <h1 className="display-font max-w-[13ch] text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">{hero.title}</h1>
            {hero.subtitle && <p className="mt-6 max-w-[58ch] text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{hero.subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {hero.cta_primary_text && hero.cta_primary_href && <Link href={hero.cta_primary_href} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#062a17]">{hero.cta_primary_text}</Link>}
              {hero.cta_secondary_text && hero.cta_secondary_href && <Link href={hero.cta_secondary_href} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] px-6 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface)]">{hero.cta_secondary_text}</Link>}
            </div>
          </AnimateIn>
          <figure className="relative min-h-[320px] overflow-hidden rounded-[24px_72px_24px_24px] bg-[var(--surface-muted)] sm:min-h-[460px] lg:min-h-[560px]">
            <Image src="/images/produce-fields.jpg" alt="Fresh produce arranged for market" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <figcaption className="absolute bottom-0 left-0 bg-[#092418]/65 px-4 py-3 text-sm text-white backdrop-blur-sm">Representative agricultural photography</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-[var(--surface)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <AnimateIn>
            <h2 className="display-font max-w-[12ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">{operationsHeading}</h2>
          </AnimateIn>
          <div className="max-w-[70ch] space-y-5">
            {paragraphs.map((paragraph, index) => <p key={index} className="text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{paragraph}</p>)}
          </div>
        </div>
      </section>

      {milestones.length > 0 && (
        <section className="bg-[var(--surface)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <h2 className="display-font mb-8 max-w-[14ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">{typeof timelineContent.heading === "string" ? timelineContent.heading : "Our journey"}</h2>
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {milestones.map((milestone) => (
                <article key={`${milestone.year}-${milestone.title}`} className="grid gap-2 py-5 sm:grid-cols-[7rem_0.7fr_1.3fr] sm:gap-8 sm:py-6">
                  <p className="display-font text-2xl font-semibold tracking-[-0.03em] text-[var(--brand)]">{milestone.year}</p>
                  <h3 className="text-base font-semibold text-[var(--ink)]">{milestone.title}</h3>
                  <p className="max-w-[64ch] text-sm leading-6 text-[var(--body)]">{milestone.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--surface-muted)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-9 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <AnimateIn>
            <h2 className="display-font max-w-[11ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">{valuesHeading}</h2>
          </AnimateIn>
          <div className="grid gap-x-10 sm:grid-cols-2">
            {valueItems.map((item) => (
              <article key={item.title} className="border-t border-[var(--border)] py-5 sm:py-6">
                <h3 className="display-font text-xl font-semibold tracking-[-0.025em] text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2 max-w-[42ch] text-sm leading-6 text-[var(--body)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {people.length > 0 && (
        <section className="bg-[var(--surface)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
          <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <h2 className="display-font max-w-[11ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">{typeof peopleContent.heading === "string" ? peopleContent.heading : "Our team"}</h2>
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {people.map((person) => (
                <article key={person.name} className="grid gap-2 py-5 sm:grid-cols-[0.7fr_1.3fr] sm:gap-8 sm:py-6">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--ink)]">{person.name}</h3>
                    <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{person.role}</p>
                  </div>
                  <p className="max-w-[64ch] text-sm leading-6 text-[var(--body)]">{person.bio}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#0d2b1c] px-5 py-14 text-white sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="display-font max-w-[16ch] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl [text-wrap:balance]">{ctaHeading}</h2>
            {ctaSubtitle && <p className="mt-3 max-w-[58ch] text-sm leading-6 text-white/85">{ctaSubtitle}</p>}
          </div>
          <Link href={cta.cta_href ?? "/contact"} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#a7f3d0] px-6 text-sm font-semibold text-[#064e3b] transition-transform hover:-translate-y-px active:translate-y-0">{ctaText}</Link>
        </div>
      </section>
    </>
  );
}
