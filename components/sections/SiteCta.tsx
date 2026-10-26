import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { safeHref } from "@/lib/utils";

type Props = {
  heading: string;
  body: string;
  ctaText: string;
  ctaHref: string;
};

export function SiteCta({ heading, body, ctaText, ctaHref }: Props) {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <AnimateIn>
          <h2 className="display-font max-w-[20ch] text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--ink)] [text-wrap:balance]">
            {heading}
          </h2>
        </AnimateIn>
        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <AnimateIn delay={0.1}>
            <p className="measure text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">{body}</p>
          </AnimateIn>
          <AnimateIn delay={0.18} className="shrink-0">
            <Link
              href={safeHref(ctaHref, "/contact")}
              className="pressable inline-flex min-h-13 items-center justify-center gap-2 rounded-[14px] bg-[var(--brand)] px-8 py-4 text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(1,105,54,0.18)] hover:bg-[var(--brand-hover)] dark:text-[#062a17]"
            >
              {ctaText}
              <span aria-hidden="true">→</span>
            </Link>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
