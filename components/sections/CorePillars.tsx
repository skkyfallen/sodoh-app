import AnimateIn from "@/components/ui/AnimateIn";
import { MdSpa, MdVerified, MdHandshake } from 'react-icons/md';
import type { Pillar } from "@/types/content";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  MdSpa,
  MdVerified,
  MdHandshake,
};

const indents = ["ml-0", "ml-0 md:ml-10", "ml-0 md:ml-20"];

type Props = {
  pillars: Pillar[];
};

export default function CorePillars({ pillars }: Props) {
  return (
    <section id="products" className="px-6 py-20 md:px-20 bg-white">
      {/* Heading */}
      <AnimateIn variant="fade-up" threshold={0.2}>
        <div className="text-center mb-20 flex flex-col items-center">
          <AnimateIn variant="zoom" delay={50} duration={600}>
            <div className="group text-center">
              <h2 className="text-[#016936] text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 transform transition-transform hover:scale-105">
                Quality Guarantee
              </h2>
              <div className="mx-auto w-16 h-1 bg-[#016936] rounded-full transition-transform duration-300 transform origin-center group-hover:scale-x-[2.5]" />
            </div>
          </AnimateIn>
        </div>
      </AnimateIn>

      {/* Ladder layout */}
      <div className="relative flex flex-col gap-8 max-w-3xl mx-auto">
        {/* Vertical connector line */}
        <div className="absolute left-[27px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-[#016936] via-[#016936]/40 to-transparent hidden md:block" />

        {pillars.map((pillar, i) => (
          <AnimateIn
            key={pillar.step}
            variant="fade-left"
            delay={i * 180}
            duration={650}
            threshold={0.15}
          >
            <div className={`group relative flex items-start gap-6 ${indents[i] ?? "ml-0"}`}>
              {/* Step circle on the line */}
              <div className="shrink-0 relative z-10 flex items-center justify-center size-14 rounded-full border-2 border-[#016936] bg-white text-[#016936] font-black text-sm tracking-widest shadow-sm transition-all duration-300 group-hover:bg-[#016936] group-hover:text-white group-hover:shadow-lg">
                {pillar.step}
              </div>

              {/* Card */}
              <div className="flex-1 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm
                transition-all duration-300
                group-hover:border-[#016936]/60
                group-hover:shadow-[0_8px_40px_rgba(1,105,54,0.12)]
                group-hover:-translate-y-1
              ">
                {/* Icon + tag row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center size-14 rounded-2xl bg-[#016936]/8 text-[#016936] transition-transform duration-300 group-hover:scale-110">
                    {(() => {
                      const Icon = iconMap[pillar.icon ?? ""] ?? MdSpa;
                      return <Icon className="text-4xl" />;
                    })()}
                  </div>
                  {pillar.tag && (
                    <span className="text-xs font-bold uppercase tracking-widest text-[#016936] bg-[#016936]/10 px-3 py-1 rounded-full border border-[#016936]/20">
                      {pillar.tag}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-slate-900 text-xl font-extrabold leading-tight tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom bar that grows on hover */}
                <div className="h-0.5 w-0 bg-[#016936] rounded-full transition-all duration-500 group-hover:w-full" />
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
