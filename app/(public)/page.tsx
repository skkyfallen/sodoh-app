/*
THESIS: Show the route from Nigerian produce to a buyer, not a generic sustainability promise or invented proof strip.
OWN-WORLD: Brand green, field-light surfaces, real crop photography, open rows, and one soft image crop; keep the admin quieter.
STORY: Visitors understand what Sodoh offers, browse real catalogue entries, and choose a clear enquiry path.
FIRST VIEWPORT: A left-aligned, two-line value statement and visible actions sit beside a large produce photograph; no metrics share the hero.
FORM: Photo-led editorial split, chosen directly from the user-pinned organic direction; a single hero-image reveal supplies the memorable moment.
*/
import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import CorePillars from "@/components/sections/CorePillars";
import FeaturedProduce from "@/components/sections/FeaturedProduce";
import Stats from "@/components/sections/Stats";
import Testimonial from "@/components/sections/Testimonial";
import {
  getPageContent,
  getProducts,
  getPillars,
  getStats,
  getTestimonials,
} from "@/lib/data";
import type { HeroContent, AnnouncementContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Sodoh Nigeria Limited — Agricultural Produce",
  description:
    "Explore agricultural produce from Sodoh Nigeria Limited and contact the team to discuss your sourcing needs.",
  openGraph: {
    title: "Sodoh Nigeria Limited — Agricultural Produce",
    description: "Explore agricultural produce from Sodoh Nigeria Limited.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [content, products, pillars, stats, testimonials] = await Promise.all([
    getPageContent("home"),
    getProducts(),
    getPillars(),
    getStats(),
    getTestimonials(),
  ]);

  const storedHero = (content.hero ?? {}) as HeroContent & { public_reviewed?: boolean };
  const safeHero: HeroContent = {
    title: "Nigerian produce for your market",
    subtitle: "Explore the current catalogue and contact our team to discuss product availability and supply requirements.",
    cta_primary_text: "View products",
    cta_primary_href: "/products",
    cta_secondary_text: "Contact us",
    cta_secondary_href: "/contact",
  };
  const hero = storedHero.public_reviewed
    ? { ...safeHero, ...storedHero, title: storedHero.title || safeHero.title }
    : safeHero;
  const storedAnnouncement = (content.announcement ?? null) as (AnnouncementContent & { public_reviewed?: boolean }) | null;
  const announcement = storedAnnouncement?.public_reviewed ? storedAnnouncement : null;

  return (
    <>
      <Hero hero={hero} announcement={announcement} />
      <FeaturedProduce products={products.filter((product) => product.public_reviewed)} />
      <CorePillars pillars={pillars} />
      <Stats stats={stats.filter((stat) => stat.public_reviewed)} />
      <Testimonial testimonials={testimonials.filter((testimonial) => testimonial.public_reviewed)} />
      <section className="bg-[#0d2b1c] px-5 py-14 text-white sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="display-font max-w-[16ch] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl [text-wrap:balance]">Looking for a specific product?</h2>
            <p className="mt-3 max-w-[58ch] text-sm leading-6 text-white/90">Tell us what you need and our team can help with the next step.</p>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#064e3b] transition-transform hover:-translate-y-px active:translate-y-0">Talk to our team</Link>
        </div>
      </section>
    </>
  );
}
