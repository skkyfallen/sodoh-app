import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import { MdFormatQuote } from "react-icons/md";
import type { Testimonial as TestimonialType } from "@/types/content";

type Props = { testimonials: TestimonialType[] };

export default function Testimonial({ testimonials }: Props) {
  if (!testimonials.length) return null;
  const testimonial = testimonials[0];

  return (
    <section className="bg-[#f3f2e9] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.42fr_1.58fr] lg:gap-20">
        <AnimateIn variant="fade-up" className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">A partner’s perspective</p>
            <MdFormatQuote aria-hidden="true" className="mt-10 text-6xl text-[#016936]/35" />
          </div>
          {testimonial.author_image ? (
            <div className="relative mt-8 hidden aspect-[4/5] overflow-hidden bg-[#d8dfd3] lg:block">
              <Image
                src={testimonial.author_image}
                alt={`${testimonial.author_name}${testimonial.author_role ? `, ${testimonial.author_role}` : ""}`}
                fill
                sizes="(max-width: 1024px) 0px, 300px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="mt-8 hidden border-l-2 border-[#0df20d] pl-4 text-sm leading-6 text-[#59685d] lg:block">
              Built through lasting relationships with growers and buyers.
            </div>
          )}
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} duration={700}>
          <blockquote className="display-font max-w-4xl text-[clamp(1.9rem,4vw,3.8rem)] font-medium leading-[1.14] tracking-[-0.04em] text-[#17241d]">
            “{testimonial.quote}”
          </blockquote>
          <div className="mt-10 flex items-center gap-4 border-t border-[#d4d8cd] pt-6">
            {testimonial.author_image && (
              <div className="relative size-12 overflow-hidden rounded-full bg-[#d8dfd3] lg:hidden">
                <Image src={testimonial.author_image} alt="" fill sizes="48px" className="object-cover" />
              </div>
            )}
            <div>
              <p className="font-semibold text-[#17241d]">{testimonial.author_name}</p>
              {testimonial.author_role && <p className="mt-1 text-sm text-[#59685d]">{testimonial.author_role}</p>}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
