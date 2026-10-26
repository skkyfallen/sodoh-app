import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import { HomeIntro } from "@/components/sections/HomeIntro";
import CorePillars from "@/components/sections/CorePillars";
import FeaturedProduce from "@/components/sections/FeaturedProduce";
import Stats from "@/components/sections/Stats";
import Testimonial from "@/components/sections/Testimonial";
import { EnquiryRoutes } from "@/components/sections/EnquiryRoutes";
import { SiteCta } from "@/components/sections/SiteCta";
import {
  getPageContent,
  getProducts,
  getPillars,
  getStats,
  getTestimonials,
} from "@/lib/data";
import type { HeroContent, AnnouncementContent } from "@/types/content";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { defaultLocale, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Nigerian Agricultural Produce Exporter | Sodoh Nigeria Limited",
  },
  description:
    "Nigerian agricultural produce for international and local buyers, including sesame, cassava, cocoa, ginger, maize, yam, and palm oil. Request a quote from Sodoh Nigeria Limited in Abuja.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nigerian Agricultural Produce Exporter | Sodoh Nigeria Limited",
    description:
      "Nigerian agricultural produce for international and local buyers, including sesame, cassava, cocoa, ginger, maize, yam, and palm oil. Request a quote from Sodoh Nigeria Limited in Abuja.",
    url: "/",
    siteName,
    locale: defaultLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nigerian Agricultural Produce Exporter | Sodoh Nigeria Limited",
    description:
      "Nigerian agricultural produce for international and local buyers, including sesame, cassava, cocoa, ginger, maize, yam, and palm oil. Request a quote from Sodoh Nigeria Limited in Abuja.",
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
    <div className="page-enter">
      <OrganizationJsonLd />
      <Hero hero={hero} announcement={announcement} />
      <HomeIntro />
      <FeaturedProduce products={products.filter((product) => product.public_reviewed)} />
      <CorePillars pillars={pillars} />
      <Stats stats={stats.filter((stat) => stat.public_reviewed)} />
      <EnquiryRoutes />
      <Testimonial testimonials={testimonials.filter((testimonial) => testimonial.public_reviewed)} />
      <SiteCta
        heading="Looking for a specific product?"
        body="Tell us what you need and our team can help with the next step."
        ctaText="Talk to our team"
        ctaHref="/contact"
      />
    </div>
  );
}
