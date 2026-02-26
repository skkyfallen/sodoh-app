import type { Metadata } from "next";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import { MdLocationOn, MdCall, MdMail } from 'react-icons/md';

export const metadata: Metadata = {
  title: "Contact Us — Sodoh Nigeria Limited",
  description:
    "Get in touch with Sodoh Nigeria Limited. Reach out for partnership opportunities, general inquiries, or to learn more about our agricultural operations.",
  openGraph: {
    title: "Contact Us — Sodoh Nigeria Limited",
    description:
      "Get in touch with Sodoh Nigeria Limited for partnership opportunities and agricultural inquiries.",
    type: "website",
  },
};

const contactDetails = [
  {
    Icon: MdLocationOn,
    label: "Office Address",
    value: "Plot 123, Central Business District\nAbuja, Federal Capital Territory, Nigeria",
  },
  {
    Icon: MdCall,
    label: "Phone Number",
    value: "+234 (0) 800 SODOH NG",
  },
  {
    Icon: MdMail,
    label: "Email Address",
    value: "info@sodohnigeria.com",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-4 py-8 md:px-20 md:py-12">
        <div className="overflow-hidden rounded-xl shadow-2xl">
          <div className="relative overflow-hidden rounded-xl bg-slate-900 min-h-[500px] md:min-h-[640px]">
          {/* Background image */}
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeB_gEYtl5ZsYxRfzMKBVeg6D4l5ECUoAVjC8JHMIbZ525ZGKTNz94g5IlBifM2GW_dhDBJdDNlfKf5Bh7y4MECit7CvGzjpT_rotjpBMWUU7_3ZPT-y-TJTM-NxljTa2IDpU3_vFBoYKMe2g5JC6IAyUPQdyQzPu5xqbMXy10jYy8ZgcExuzRqBAWvo3DubXkDvGxxUL1-a1QblGmKVUlnj28Z_jahVRJMYi79mpmZtUBQqb6QkUG_uWbzMfiSjjBfK4e19-7GbjT"
            alt="Lush green agricultural fields in Nigeria"
            fill
            priority
            className="object-cover opacity-40"
            sizes="(max-width: 768px) 100vw, 100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6 items-start justify-center px-6 pb-16 md:px-16 md:pb-24 min-h-[500px] md:min-h-[640px]">
            <div className="flex flex-col gap-4 max-w-2xl">
              <AnimateIn variant="fade-down" delay={200} duration={700}>
                <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                  Get in Touch
                </h1>
              </AnimateIn>
              <AnimateIn variant="fade-up" delay={400} duration={700}>
                <p className="text-white/90 text-base md:text-lg font-normal">
                  Have questions about sustainable farming or partnership
                  opportunities? Our team is here to help you grow your vision.
                </p>
              </AnimateIn>
            </div>
          </div>
        </div>
        </div>
      </section>
      <main className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <ContactForm />

        {/* Contact Details + Map */}
        <AnimateIn variant="fade-left" duration={700} delay={150} threshold={0.1}>
          <div className="flex flex-col gap-8">
            {/* Info card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <div className="flex flex-col gap-6">
                {contactDetails.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="bg-[#0df20d]/20 p-3 rounded-lg text-[#0ac20a] shrink-0">
                      <item.Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.label}</p>
                      <p className="text-slate-600 text-sm whitespace-pre-line mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-slate-200 h-64 relative shadow-sm">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAAc6CFMHOR4Hx_kuZ37K5vYBDkcaZd_NY3EVlcX1npyjUxAXE8KLrqVdYI4Vuoebd1nmmWjAdW9ZALWVUg26RpB_wwusTQ7hd2M7eKUT0m0pbiRt_SogJ2t7yUUKF4H6BuAKVokGebzNtiA8MJrJVXjtvnXmF9uOGUtEXhrv8c-39u9IiJVHcF72RUzqUuQ8Ivy8MPRxYunPfOLqGDgE8pAk30168ps2FsCA0t6fA4mZdIYN2qh7YjA7aNMBTevni17LxKadH1E-n"
                alt="Map of Abuja, Nigeria"
                fill
                className="object-cover grayscale contrast-75 opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-2 rounded-full shadow-lg border-2 border-[#0df20d]">
                  <MdLocationOn className="text-[#0df20d]" style={{ fontSize: "1.5rem" }} />
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Abuja,Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm hover:bg-white transition-colors"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </AnimateIn>
      </main>

      {/* FAQ */}
      <FAQ />
    </>
  );
}
