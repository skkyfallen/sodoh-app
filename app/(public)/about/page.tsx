import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  MdEco,
  MdVerified,
  MdHandshake,
  MdPublic,
} from "react-icons/md";
import type { IconType } from "react-icons";
import { getPageContent, getStats } from "@/lib/data";
import type { HeroContent } from "@/types/content";



/**
 * Revalidate the About page at most once per minute.
 * Data is served from cache; a background fetch updates it
 * on the next request after the TTL expires.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us — Sodoh Nigeria Limited",
  description:
    "Learn the story behind Sodoh Nigeria Limited — our mission, vision, history, and commitment to sustainable Nigerian agriculture.",
  openGraph: {
    title: "About Us — Sodoh Nigeria Limited",
    description:
      "Discover how Sodoh Nigeria Limited is cultivating Nigeria's agricultural future through sustainability, quality, and community.",
    type: "website",
  },
};

const iconMap: Record<string, IconType> = {
  MdEco,
  MdVerified,
  MdHandshake,
  MdPublic,
};

/* ── default fallbacks (used if Supabase rows are missing) ── */
const DEFAULT_HERO: HeroContent = {
  badge: "Our Story",
  title: "Grown in Nigeria. Trusted Worldwide.",
  highlight_word: "Nigeria",
  subtitle:
    "Sodoh Nigeria Limited is a leading agricultural enterprise committed to sustainable farming, premium produce, and empowering the communities behind every harvest.",
  cta_primary_text: "Explore Our Products",
  cta_primary_href: "/products",
  cta_secondary_text: "Get in Touch",
  cta_secondary_href: "/contact",
};

const DEFAULT_OPERATIONS = {
  heading: "What We Do",
  body: "Sodoh Nigeria Limited operates across the full agricultural value chain — from farm partnerships and sustainable cultivation, through modern processing and quality control, to cold-chain logistics and international export. We work directly with over 500 smallholder farmers across 12 Nigerian states, providing technical support, fair pricing, and market access they would otherwise lack. Our processing facilities in Abuja ensure every crop meets rigorous international standards before export. We supply premium produce — cassava, yam, maize, ginger, cocoa, and palm oil — to wholesale distributors, food manufacturers, and retailers across Europe, Asia, and beyond. Beyond commerce, we're committed to building agricultural communities: investing in farmer education, environmental stewardship, and economic inclusion at every step.",
};

const DEFAULT_TIMELINE = {
  heading: "Our Journey",
  milestones: [
    {
      year: "2015",
      title: "Founded",
      description:
        "Sodoh Nigeria Limited is established with a bold mission to modernise Nigerian agriculture and connect local produce to global markets.",
    },
    {
      year: "2017",
      title: "First Export Contract",
      description:
        "Achieved our first international export milestone, supplying premium cassava and yam to European distribution partners.",
    },
    {
      year: "2019",
      title: "Farm Expansion",
      description:
        "Expanded operations across three new states, entering formal partnerships with over 500 smallholder farmers.",
    },
    {
      year: "2022",
      title: "Sustainability Certified",
      description:
        "Received organic and sustainable farming certification across our core product lines after a comprehensive audit.",
    },
    {
      year: "2024",
      title: "Regional Leader",
      description:
        "Recognised as one of Nigeria's leading agricultural export companies, with active operations spanning 12 states.",
    },
  ],
};

const DEFAULT_VALUES = {
  heading: "What We Stand For",
  items: [
    {
      icon: "MdEco",
      title: "Sustainability",
      description:
        "Every decision considers its long-term impact on the land and the people who depend on it for their livelihoods.",
    },
    {
      icon: "MdVerified",
      title: "Quality Assurance",
      description:
        "Rigorous grading and processing standards ensure every product meets — and exceeds — international benchmarks.",
    },
    {
      icon: "MdHandshake",
      title: "Community First",
      description:
        "We invest in the farmers and rural communities that form the backbone of our supply chain and our story.",
    },
    {
      icon: "MdPublic",
      title: "Global Reach",
      description:
        "Connecting Nigerian agricultural excellence to markets across Europe, Asia, and the Americas.",
    },
  ],
};

