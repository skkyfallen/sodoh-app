import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import { MdFormatQuote } from 'react-icons/md';

export default function Testimonial() {
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
            &ldquo;Partnering with Sodoh Nigeria Limited has transformed my yield
            and my livelihood. Their commitment to sustainable practices and fair
            market access is unparalleled in the Nigerian agricultural space.&rdquo;
          </blockquote>
        </AnimateIn>

        <AnimateIn variant="zoom" delay={350} duration={600}>
          <div className="flex flex-col items-center gap-2">
            <div className="size-16 rounded-full bg-cover bg-center border-2 border-[#0df20d] relative overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmndSEiKe_WOsMlOF8v5eSFPgHupEPHjzpYbJNPkWj_iJQcgVi4nxgUrdVT-DxtFDxRE5Z8I_1sbPnj7W-8FK--EXGMwiVc7aCcviDA03v52ruX8SKpi2z_YTBkJHSAMsv3Lg8prUwB98-jiEeQZ8dugVz9mKHWKBTw3V0DATKMl-maH031hANukkQ5Ctb9TSomHs5YwNImJwmvTEroxRqrfY8xX6lS19Xv9cn8ERCIp6waZ9BV07TGoJAlgyBGF7hVcvW2CTif8TF"
                alt="Alhaji Ibrahim Musa, Cooperative Lead, Kaduna State"
                width={64}
                height={64}
                className="object-cover w-full h-full"
                priority={false}
              />
            </div>
            <div>
              <p className="text-slate-900 font-black text-lg">Alhaji Ibrahim Musa</p>
              <p className="text-[#0ac20a] font-bold text-sm">
                Cooperative Lead, Kaduna State
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
