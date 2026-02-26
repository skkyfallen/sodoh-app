import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";

export default function Hero() {
  return (
    <section className="relative px-4 py-8 md:px-20 md:py-12">
      <div className="overflow-hidden rounded-xl shadow-2xl">
        <div className="relative min-h-[500px] md:min-h-[640px]">
          {/* Background image */}
          <Image
            alt="Lush green expansive Nigerian farmland at sunrise"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAct8vFx8c0lxCuqk0i5FQi2B1Ejw4DuRf4kKN9szBGjxyBTZIg-pRu8MQzqyxHssrx_ECxIajpPBMW1ld7_V8oy_WlEfWg4Ok1IsNAtheWyqTSdyKCdPnLfIk6he7lgo3EPzYSxuCceBiOw42U7Ri7J2DBlG55NHW9Vc64f051Pl0emsf0VL-GE7P02ig7IWnhgz3mbqfHsGZO27D_MYJQSg9VpzPvd3VyHjKD0LfCRMZ6oMRYlwcK8Lv63u1UB4B16ZqTp8uG9hrq"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,34,16,0.9)] via-[rgba(16,34,16,0.5)] to-[rgba(16,34,16,0.1)]" />
          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6 items-start justify-end px-6 pb-16 md:px-16 md:pb-24 min-h-[500px] md:min-h-[640px]">
            <AnimateIn variant="fade-down" delay={100} duration={700}>
              <span className="bg-[#0df20d]/20 text-[#0df20d] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest w-fit border border-[#0df20d]/30">
                Innovating African Agriculture
              </span>
            </AnimateIn>

            <AnimateIn variant="fade-up" delay={250} duration={700}>
              <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Cultivating a Greener Future for Nigeria
              </h1>
            </AnimateIn>

            <AnimateIn variant="fade-up" delay={400} duration={700}>
              <p className="text-slate-200 text-base font-medium leading-relaxed md:text-xl max-w-[600px]">
                Sodoh Nigeria Limited empowers local farmers with sustainable
                technology and delivers premium organic produce across the nation.
              </p>
            </AnimateIn>

            <AnimateIn variant="fade-up" delay={550} duration={700}>
              <div className="flex gap-4 mt-4">
                <Link
                  href="/about"
                  className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-[#0df20d] text-[#102210] text-base font-bold transition-all hover:shadow-lg hover:shadow-[#0df20d]/20"
                >
                  Learn More
                </Link>
                <Link
                  href="/#farms"
                  className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold transition-all hover:bg-white/20"
                >
                  Our Farms
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
