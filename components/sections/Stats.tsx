import AnimateIn from "@/components/ui/AnimateIn";
import type { Stat } from "@/types/content";

type Props = {
  stats: Stat[];
};

export default function Stats({ stats }: Props) {
  return (
    <section className="bg-[#102210] py-20 px-6 md:px-20 text-white overflow-hidden relative">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#0df20d]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0df20d]/5 rounded-full blur-[100px] -ml-32 -mb-32" />

      <div className="relative z-10 flex flex-wrap justify-center gap-10 md:gap-24">
        {stats.map((stat, i) => (
          <AnimateIn key={stat.label} variant="zoom" delay={i * 120} duration={600} threshold={0.1}>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-[#0df20d] text-5xl md:text-7xl font-black">
                {stat.value}
              </span>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">
                {stat.label}
              </p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
