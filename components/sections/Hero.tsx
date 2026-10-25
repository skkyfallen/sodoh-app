import Link from "next/link";
import Image from "next/image";
import type { HeroContent, AnnouncementContent } from "@/types/content";

type Props = {
  hero: HeroContent;
  announcement?: AnnouncementContent | null;
};

export default function Hero({ hero, announcement }: Props) {
  return (
    <>
      {announcement && (
        <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-center text-sm text-[var(--ink)] sm:px-8">
          <span>{announcement.text}</span>{" "}
          {announcement.link_text && announcement.link_href && (
            <Link href={announcement.link_href} className="font-semibold text-[var(--brand)] underline decoration-[var(--brand)] underline-offset-4 hover:text-[var(--brand-hover)]">
              {announcement.link_text}
            </Link>
          )}
        </div>
      )}

      <section className="overflow-hidden bg-[var(--page)] px-5 pb-16 pt-9 sm:px-8 sm:pt-12 md:px-12 md:pb-20 lg:px-16 lg:pt-14">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative z-10 py-3 lg:py-8">
            <h1 className="display-font max-w-[14ch] text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="mt-6 max-w-[60ch] text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">
                {hero.subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {hero.cta_primary_text && hero.cta_primary_href && (
                <Link href={hero.cta_primary_href} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(1,105,54,0.14)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--brand-hover)] active:translate-y-0 dark:text-[#062a17]">
                  {hero.cta_primary_text}
                </Link>
              )}
              {hero.cta_secondary_text && hero.cta_secondary_href && (
                <Link href={hero.cta_secondary_href} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] px-6 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)] hover:border-[var(--brand)]">
                  {hero.cta_secondary_text}
                </Link>
              )}
            </div>
          </div>

          <figure className="hero-photo relative min-h-[330px] overflow-hidden rounded-[24px_72px_24px_24px] bg-[var(--surface-muted)] sm:min-h-[450px] lg:min-h-[min(68vh,590px)]">
            <Image
              src="/images/farmers-harvest.jpg"
              alt="Fresh vegetables arranged for market"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#092418]/55 via-transparent to-transparent" />
            <figcaption className="absolute bottom-0 left-0 max-w-xs p-5 text-sm leading-6 text-white sm:p-7">
              Representative agricultural photography
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
