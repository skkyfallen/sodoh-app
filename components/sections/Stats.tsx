import AnimateIn from "@/components/ui/AnimateIn";
import type { Stat } from "@/types/content";

type Props = { stats: Stat[] };

export default function Stats({ stats }: Props) {
  if (!stats.length) return null;

  return (
    <section aria-label="Sodoh Nigeria in numbers" className="relative overflow-hidden bg-[#123d2a] px-5 py-16 text-white sm:px-8 md:px-12 md:py-20 lg:px-16">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[34%] border-l border-white/10 lg:block" />
      <div className="relative mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16">
        <AnimateIn variant="fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b5eb71]">The work in numbers</p>
          <p className="display-font mt-4 max-w-[12ch] text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl">A stronger harvest begins together.</p>
        </AnimateIn>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/20 pt-7 sm:grid-cols-3 lg:border-t-0 lg:pt-0">
          {stats.map((stat, i) => (
            <AnimateIn key={stat.label} variant="fade-up" delay={i * 70} duration={500}>
              <div className="min-w-0">
                <span className="display-font text-4xl font-medium tracking-[-0.04em] text-[#d6f28c] sm:text-5xl">{stat.value}</span>
                <p className="mt-2 max-w-[16ch] text-xs font-semibold leading-5 text-white/80 sm:text-sm">{stat.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
