import AnimateIn from "@/components/ui/AnimateIn";

const faqs = [
  {
    question: "How do I start a partnership with Sodoh Nigeria Limited?",
    answer:
      "Simply fill out our contact form or send a detailed proposal to our partnership email. Our team typically reviews and responds to all partnership inquiries within 3–5 business days.",
  },
  {
    question: "Do you provide logistics support for small-scale farmers?",
    answer:
      "Yes, we offer integrated supply chain solutions specifically designed to help small-scale farmers get their products to market efficiently and profitably.",
  },
  {
    question: "Are your farming methods 100% sustainable?",
    answer:
      "Sustainability is at our core. We utilise regenerative agriculture practices, solar-powered irrigation, and organic pest control methods across all our managed sites.",
  },
  {
    question: "Can I visit your Abuja office for a physical consultation?",
    answer:
      "While we prefer scheduled appointments, our doors are open for consultations Monday through Friday from 9:00 AM to 4:00 PM.",
  },
];

export default function FAQ() {
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
            <AnimateIn key={faq.question} variant="fade-up" delay={i * 100} duration={550} threshold={0.1}>
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
