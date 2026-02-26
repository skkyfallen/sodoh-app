import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import CorePillars from "@/components/sections/CorePillars";
import Stats from "@/components/sections/Stats";
import Testimonial from "@/components/sections/Testimonial";
import {
  getPageContent,
  getStats,
  getPillars,
  getTestimonials,
} from "@/lib/data";
import type { HeroContent, AnnouncementContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Sodoh Nigeria Limited — Premium Nigerian Agricultural Produce",
  description:
    "Sodoh Nigeria Limited cultivates a greener future for Nigeria through sustainable farming, premium produce, and community partnership.",
  openGraph: {
    title: "Sodoh Nigeria Limited — Premium Nigerian Agricultural Produce",
    description:
      "Sustainable farming, premium organic produce, and community-focused growth across Nigeria.",
    type: "website",
  },
};

export default async function HomePage() {
  const [content, stats, pillars, testimonials] = await Promise.all([
    getPageContent("home"),
    getStats(),
    getPillars(),
    getTestimonials(),
  ]);

  const hero = (content.hero ?? {}) as HeroContent;
  const announcement = (content.announcement ?? null) as AnnouncementContent | null;

  return (
    <>
      <Hero hero={hero} announcement={announcement} stats={stats} />
      <CorePillars pillars={pillars} />
      <Stats stats={stats} />
      <Testimonial testimonials={testimonials} />
    </>
  );
}