const DEFAULT_CTA = {
  heading: "Ready to work with us?",
  subtitle:
    "Whether you're a buyer, importer, or community partner — we'd love to hear from you.",
  cta_text: "Contact Our Team",
  cta_href: "/contact",
};

const DEFAULT_PEOPLE = {
  heading: "Meet the Team",
  members: [
    {
      name: "Emmanuel Odoh",
      role: "Founder & Chief Executive Officer",
      bio: "Emmanuel founded Sodoh Nigeria Limited with a vision to modernise Nigerian agriculture and connect homegrown produce to global markets. He brings over a decade of experience in agribusiness and supply chain management.",
    },
    {
      name: "Adaeze Okonkwo",
      role: "Director of Operations",
      bio: "Adaeze oversees farm partnerships, logistics, and quality control across all 12 states of operation. Her background in agricultural science ensures every product meets rigorous international standards.",
    },
    {
      name: "Tunde Balogun",
      role: "Head of Export & Trade",
      bio: "Tunde leads Sodoh's international trade relationships, managing export contracts across Europe and Asia. He holds an MBA in International Trade and has closed over ₦2.5B in export deals.",
    },
  ],
};

/* ── helpers ── */
function parseArray<T>(val: unknown, fallback: T[]): T[] {
  if (Array.isArray(val)) return val as T[];
  return fallback;
}

function parseObj<T extends Record<string, unknown>>(
  val: unknown,
  fallback: T
): T {
  if (val && typeof val === "object" && !Array.isArray(val)) return val as T;
  return fallback;
}

