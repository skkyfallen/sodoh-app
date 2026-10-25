import AnimateIn from "@/components/ui/AnimateIn";
import type { FAQ as FAQType } from "@/types/content";

type Props = { faqs: FAQType[] };

export default function FAQ({ faqs }: Props) {
  if (!faqs.length) return null;

  return (
    <section className="bg-[#f7f7ef] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
        <AnimateIn variant="fade-up">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">Answers</p>
          <h2 className="display-font max-w-[10ch] text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#17241d] md:text-5xl">Frequently asked questions</h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#59685d]">Can’t find what you need? Send a note to our team and we’ll point you in the right direction.</p>
        </AnimateIn>
        <div className="divide-y divide-[#d9e1da] border-y border-[#d9e1da]">
          {faqs.map((faq, i) => (
            <AnimateIn key={faq.id} variant="fade-up" delay={Math.min(i, 5) * 45} duration={450}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-left marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-semibold leading-6 text-[#17241d] md:text-lg">{faq.question}</span>
                  <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center border border-[#cbd5cb] text-[#016936] transition-colors group-open:border-[#016936] group-open:bg-[#016936] group-open:text-white">+</span>
                </summary>
                <p className="max-w-3xl pt-4 pr-10 text-sm leading-6 text-[#59685d]">{faq.answer}</p>
              </details>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
