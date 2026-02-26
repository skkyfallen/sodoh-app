import AnimateIn from "@/components/ui/AnimateIn";
import type { FAQ as FAQType } from "@/types/content";

type Props = {
  faqs: FAQType[];
};

export default function FAQ({ faqs }: Props) {
  if (!faqs.length) return null;

  return (
    <section className="px-6 md:px-20 py-20 bg-[#0df20d]/5">
      <div className="max-w-3xl mx-auto">
        <AnimateIn variant="fade-up" threshold={0.2}>
          <h2 className="text-3xl font-black text-center mb-12">
            Frequently Asked Questions
          </h2>
        </AnimateIn>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <AnimateIn key={faq.id} variant="fade-up" delay={i * 100} duration={550} threshold={0.1}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-lg mb-2">{faq.question}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
