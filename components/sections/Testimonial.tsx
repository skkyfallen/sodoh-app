import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import { safeHref } from "@/lib/utils";
import type { Testimonial as TestimonialType } from "@/types/content";

type Props = { testimonials: TestimonialType[] };

/** A testimonial is shown only when a real, approved quote exists in content. */
export default function Testimonial({ testimonials }: Props) {
  if (!testimonials.length) return null;
  const testimonial = testimonials[0];
  const authorImage = safeHref(testimonial.author_image, "");

  return (
    <section className="bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(14rem,0.45fr)_1.55fr] lg:gap-16">
        <AnimateIn variant="fade-right" className="flex items-start gap-4">
          {authorImage && (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-muted)]">
              <Image src={authorImage} alt="" fill sizes="56px" className="object-cover" />
            </div>
          )}
          <div>
            <p className="font-semibold text-[var(--ink)]">{testimonial.author_name}</p>
            {testimonial.author_role && <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{testimonial.author_role}</p>}
            <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
              Approved quote
            </p>
          </div>
        </AnimateIn>
        <AnimateIn variant="fade-left" delay={0.1}>
          <blockquote className="display-font max-w-[28ch] text-[clamp(1.8rem,3.8vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.04em] text-[var(--ink)] [text-wrap:balance]">
            <span aria-hidden="true" className="mr-1 text-[var(--brand)]">“</span>
            {testimonial.quote}
            <span aria-hidden="true" className="text-[var(--brand)]">”</span>
          </blockquote>
        </AnimateIn>
      </div>
    </section>
  );
}
