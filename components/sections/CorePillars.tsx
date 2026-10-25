import AnimateIn from "@/components/ui/AnimateIn";
import type { Pillar } from "@/types/content";

type Props = { pillars: Pillar[] };

export default function CorePillars({ pillars }: Props) {
  const reviewedPillars = pillars.filter((pillar) => pillar.public_reviewed);
  const content = reviewedPillars.length ? reviewedPillars : [
    { id: "browse", title: "Browse products", description: "See the agricultural products currently listed in the catalogue." },
    { id: "enquire", title: "Send an enquiry", description: "Use a product request or contact form to share what you need." },
    { id: "discuss", title: "Discuss the details", description: "Talk with our team about your requirements and the next step." },
  ];

  return (
    <section id="how-we-work" className="bg-[var(--surface)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <AnimateIn className="max-w-md">
          <h2 className="display-font max-w-[12ch] text-[clamp(2.4rem,4.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">
            Sourcing starts with a clear conversation.
          </h2>
          <p className="mt-5 max-w-[40ch] text-base leading-7 text-[var(--body)]">
            Explore the catalogue, then tell our team what you need. Product and supply details can be discussed before you place an order.
          </p>
        </AnimateIn>

        <div className="border-t border-[var(--border)]">
          {content.map((pillar) => (
            <AnimateIn key={pillar.id}>
              <article className="grid gap-2 border-b border-[var(--border)] py-6 sm:grid-cols-[minmax(10rem,0.65fr)_1fr] sm:gap-8 sm:py-7">
                <h3 className="display-font text-xl font-semibold tracking-[-0.025em] text-[var(--ink)] sm:text-2xl">
                  {pillar.title}
                </h3>
                <p className="max-w-[62ch] text-sm leading-6 text-[var(--body)] sm:text-base sm:leading-7">
                  {pillar.description}
                </p>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
