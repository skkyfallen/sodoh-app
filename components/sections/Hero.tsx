import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import StatsStack from "@/components/ui/StatsStack";
import type { HeroContent, AnnouncementContent, Stat } from "@/types/content";

type Props = {
  hero: HeroContent;
  announcement?: AnnouncementContent | null;
  stats: Stat[];
};

export default function Hero({ hero, announcement, stats }: Props) {
  /** Split title around highlight_word so we can wrap it in the skewed badge */
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
        <span className="relative inline-block">
          <span className="relative z-10 text-white px-2">{word}</span>
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[#016936] rounded-md -skew-x-2"
          />
        </span>{" "}
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

      {/* Hero — two-column layout */}
      <section className="bg-white px-6 pt-20 pb-24 md:px-20 md:pt-28 md:pb-32 flex items-center">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* Left column — text */}
          <div className="flex-1 flex flex-col items-start">

            {hero.badge && (
              <AnimateIn variant="fade-left" delay={80} duration={700}>
                <div className="border-l-4 border-[#016936] pl-3 mb-8">
                  <span className="text-[#016936] text-xs font-bold uppercase tracking-widest">
                    {hero.badge}
                  </span>
                </div>
              </AnimateIn>
            )}

            <AnimateIn variant="fade-left" delay={200} duration={700}>
              <h1 className="text-slate-900 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl max-w-[90vw] lg:max-w-none">
                {renderTitle()}
              </h1>
            </AnimateIn>

            {hero.subtitle && (
              <AnimateIn variant="fade-left" delay={360} duration={700}>
                <p className="text-slate-800 font-semibold text-base md:text-lg leading-relaxed max-w-[95vw] lg:max-w-[60vw] mt-7">
                  {hero.subtitle}
                </p>
              </AnimateIn>
            )}

            <AnimateIn variant="fade-left" delay={500} duration={700}>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                {hero.cta_primary_text && hero.cta_primary_href && (
                  <Link
                    href={hero.cta_primary_href}
                    className="flex items-center justify-center rounded-full h-12 px-8 bg-[#016936] text-white text-base font-bold transition-all hover:shadow-lg hover:shadow-[#016936]/30 hover:scale-[1.03]"
                  >
                    {hero.cta_primary_text}
                  </Link>
                )}
                {hero.cta_secondary_text && hero.cta_secondary_href && (
                  <Link
                    href={hero.cta_secondary_href}
                    className="flex items-center justify-center rounded-full h-12 px-8 bg-transparent text-slate-900 border border-slate-300 text-base font-bold transition-all hover:bg-slate-100"
                  >
                    {hero.cta_secondary_text}
                  </Link>
                )}
              </div>
            </AnimateIn>
          </div>

          {/* Right column — interactive stacked cards */}
          <AnimateIn variant="fade-left" delay={300} duration={700}>
            <StatsStack stats={stats} />
          </AnimateIn>

        </div>
      </section>
    </>
  );
}
