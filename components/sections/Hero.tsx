import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import type { HeroContent, AnnouncementContent, Stat } from "@/types/content";

type Props = {
  hero: HeroContent;
  announcement?: AnnouncementContent | null;
  stats: Stat[];
};

export default function Hero({ hero, announcement, stats }: Props) {
  /** Give the editable hero phrase a quiet brand-colour emphasis. */
  const renderTitle = () => {
    const word = hero.highlight_word;
    if (!word || !hero.title.includes(word)) {
      return <>{hero.title}</>;
    }
    const idx = hero.title.indexOf(word);
    const before = hero.title.slice(0, idx);
    const after = hero.title.slice(idx + word.length);
    return (
      <>
        {before}
        <span className="text-[#016936]">{word}</span>
        {after}
      </>
    );
  };

  return (
    <>
      {/* Announcement bar */}
      {announcement && (
        <div className="w-full bg-[#e6f9e6] border-b border-[#cdeccc] px-4 py-2.5 text-center text-sm text-[#016936] font-semibold">
          {announcement.text}{" "}
          {announcement.link_text && announcement.link_href && (
            <Link
              href={announcement.link_href}
              className="underline underline-offset-2 font-bold hover:text-[#016936] transition-colors"
            >
              {announcement.link_text}
            </Link>
          )}
        </div>
      )}

      {/* Editorial hero — real field photography, spacious copy, and a low-key proof strip. */}
      <section className="relative overflow-hidden bg-[#f7f7ef] px-5 pb-12 pt-14 sm:px-8 md:px-12 md:pt-20 lg:px-16 lg:pb-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
            <div className="relative z-10 max-w-2xl py-4 lg:py-10">
              {hero.badge && (
                <AnimateIn variant="fade-up" duration={550}>
                  <p className="mb-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">
                    <span className="h-px w-9 bg-[#016936]" />{hero.badge}
                  </p>
                </AnimateIn>
              )}

              <AnimateIn variant="fade-up" delay={80} duration={650}>
                <h1 className="max-w-[13ch] text-[clamp(2.9rem,6.1vw,5.8rem)] font-semibold leading-[0.99] tracking-[-0.055em] text-[#17241d]">
                  {renderTitle()}
                </h1>
              </AnimateIn>

              {hero.subtitle && (
                <AnimateIn variant="fade-up" delay={150} duration={650}>
                  <p className="mt-7 max-w-xl text-base leading-7 text-[#4b5c50] md:text-lg md:leading-8">
                    {hero.subtitle}
                  </p>
                </AnimateIn>
              )}

              <AnimateIn variant="fade-up" delay={220} duration={650}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  {hero.cta_primary_text && hero.cta_primary_href && (
                    <Link href={hero.cta_primary_href} className="inline-flex min-h-12 items-center justify-center bg-[#016936] px-6 text-sm font-bold text-white transition-colors hover:bg-[#014e29]">
                      {hero.cta_primary_text}<span aria-hidden="true" className="ml-5 text-lg">↗</span>
                    </Link>
                  )}
                  {hero.cta_secondary_text && hero.cta_secondary_href && (
                    <Link href={hero.cta_secondary_href} className="inline-flex min-h-12 items-center justify-center border border-[#b7c5b9] px-6 text-sm font-bold text-[#17241d] transition-colors hover:border-[#016936] hover:text-[#016936]">
                      {hero.cta_secondary_text}
                    </Link>
                  )}
                </div>
              </AnimateIn>

              <div className="mt-14 hidden border-t border-[#d9dfd7] pt-5 sm:grid sm:grid-cols-2 sm:gap-6">
                {stats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-3">
                    <span className="display-font text-2xl font-semibold tracking-tight text-[#016936]">{stat.value}</span>
                    <span className="text-xs font-medium leading-5 text-[#526157]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <AnimateIn variant="fade" delay={120} duration={800}>
              <figure className="relative min-h-[390px] overflow-hidden rounded-3xl bg-[#d6ddcb] sm:min-h-[500px] lg:min-h-[660px]">
                <Image
                  src="/images/nigerian-growing-fields.jpg"
                  alt="A sunlit field of crops ready for harvest"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102210]/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 flex w-full items-end justify-between gap-6 p-6 text-white sm:p-9">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">From farm to market</p>
                    <p className="display-font mt-2 max-w-xs text-2xl font-medium leading-tight sm:text-3xl">Good food starts with good ground.</p>
                  </div>
                  <span aria-hidden="true" className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-white/50 text-xl sm:flex">↗</span>
                </figcaption>
              </figure>
            </AnimateIn>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#d9dfd7] pt-5 sm:hidden">
            {stats.slice(0, 2).map((stat) => (
              <div key={stat.label}>
                <span className="display-font text-2xl font-semibold text-[#016936]">{stat.value}</span>
                <p className="mt-1 text-xs leading-5 text-[#526157]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
