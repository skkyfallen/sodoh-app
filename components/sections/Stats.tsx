import AnimateIn from "@/components/ui/AnimateIn";
import type { Stat } from "@/types/content";

type Props = { stats: Stat[] };

/** Render only metrics supplied by the content source; never fill missing proof with demo figures. */
export default function Stats({ stats }: Props) {
  if (!stats.length) return null;

  return (
    <section aria-label="Sodoh Nigeria in numbers" className="bg-[#0d2b1c] px-5 py-14 text-white sm:px-8 md:px-12 md:py-16 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-center md:gap-12">
        <AnimateIn>
          <h2 className="display-font max-w-[14ch] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
            Sodoh, at a glance
          </h2>
        </AnimateIn>
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/25 pt-6 sm:grid-cols-3 md:border-t-0 md:pt-0">
          {stats.map((stat) => (
            <AnimateIn key={stat.id}>
              <div className="min-w-0">
                <span className="display-font text-3xl font-semibold tracking-[-0.04em] text-[#a7f3d0] sm:text-4xl">{stat.value}</span>
                <p className="mt-2 text-sm font-semibold leading-5 text-white">{stat.label}</p>
                {stat.sub && <p className="mt-1 max-w-[25ch] text-sm leading-5 text-white/80">{stat.sub}</p>}
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
