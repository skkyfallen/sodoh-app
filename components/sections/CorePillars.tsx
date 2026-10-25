import AnimateIn from "@/components/ui/AnimateIn";
import { MdSpa, MdVerified, MdHandshake } from "react-icons/md";
import type { Pillar } from "@/types/content";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = { MdSpa, MdVerified, MdHandshake };

type Props = { pillars: Pillar[] };

export default function CorePillars({ pillars }: Props) {
  return (
    <section id="products" className="bg-white px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <AnimateIn variant="fade-up" className="max-w-md">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">Our promise</p>
          <h2 className="max-w-[10ch] font-semibold text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.02] tracking-[-0.05em] text-[#17241d]">
            Quality, at every step.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#59685d]">
            Trust is built long before a shipment leaves the farm. We keep the same standards from the first seed to the final delivery.
          </p>
          <div className="mt-9 h-px w-20 bg-[#0df20d]" />
        </AnimateIn>

        <div className="border-t border-[#d9e1da]">
          {pillars.map((pillar, i) => {
            const Icon = iconMap[pillar.icon ?? ""] ?? MdSpa;
            return (
              <AnimateIn key={pillar.step} variant="fade-up" delay={i * 70} duration={550}>
                <article className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-[#d9e1da] py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-6 sm:py-8">
                  <span className="pt-1 font-mono text-xs font-semibold tracking-wider text-[#688171]">{pillar.step}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h3 className="display-font text-xl font-semibold tracking-tight text-[#17241d] sm:text-2xl">{pillar.title}</h3>
                      {pillar.tag && <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#016936]">{pillar.tag}</span>}
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#59685d] sm:text-base sm:leading-7">{pillar.description}</p>
                  </div>
                  <span className="hidden size-11 items-center justify-center rounded-full border border-[#d9e1da] text-[#016936] transition-colors group-hover:border-[#016936] group-hover:bg-[#016936] group-hover:text-white sm:flex" aria-hidden="true">
                    <Icon className="text-xl" />
                  </span>
                </article>
              </AnimateIn>
            );
          })}
          {pillars.length === 0 && <p className="py-8 text-sm text-[#59685d]">Our quality standards are being updated. Please check back soon.</p>}
        </div>
      </div>
    </section>
  );
}
