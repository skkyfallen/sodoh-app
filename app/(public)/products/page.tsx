import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  MdEco,
  MdGrass,
  MdSpa,
  MdLocalCafe,
  MdOpacity,
  MdDinnerDining,
} from "react-icons/md";

export const metadata: Metadata = {
  title: "Our Products — Sodoh Nigeria Limited",
  description:
    "Explore Sodoh Nigeria Limited's premium agricultural produce — from cassava and maize to cocoa, ginger, palm oil, and yam sourced across Nigeria.",
  openGraph: {
    title: "Our Products — Sodoh Nigeria Limited",
    description:
      "Premium quality agricultural produce sourced sustainably from across Nigeria.",
    type: "website",
  },
};

const products = [
  {
    Icon: MdEco,
    title: "Cassava Tubers",
    region: "South-Western Nigeria",
    description:
      "Premium quality cassava harvested from nutrient-rich soils, ideal for starch, flour, and garri production.",
    image:
      "https://images.unsplash.com/photo-1596711739829-37315582c031?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Fresh Cassava Tubers",
  },
  {
    Icon: MdGrass,
    title: "Yellow Maize",
    region: "Middle Belt Region",
    description:
      "High-energy yellow maize dried to perfection, sourced directly from our partner farms in the Middle Belt.",
    image:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Yellow Maize kernels",
  },
  {
    Icon: MdSpa,
    title: "Fresh Ginger",
    region: "Kaduna State",
    description:
      "Aromatic and spicy ginger roots cleaned and processed to meet international export standards.",
    image:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Fresh Ginger roots",
  },
  {
    Icon: MdLocalCafe,
    title: "Cocoa Beans",
    region: "Ondo State",
    description:
      "Grade-A cocoa beans fermented and sun-dried in the traditional way from the lush forests of Ondo State.",
    image:
      "https://images.unsplash.com/photo-1589227365423-d98601614838?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Dried Cocoa Beans",
  },
  {
    Icon: MdOpacity,
    title: "Palm Oil",
    region: "Edo State",
    description:
      "Unadulterated, cholesterol-free red palm oil extracted from fresh fruit bunches in the heart of Edo State.",
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Pure Red Palm Oil",
  },
  {
    Icon: MdDinnerDining,
    title: "Yam Tubers",
    region: "Benue Valley",
    description:
      "Large, firm, and starchy Puna yam tubers sourced from the Benue valley — the food basket of the nation.",
    image:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Large Yam Tubers",
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero — matches landing & contact page hero pattern */}
      <section className="relative px-4 py-8 md:px-20 md:py-12">
        <div className="overflow-hidden rounded-xl shadow-2xl">
          <div className="relative min-h-[500px] md:min-h-[640px] bg-slate-900">
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, #0df20d20 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            {/* Content */}
            <div className="relative z-10 flex flex-col gap-6 items-start justify-center px-6 md:px-16 min-h-[500px] md:min-h-[640px]">
              <div className="flex flex-col gap-4 max-w-2xl">
                <AnimateIn variant="fade-down" delay={100} duration={700}>
                  <span className="bg-[#0df20d]/20 text-[#0df20d] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest w-fit border border-[#0df20d]/30">
                    Sourced Across Nigeria
                  </span>
                </AnimateIn>
                <AnimateIn variant="fade-up" delay={250} duration={700}>
                  <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                    Our Premium Produce
                  </h1>
                </AnimateIn>
                <AnimateIn variant="fade-up" delay={400} duration={700}>
                  <p className="text-white/90 text-base md:text-lg font-normal leading-relaxed">
                    Sourcing the finest agricultural products from across Nigeria.
                    We provide high-quality, sustainably grown produce for local
                    and international markets.
                  </p>
                </AnimateIn>
                <AnimateIn variant="fade-up" delay={550} duration={700}>
                  <Link
                    href="/contact"
                    className="flex w-fit cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-[#0df20d] text-[#102210] text-base font-bold transition-all hover:shadow-lg hover:shadow-[#0df20d]/20"
                  >
                    Request a Quote
                  </Link>
                </AnimateIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 md:px-20 py-16">
        <AnimateIn variant="fade-up" threshold={0.2}>
          <div className="mb-12">
            <h2 className="text-slate-900 text-3xl font-black tracking-tight md:text-4xl mb-4">
              Our Agricultural Products
            </h2>
            <div className="w-20 h-1 bg-[#0df20d] rounded-full" />
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <AnimateIn
              key={product.title}
              variant="fade-up"
              delay={i * 100}
              duration={600}
              threshold={0.1}
            >
              <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[#0df20d]/10 hover:border-[#0df20d]/40 transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                {/* Icon */}
                <div className="bg-[#0df20d]/10 text-[#0ac20a] size-12 rounded-xl flex items-center justify-center shrink-0">
                  <product.Icon className="text-2xl" />
                </div>

                {/* Product image */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Copy */}
                <div className="flex flex-col flex-1 gap-2">
                  <div>
                    <h3 className="text-slate-900 text-xl font-bold leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-[#0ac20a] text-xs font-semibold mt-1">
                      {product.region}
                    </p>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">
                    {product.description}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-2 w-full py-2 text-center rounded-xl bg-slate-100 hover:bg-[#0df20d] hover:text-[#102210] transition-colors font-bold text-sm"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-6 md:mx-20 mb-16 rounded-2xl bg-[#0df20d]/10 border border-[#0df20d]/20 py-16 px-8 md:px-16">
        <AnimateIn variant="fade-up" threshold={0.2}>
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="text-slate-900 text-3xl md:text-5xl font-black leading-tight">
              Ready to source quality produce?
            </h2>
            <p className="text-slate-700 text-base md:text-lg font-medium">
              Get in touch with us for bulk orders and international export
              inquiries. We guarantee consistency and quality in every shipment.
            </p>
            <Link
              href="/contact"
              className="flex items-center justify-center rounded-full h-14 px-10 bg-[#0df20d] text-[#102210] text-lg font-bold shadow-lg hover:shadow-[#0df20d]/30 transition-all hover:scale-105"
            >
              Contact Us Now
            </Link>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
