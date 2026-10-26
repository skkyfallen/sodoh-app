import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";

/**
 * Brand introduction set directly over full-bleed photography.
 * A solid dark-green scrim carries the legibility (no glass, no gradient
 * text); the image keeps its natural crop via object-cover.
 */
export function HomeIntro() {
  return (
    <section className="relative overflow-hidden bg-[#071a10] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div aria-hidden="true" className="absolute inset-0">
        <picture className="absolute inset-0">
          <source
            media="(max-width: 767px)"
            srcSet="/images/nigerian-growing-fields-mobile.jpg"
          />
          <Image
            src="/images/nigerian-growing-fields.jpg"
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </picture>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[#071a10]/80" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="max-w-[46rem]">
          <AnimateIn>
            <h2 className="display-font max-w-[16ch] text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.0] tracking-[-0.045em] text-white [text-wrap:balance]">
              Produce from Nigeria, sourced through conversation.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-white/90 md:text-xl md:leading-9">
              Sodoh Nigeria Limited works with buyers looking for Nigerian agricultural
              produce. Browse the catalogue, send a request on any listing, and agree
              the details directly with our team.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.18}>
            <Link href="/about" className="link-arrow mt-8 inline-flex min-h-11 items-center text-[15px] font-semibold text-[#a7f3d0] underline decoration-white/40 underline-offset-4 hover:text-white">
              About Sodoh <span aria-hidden="true" className="arrow">→</span>
            </Link>
          </AnimateIn>
          <p className="mt-10 text-[13px] text-white/70">Representative agricultural photography</p>
        </div>
      </div>
    </section>
  );
}
