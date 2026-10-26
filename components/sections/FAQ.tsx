import AnimateIn from "@/components/ui/AnimateIn";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import type { FAQ as FAQType } from "@/types/content";

type Props = { faqs: FAQType[] };

export default function FAQ({ faqs }: Props) {
  if (!faqs.length) return null;

  return (
    <section className="bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
        <AnimateIn>
          <h2 className="display-font max-w-[11ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">
            Questions before you get in touch?
          </h2>
          <p className="mt-5 max-w-[38ch] text-[15px] leading-7 text-[var(--body)]">
            If you need something else, send a note to our team.
          </p>
          <Link href="/contact" className="link-arrow mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--brand)] underline decoration-[var(--border-strong)] underline-offset-4 hover:text-[var(--brand-hover)]">
            Contact us <span aria-hidden="true" className="arrow">→</span>
          </Link>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <Accordion items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
        </AnimateIn>
      </div>
    </section>
  );
}
