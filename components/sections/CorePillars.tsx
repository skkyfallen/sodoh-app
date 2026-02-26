import AnimateIn from "@/components/ui/AnimateIn";
import { MdEco, MdShoppingBasket, MdGroups } from 'react-icons/md';

const pillars = [
  {
    Icon: MdEco,
    title: "Sustainable Farming",
    description:
      "Implementing climate-smart agricultural practices that preserve soil health and local ecosystems for future generations.",
  },
  {
    Icon: MdShoppingBasket,
    title: "Premium Produce",
    description:
      "High-quality, organic crops harvested with precision and handled through modern cold-chain logistics to ensure freshness.",
  },
  {
    Icon: MdGroups,
    title: "Community Support",
    description:
      "Strengthening local economies through direct farmer partnerships, fair pricing, and technical capacity building.",
  },
];

export default function CorePillars() {
  return (
    <section id="products" className="px-6 py-16 md:px-20">
      <AnimateIn variant="fade-up" threshold={0.2}>
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-slate-900 text-3xl font-black tracking-tight md:text-4xl mb-4">
            Our Products
          </h2>
          <div className="w-20 h-1 bg-[#0df20d] rounded-full" />
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, i) => (
          <AnimateIn key={pillar.title} variant="fade-up" delay={i * 150} duration={600} threshold={0.1}>
            <div className="flex flex-col gap-5 rounded-2xl border border-[#0df20d]/10 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 h-full">
              <div className="bg-[#0df20d]/10 text-[#0ac20a] size-12 rounded-xl flex items-center justify-center">
                <pillar.Icon className="text-3xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-slate-900 text-xl font-bold leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
