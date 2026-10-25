import AnimateIn from "@/components/ui/AnimateIn";
import Link from "next/link";
import type { FAQ as FAQType } from "@/types/content";

type Props = { faqs: FAQType[] };

export default function FAQ({ faqs }: Props) {
  if (!faqs.length) return null;

  return (
    <section className="bg-[var(--surface-soft)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-9 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
        <AnimateIn>
          <h2 className="display-font max-w-[11ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] md:text-5xl [text-wrap:balance]">
            Questions before you get in touch?
          </h2>
          <p className="mt-5 max-w-[38ch] text-sm leading-6 text-[var(--body)]">
            If you need something else, send a note to our team.
          </p>
          <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--brand)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--brand-hover)]">
            Contact us
          </Link>
        </AnimateIn>
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {faqs.map((faq) => (
            <AnimateIn key={faq.id}>
              <details className="group py-5">
                <summary className="flex min-h-11 list-none items-center justify-between gap-5 text-left marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-semibold leading-6 text-[var(--ink)] md:text-lg">{faq.question}</span>
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-xl font-normal text-[var(--brand)] transition-colors group-open:bg-[var(--brand)] group-open:text-white dark:group-open:text-[#062a17]">
                    <span className="transition-transform duration-200 group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="max-w-[70ch] pb-1 pt-3 pr-8 text-sm leading-6 text-[var(--body)]">{faq.answer}</p>
              </details>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
