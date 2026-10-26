import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import { SiteCta } from "@/components/sections/SiteCta";
import { getPageContent } from "@/lib/data";
import { safeHref } from "@/lib/utils";
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

  return (
    <div className="page-enter">
      <section className="field-paper px-5 pb-20 pt-16 sm:px-8 md:px-12 md:pb-28 md:pt-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="hero-copy">
            <h1 className="display-font max-w-[18ch] text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--ink)] [text-wrap:balance]">{hero.title}</h1>
            <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              {hero.subtitle && <p className="measure text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{hero.subtitle}</p>}
              <div className="flex shrink-0 flex-wrap gap-3">
                {hero.cta_primary_text && hero.cta_primary_href && <Link href={safeHref(hero.cta_primary_href, "/products")} className="pressable inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[var(--brand)] px-7 text-[15px] font-semibold text-white hover:bg-[var(--brand-hover)] dark:text-[#062a17]">{hero.cta_primary_text} <span aria-hidden="true" className="ml-2">→</span></Link>}
                {hero.cta_secondary_text && hero.cta_secondary_href && <Link href={safeHref(hero.cta_secondary_href, "/contact")} className="pressable inline-flex min-h-12 items-center justify-center rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)]/60 px-7 text-[15px] font-semibold text-[var(--ink)] hover:border-[var(--brand)] hover:bg-[var(--surface-soft)]">{hero.cta_secondary_text}</Link>}
              </div>
            </div>
          </div>
          <figure className="media-zoom relative mt-10 min-h-[280px] overflow-hidden rounded-[24px_72px_24px_24px] bg-[var(--surface-muted)] shadow-[var(--shadow-lift)] sm:min-h-[380px] lg:min-h-[46vh]">
            <Image src="/images/produce-fields.jpg" alt="Fresh produce arranged for market" fill priority sizes="100vw" className="object-cover" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-[#071a10]/70 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-sm">Representative agricultural photography</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
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
        <section className="bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <AnimateIn>
              <h2 className="display-font mb-8 max-w-[14ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">{typeof timelineContent.heading === "string" ? timelineContent.heading : "Our journey"}</h2>
            </AnimateIn>
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {milestones.map((milestone, index) => (
                <AnimateIn key={`${milestone.year}-${milestone.title}`} delay={Math.min(index * 0.06, 0.3)}>
                  <article className="grid gap-2 py-5 sm:grid-cols-[7rem_0.7fr_1.3fr] sm:gap-8 sm:py-6">
                    <p className="display-font text-2xl font-semibold tracking-[-0.03em] text-[var(--brand)]">{milestone.year}</p>
                    <h3 className="text-base font-semibold text-[var(--ink)]">{milestone.title}</h3>
                    <p className="max-w-[64ch] text-sm leading-6 text-[var(--body)]">{milestone.description}</p>
                  </article>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-9 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <AnimateIn>
            <h2 className="display-font max-w-[11ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">{valuesHeading}</h2>
          </AnimateIn>
          <div className="grid gap-x-10 sm:grid-cols-2">
            {valueItems.map((item, index) => (
              <AnimateIn key={item.title} delay={index * 0.07}>
                <article className="border-t border-[var(--border-strong)]/60 py-5 sm:py-6">
                  <h3 className="display-font text-xl font-semibold tracking-[-0.025em] text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-2 max-w-[42ch] text-sm leading-6 text-[var(--body)]">{item.description}</p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {people.length > 0 && (
        <section className="bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
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

      <SiteCta
        heading={typeof cta.heading === "string" ? cta.heading : DEFAULT_CTA.heading}
        body={typeof cta.subtitle === "string" ? cta.subtitle : DEFAULT_CTA.subtitle}
        ctaText={typeof cta.cta_text === "string" ? cta.cta_text : DEFAULT_CTA.cta_text}
        ctaHref={safeHref(cta.cta_href, DEFAULT_CTA.cta_href)}
      />
    </div>
  );
}
