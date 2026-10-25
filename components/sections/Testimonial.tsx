import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import type { Testimonial as TestimonialType } from "@/types/content";

type Props = { testimonials: TestimonialType[] };

/** A testimonial is shown only when a real, approved quote exists in content. */
export default function Testimonial({ testimonials }: Props) {
  if (!testimonials.length) return null;
  const testimonial = testimonials[0];

  return (
    <section className="bg-[var(--surface-soft)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[minmax(12rem,0.45fr)_1.55fr] lg:gap-16">
        <AnimateIn className="flex items-start gap-4">
          {testimonial.author_image && (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <Image src={testimonial.author_image} alt="" fill sizes="56px" className="object-cover" />
            </div>
          )}
          <div>
            <p className="font-semibold text-[var(--ink)]">{testimonial.author_name}</p>
            {testimonial.author_role && <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{testimonial.author_role}</p>}
          </div>
        </AnimateIn>
        <AnimateIn>
          <blockquote className="display-font max-w-[28ch] text-[clamp(1.8rem,3.8vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.04em] text-[var(--ink)] [text-wrap:balance]">
            “{testimonial.quote}”
          </blockquote>
        </AnimateIn>
      </div>
    </section>
  );
}
