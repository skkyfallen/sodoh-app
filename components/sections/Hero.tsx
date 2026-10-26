import Link from "next/link";
import Image from "next/image";
import type { HeroContent, AnnouncementContent } from "@/types/content";
import { safeHref } from "@/lib/utils";

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
            <Link href={safeHref(announcement.link_href, "/products")} className="font-semibold text-[var(--brand)] underline decoration-[var(--brand)] underline-offset-4 hover:text-[var(--brand-hover)]">
              {announcement.link_text}
            </Link>
          )}
        </div>
      )}

      <section className="field-paper overflow-hidden px-5 pb-20 pt-16 sm:px-8 md:px-12 md:pb-28 md:pt-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="hero-copy">
            <h1 className="display-font max-w-[20ch] text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--ink)] [text-wrap:balance]">
              {hero.title}
            </h1>
            <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              {hero.subtitle && (
                <p className="measure text-base leading-7 text-[var(--body)] md:text-lg md:leading-8">
                  {hero.subtitle}
                </p>
              )}
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                {hero.cta_primary_text && hero.cta_primary_href && (
                  <Link href={safeHref(hero.cta_primary_href, "/products")} className="pressable inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[var(--brand)] px-7 text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(1,105,54,0.18)] hover:bg-[var(--brand-hover)] dark:text-[#062a17]">
                    {hero.cta_primary_text}
                    <span aria-hidden="true" className="ml-2">→</span>
                  </Link>
                )}
                {hero.cta_secondary_text && hero.cta_secondary_href && (
                  <Link href={safeHref(hero.cta_secondary_href, "/contact")} className="pressable inline-flex min-h-12 items-center justify-center rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)]/60 px-7 text-[15px] font-semibold text-[var(--ink)] hover:border-[var(--brand)] hover:bg-[var(--surface-soft)]">
                    {hero.cta_secondary_text}
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-10 flex items-center gap-4 border-t border-[var(--border)] pt-5 text-[13px] text-[var(--muted)]">
              <span className="font-semibold text-[var(--ink)]">Direct enquiries</span>
              <span aria-hidden="true" className="h-4 w-px bg-[var(--border)]" />
              <span>Catalogue-led · No checkout · Team replies</span>
            </div>
          </div>

          <figure className="hero-photo media-zoom relative mt-10 min-h-[300px] overflow-hidden rounded-[24px_72px_24px_24px] bg-[var(--surface-muted)] shadow-[var(--shadow-lift)] sm:min-h-[420px] lg:min-h-[min(62vh,560px)]">
            <Image
              src="/images/farmers-harvest.jpg"
              alt="Fresh vegetables arranged for market"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#092418]/60 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 max-w-xs rounded-full bg-[#071a10]/70 px-4 py-2 text-[13px] font-medium leading-5 text-white backdrop-blur-sm">
              Representative agricultural photography
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
