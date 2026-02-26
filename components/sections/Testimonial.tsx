import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import { MdFormatQuote } from 'react-icons/md';
import type { Testimonial as TestimonialType } from "@/types/content";

type Props = {
  testimonials: TestimonialType[];
};

export default function Testimonial({ testimonials }: Props) {
  if (!testimonials.length) return null;
  const t = testimonials[0]; // show first active testimonial

  return (
    <section className="px-6 py-24 md:px-20 bg-[#0df20d]/5">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
        <AnimateIn variant="fade" delay={0} duration={700}>
          <div className="text-[#0df20d] opacity-20">
            <MdFormatQuote style={{ fontSize: "5rem" }} />
          </div>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={150} duration={700}>
          <blockquote className="text-slate-900 text-2xl md:text-3xl font-bold leading-relaxed italic">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
        </AnimateIn>

        <AnimateIn variant="zoom" delay={350} duration={600}>
          <div className="flex flex-col items-center gap-2">
            {t.author_image && (
              <div className="size-16 rounded-full bg-cover bg-center border-2 border-[#0df20d] relative overflow-hidden">
                <Image
                  src={t.author_image}
                  alt={`${t.author_name}, ${t.author_role ?? ""}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  priority={false}
                />
              </div>
            )}
            <div>
              <p className="text-slate-900 font-black text-lg">{t.author_name}</p>
              {t.author_role && (
                <p className="text-[#0ac20a] font-bold text-sm">{t.author_role}</p>
              )}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
