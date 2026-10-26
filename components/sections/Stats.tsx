import AnimateIn from "@/components/ui/AnimateIn";
import type { Stat } from "@/types/content";

type Props = { stats: Stat[] };

/** Render only metrics supplied by the content source; never fill missing proof with demo figures. */
export default function Stats({ stats }: Props) {
  if (!stats.length) return null;

  return (
    <section aria-label="Sodoh Nigeria in numbers" className="bg-[#0c2418] px-5 py-20 text-white sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-start md:gap-12">
        <AnimateIn>
          <h2 className="display-font max-w-[14ch] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
            Sodoh, at a glance
          </h2>
          <p className="mt-4 max-w-[36ch] text-sm leading-6 text-white/70">
            Figures shown here come from reviewed site content only.
          </p>
        </AnimateIn>
        <div>
          {stats.map((stat, index) => (
            <AnimateIn key={stat.id} delay={index * 0.08}>
              <div className="grid gap-1 border-t border-white/15 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(10rem,0.5fr)_1fr] sm:items-baseline sm:gap-8">
                <span className="display-font text-4xl font-semibold tracking-[-0.04em] text-[#a7f3d0] sm:text-5xl">
                  {stat.value}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-6 text-white">{stat.label}</p>
                  {stat.sub && <p className="mt-1 max-w-[44ch] text-sm leading-6 text-white/70">{stat.sub}</p>}
                </div>
              </div>
            </AnimateIn>
          ))}
          <div aria-hidden="true" className="border-t border-white/15" />
        </div>
      </div>
    </section>
  );
}
