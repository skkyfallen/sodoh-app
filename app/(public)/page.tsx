import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import CorePillars from "@/components/sections/CorePillars";
import Stats from "@/components/sections/Stats";
import Testimonial from "@/components/sections/Testimonial";

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

export default function HomePage() {
  return (
    <>
      <Hero />
      <CorePillars />
      <Stats />
      <Testimonial />
    </>
  );
}
