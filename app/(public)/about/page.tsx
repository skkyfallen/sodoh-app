import type { Metadata } from "next";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  MdEco,
  MdVerified,
  MdHandshake,
  MdPublic,
  MdPerson,
} from "react-icons/md";
import type { IconType } from "react-icons";
import { getPageContent, getStats } from "@/lib/data";
import type { HeroContent } from "@/types/content";

export const runtime = "edge";

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
        <span className="relative inline-block">
          <span className="relative z-10 text-white px-2">{word}</span>
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[#016936] rounded-md -skew-x-2"
          />
        </span>{" "}
        {after}
      </>
    );
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-white px-6 pt-20 pb-24 md:px-20 md:pt-28 md:pb-32">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Text column */}
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
                {renderTitle()}
              </h1>
            </AnimateIn>

            {hero.subtitle && (
              <AnimateIn variant="fade-left" delay={360} duration={700}>
                <p className="text-slate-800 font-semibold text-base md:text-lg leading-relaxed max-w-[95vw] lg:max-w-[60vw] mt-7">
                  {hero.subtitle}
                </p>
              </AnimateIn>
            )}

            <AnimateIn variant="fade-left" delay={500} duration={700}>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                {hero.cta_primary_text && hero.cta_primary_href && (
                  <Link
                    href={hero.cta_primary_href}
                    className="flex items-center justify-center rounded-full h-12 px-8 bg-[#016936] text-white text-base font-bold transition-all hover:shadow-lg hover:shadow-[#016936]/30 hover:scale-[1.03]"
                  >
                    {hero.cta_primary_text}
                  </Link>
                )}
                {hero.cta_secondary_text && hero.cta_secondary_href && (
                  <Link
                    href={hero.cta_secondary_href}
                    className="flex items-center justify-center rounded-full h-12 px-8 bg-transparent text-slate-900 border border-slate-300 text-base font-bold transition-all hover:bg-slate-100"
                  >
                    {hero.cta_secondary_text}
                  </Link>
                )}
              </div>
            </AnimateIn>
          </div>

          {/* Stats column */}
          <div className="mt-16 lg:mt-0 grid grid-cols-1 gap-5 w-full lg:w-[340px] shrink-0">
            {stats.map((stat, i) => (
              <AnimateIn
                key={stat.label}
                variant="fade-left"
                delay={300 + i * 120}
                duration={650}
              >
                <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-3xl font-black text-[#016936] leading-none">
                    {stat.value}
                  </span>
                  <span className="text-slate-600 text-sm font-semibold leading-snug">
                    {stat.label}
                  </span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="px-6 md:px-20 py-20 bg-slate-50">
        <AnimateIn variant="fade-up" threshold={0.15}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[#016936] text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {operations.heading}
            </h2>
            <div className="w-16 h-1 bg-[#0df20d] rounded-full mb-8" />
            <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium space-y-6">
              {operations.body?.split('\n\n').map((para, i) => (
                <span key={i}>
                  {para}
                  {i < (operations.body?.split('\n\n').length ?? 1) - 1 && <><br /><br /></>}
                </span>
              )) || operations.body}
            </p>
          </div>
        </AnimateIn>
      </section>

      {/* ── Our Journey / Timeline (ladder) ── */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <AnimateIn variant="fade-up" threshold={0.15}>
          <div className="text-center mb-16 flex flex-col items-center">
            <AnimateIn variant="zoom" delay={50} duration={600}>
              <div className="group text-center">
                <h2 className="text-[#016936] text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 transform transition-transform hover:scale-105">
                  {timelineHeading}
                </h2>
                <div className="mx-auto w-16 h-1 bg-[#016936] rounded-full transition-transform duration-300 transform origin-center group-hover:scale-x-[2.5]" />
              </div>
            </AnimateIn>
          </div>
        </AnimateIn>

        <div className="relative flex flex-col gap-8 max-w-3xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-[27px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-[#016936] via-[#016936]/40 to-transparent hidden md:block" />

          {milestones.map((milestone, i) => {
            const indentClass = ["ml-0", "ml-0 md:ml-10", "ml-0 md:ml-20"][i % 3] ?? "ml-0";
            return (
              <AnimateIn
                key={milestone.year}
                variant="fade-left"
                delay={i * 180}
                duration={650}
                threshold={0.15}
              >
                <div className={`group relative flex items-start gap-6 ${indentClass}`}>
                  {/* Year bubble */}
                  <div className="shrink-0 relative z-10 flex items-center justify-center size-14 rounded-full border-2 border-[#016936] bg-white text-[#016936] font-black text-[11px] tracking-widest shadow-sm transition-all duration-300 group-hover:bg-[#016936] group-hover:text-white group-hover:shadow-lg leading-tight text-center">
                    {milestone.year}
                  </div>

                  {/* Card */}
                  <div className="flex-1 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm
                    transition-all duration-300
                    group-hover:border-[#016936]/60
                    group-hover:shadow-[0_8px_40px_rgba(1,105,54,0.12)]
                    group-hover:-translate-y-1
                  ">
                    {/* Tag row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#016936] bg-[#016936]/10 px-3 py-1 rounded-full border border-[#016936]/20">
                        {milestone.year}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-slate-900 text-xl font-extrabold leading-tight tracking-tight">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>

                    {/* Bottom bar that grows on hover */}
                    <div className="h-0.5 w-0 bg-[#016936] rounded-full transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="px-6 md:px-20 py-20 bg-slate-50">
        <AnimateIn variant="fade-up" threshold={0.15}>
          <div className="mb-12">
            <h2 className="text-slate-900 text-3xl font-black tracking-tight md:text-4xl mb-4">
              {valuesHeading}
            </h2>
            <div className="w-20 h-1 bg-[#0df20d] rounded-full" />
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueItems.map((item, i) => {
            const Icon = iconMap[item.icon] ?? MdEco;
            return (
              <AnimateIn
                key={item.title}
                variant="fade-up"
                delay={i * 110}
                duration={600}
                threshold={0.1}
              >
                <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[#0df20d]/10 hover:border-[#0df20d]/40 hover:shadow-xl hover:-translate-y-1 transition-all h-full">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-[#0df20d]/10 text-[#0ac20a] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="text-2xl" />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <h3 className="text-slate-900 text-lg font-extrabold leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="h-0.5 w-0 bg-[#0df20d] rounded-full transition-all duration-500 group-hover:w-full" />
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* ── Key People ── */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <AnimateIn variant="fade-up" threshold={0.15}>
          <div className="mb-12">
            <h2 className="text-slate-900 text-3xl font-black tracking-tight md:text-4xl mb-4">
              {peopleHeading}
            </h2>
            <div className="w-20 h-1 bg-[#0df20d] rounded-full" />
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((person, i) => (
            <AnimateIn
              key={person.name}
              variant="fade-up"
              delay={i * 130}
              duration={600}
              threshold={0.1}
            >
              <div className="group flex flex-col gap-5 p-6 rounded-2xl bg-white border border-[#0df20d]/10 hover:border-[#0df20d]/40 hover:shadow-xl hover:-translate-y-1 transition-all h-full">
                {/* Avatar placeholder */}
                <div className="flex items-center justify-center size-16 rounded-2xl bg-[#016936]/10 text-[#016936] transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <MdPerson className="text-3xl" />
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <h3 className="text-slate-900 text-lg font-extrabold leading-tight">
                    {person.name}
                  </h3>
                  <p className="text-[#016936] text-xs font-bold uppercase tracking-widest">
                    {person.role}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2">
                    {person.bio}
                  </p>
                </div>

                <div className="h-0.5 w-0 bg-[#0df20d] rounded-full transition-all duration-500 group-hover:w-full" />
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="mx-6 md:mx-20 mb-16 mt-4 rounded-2xl bg-[#0df20d]/10 border border-[#0df20d]/20 py-16 px-8 md:px-16">
        <AnimateIn variant="fade-up" threshold={0.2}>
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="text-slate-900 text-3xl md:text-5xl font-black leading-tight">
              {ctaBanner.heading}
            </h2>
            <p className="text-slate-700 text-base md:text-lg font-medium">
              {ctaBanner.subtitle}
            </p>
            <Link
              href={ctaBanner.cta_href ?? "/contact"}
              className="flex items-center justify-center rounded-full h-14 px-10 bg-[#0df20d] text-[#102210] text-lg font-bold shadow-lg hover:shadow-[#0df20d]/30 transition-all hover:scale-105"
            >
              {ctaBanner.cta_text}
            </Link>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