export default async function AboutPage() {
  const [content, stats] = await Promise.all([
    getPageContent("about"),
    getStats(),
  ]);

  /* ── Content guards: fall back to defaults if DB rows are missing/malformed ── */
  const hero = parseObj(content.hero, DEFAULT_HERO as Record<string, unknown>) as HeroContent;
  // Ensure hero.title is always a non-empty string
  if (!hero.title) hero.title = DEFAULT_HERO.title;

  const operations = parseObj(content.operations, DEFAULT_OPERATIONS as Record<string, unknown>) as typeof DEFAULT_OPERATIONS;
  if (!operations.heading) operations.heading = DEFAULT_OPERATIONS.heading;
  if (!operations.body) operations.body = DEFAULT_OPERATIONS.body;
  const timelineRaw = parseObj(content.timeline, DEFAULT_TIMELINE as Record<string, unknown>);
  const timelineHeading = (timelineRaw.heading as string) ?? DEFAULT_TIMELINE.heading;
  const milestones = parseArray(
    timelineRaw.milestones,
    DEFAULT_TIMELINE.milestones
  ) as typeof DEFAULT_TIMELINE.milestones;
  const valuesRaw = parseObj(content.values, DEFAULT_VALUES as Record<string, unknown>);
  const valuesHeading = (valuesRaw.heading as string) ?? DEFAULT_VALUES.heading;
  const valueItems = parseArray(
    valuesRaw.items,
    DEFAULT_VALUES.items
  ) as typeof DEFAULT_VALUES.items;
  const ctaBanner = parseObj(content.cta_banner, DEFAULT_CTA as Record<string, unknown>) as typeof DEFAULT_CTA;
  const peopleRaw = parseObj(content.people, DEFAULT_PEOPLE as Record<string, unknown>);
  const peopleHeading = (peopleRaw.heading as string) ?? DEFAULT_PEOPLE.heading;
  const members = parseArray(
    peopleRaw.members,
    DEFAULT_PEOPLE.members
  ) as typeof DEFAULT_PEOPLE.members;

  /** Render title with optional highlighted word */
  const renderTitle = () => {
    const word = hero.highlight_word;
    if (!word || !hero.title?.includes(word)) return <>{hero.title}</>;
    const idx = hero.title.indexOf(word);
    const before = hero.title.slice(0, idx);
    const after = hero.title.slice(idx + word.length);
    return (
      <>
        {before}
        <span className="text-[#a9dd73]">{word}</span>
        {after}
      </>
    );
  };

  const bodyParagraphs = operations.body.split("\n\n").filter(Boolean);
  const sentences = bodyParagraphs.length === 1 && operations.body.length > 400
    ? operations.body.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) ?? bodyParagraphs
    : [];
  const paragraphs = sentences.length > 2
    ? [sentences.slice(0, Math.ceil(sentences.length / 2)).join(" "), sentences.slice(Math.ceil(sentences.length / 2)).join(" ")]
    : bodyParagraphs;

  return (
    <>
      <section className="bg-[#123d2a] px-5 py-12 text-white sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="py-4 lg:py-10">
            <AnimateIn variant="fade-up">
              {hero.badge && <p className="mb-7 text-xs font-bold uppercase tracking-[0.2em] text-[#b5eb71]">{hero.badge}</p>}
              <h1 className="display-font max-w-[12ch] text-[clamp(2.9rem,5.8vw,5.7rem)] font-medium leading-[0.98] tracking-[-0.055em]">{renderTitle()}</h1>
              {hero.subtitle && <p className="mt-7 max-w-lg text-base leading-7 text-white/75 md:text-lg md:leading-8">{hero.subtitle}</p>}
              <div className="mt-9 flex flex-wrap gap-3">
                {hero.cta_primary_text && hero.cta_primary_href && <Link href={hero.cta_primary_href} className="inline-flex min-h-12 items-center bg-[#0df20d] px-6 text-sm font-bold text-[#102210] transition-colors hover:bg-[#c8f6c8] focus-visible:outline-white">{hero.cta_primary_text}<span aria-hidden="true" className="ml-5 text-lg">↗</span></Link>}
                {hero.cta_secondary_text && hero.cta_secondary_href && <Link href={hero.cta_secondary_href} className="inline-flex min-h-12 items-center border border-white/35 px-6 text-sm font-bold text-white transition-colors hover:border-white focus-visible:outline-white">{hero.cta_secondary_text}</Link>}
              </div>
            </AnimateIn>
          </div>
          <AnimateIn variant="fade" delay={100} duration={750}>
            <figure className="relative min-h-[360px] overflow-hidden rounded-3xl bg-[#526e4d] sm:min-h-[480px] lg:min-h-[600px]">
              <Image src="/images/farmers-harvest.jpg" alt="Fresh green vegetables and peppers gathered for market" fill priority sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102210]/65 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 p-6 text-sm font-medium text-white sm:p-8">Rooted here. Growing together.</figcaption>
            </figure>
          </AnimateIn>
        </div>
        {stats.length > 0 && <div className="mx-auto mt-12 grid max-w-[1440px] grid-cols-2 gap-y-5 border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-8">{stats.slice(0, 3).map((stat) => <div key={stat.label} className="flex items-baseline gap-3"><span className="display-font text-2xl font-semibold text-[#d6f28c]">{stat.value}</span><span className="text-xs leading-5 text-white/70">{stat.label}</span></div>)}</div>}
      </section>

      <section className="bg-[#f7f7ef] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-24">
          <AnimateIn variant="fade-up"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">The way we work</p><h2 className="display-font mt-5 max-w-[10ch] text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#17241d] md:text-5xl">{operations.heading}</h2></AnimateIn>
          <AnimateIn variant="fade-up" delay={80}>
            <div className="max-w-3xl space-y-6 border-l border-[#b9c8b9] pl-6 md:pl-10">
              {paragraphs.map((paragraph, i) => <p key={i} className={`${i === 0 ? "text-xl leading-8 text-[#263b2e] md:text-2xl md:leading-9" : "text-base leading-7 text-[#59685d]"}`}>{paragraph}</p>)}
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#d9e1da] pb-7 sm:flex-row sm:items-end">
            <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">Milestones</p><h2 className="display-font text-4xl font-medium tracking-[-0.04em] text-[#17241d] md:text-5xl">{timelineHeading}</h2></div>
            <p className="max-w-xs text-sm leading-6 text-[#59685d]">A growing story shaped by people, places, and opportunity.</p>
          </div>
          <div className="divide-y divide-[#d9e1da]">
            {milestones.map((milestone, i) => <AnimateIn key={milestone.year} variant="fade-up" delay={i * 45} duration={450}><article className="grid gap-3 py-7 sm:grid-cols-[8rem_0.75fr_1.25fr] sm:gap-8 md:py-9"><p className="display-font text-3xl font-medium tracking-[-0.04em] text-[#016936]">{milestone.year}</p><h3 className="text-lg font-semibold text-[#17241d] md:text-xl">{milestone.title}</h3><p className="max-w-2xl text-sm leading-6 text-[#59685d] md:text-base md:leading-7">{milestone.description}</p></article></AnimateIn>)}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf0e8] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <AnimateIn variant="fade-up"><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">Our principles</p><h2 className="display-font max-w-[9ch] text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#17241d] md:text-5xl">{valuesHeading}</h2></AnimateIn>
          <div className="grid gap-x-10 sm:grid-cols-2">
            {valueItems.map((item, i) => {
              const Icon = iconMap[item.icon] ?? MdEco;
              return <AnimateIn key={item.title} variant="fade-up" delay={i * 55} duration={450}><article className="border-t border-[#bdcbbd] py-6"><div className="flex items-center justify-between gap-4"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#75877a]">0{i + 1}</span><Icon aria-hidden="true" className="text-xl text-[#016936]" /></div><h3 className="display-font mt-6 text-xl font-semibold tracking-tight text-[#17241d]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#59685d]">{item.description}</p></article></AnimateIn>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <AnimateIn variant="fade-up"><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">The people behind the work</p><h2 className="display-font max-w-[9ch] text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#17241d] md:text-5xl">{peopleHeading}</h2><p className="mt-5 max-w-sm text-sm leading-6 text-[#59685d]">A team focused on building strong partnerships and reliable supply.</p></AnimateIn>
          <div className="divide-y divide-[#d9e1da] border-t border-[#d9e1da]">
            {members.map((person, i) => <AnimateIn key={person.name} variant="fade-up" delay={i * 55} duration={450}><article className="grid gap-3 py-6 sm:grid-cols-[0.7fr_1.3fr] sm:gap-8"><div><h3 className="text-lg font-semibold text-[#17241d]">{person.name}</h3><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#016936]">{person.role}</p></div><p className="text-sm leading-6 text-[#59685d]">{person.bio}</p></article></AnimateIn>)}
          </div>
        </div>
      </section>

      <section className="bg-[#123d2a] px-5 py-16 text-white sm:px-8 md:px-12 md:py-20 lg:px-16">
        <AnimateIn variant="fade-up"><div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b5eb71]">Let’s grow something good</p><h2 className="display-font max-w-[14ch] text-3xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">{ctaBanner.heading}</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/70 md:text-base">{ctaBanner.subtitle}</p></div><Link href={ctaBanner.cta_href ?? "/contact"} className="inline-flex min-h-12 shrink-0 items-center bg-[#0df20d] px-6 text-sm font-bold text-[#102210] transition-colors hover:bg-[#c8f6c8] focus-visible:outline-white">{ctaBanner.cta_text}<span aria-hidden="true" className="ml-5 text-lg">↗</span></Link></div></AnimateIn>
      </section>
    </>
  );
}
