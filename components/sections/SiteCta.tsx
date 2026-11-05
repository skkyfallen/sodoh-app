import AnimateIn from "@/components/ui/AnimateIn";
import SodohCtaButton from "./SodohCtaButton";
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
            <SodohCtaButton href={safeHref(ctaHref, "/contact")} variant="primary">
              {ctaText}
              <span aria-hidden="true">→</span>
            </SodohCtaButton>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
