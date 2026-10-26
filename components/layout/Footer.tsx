import Link from "next/link";
import { MdCall, MdMail } from "react-icons/md";
import { email, phone, phoneTel } from "@/lib/site";

const links = [
  { label: "Our story", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0c2418] px-5 pb-6 pt-14 text-white sm:px-8 md:px-12 md:pt-20 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <Link
          href="/"
          className="block rounded-md leading-none focus-visible:outline-[#a7f3d0]"
        >
          <span className="display-font block text-[clamp(4.5rem,15vw,13rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white">
            Sodoh
          </span>
          <span className="mt-4 block text-[13px] font-semibold uppercase tracking-[0.32em] text-[#7be2a6]">
            Nigeria Limited
          </span>
        </Link>

        <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-2 md:gap-16">
          <nav aria-label="Footer navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between gap-4 border-b border-white/10 py-4 first:border-t focus-visible:outline-[#a7f3d0]"
              >
                <span className="display-font text-2xl font-semibold tracking-[-0.02em] text-white/90 transition-colors group-hover:text-white sm:text-3xl">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-2xl text-white/30 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#7be2a6]"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="max-w-[40ch] text-[15px] leading-7 text-white/75">
                Explore agricultural produce from Nigeria and speak with our team about your sourcing needs.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-[12px] border border-white/20 px-3.5 py-2 text-[13px] font-semibold text-white/85">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#7be2a6]" />
                Catalogue live · Enquiries open
              </p>
            </div>
            <div className="space-y-3 text-[15px] text-white/80">
              <p>Abuja, Federal Capital Territory, Nigeria</p>
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex min-h-11 items-center gap-3 font-semibold text-white transition-colors hover:text-[#7be2a6] focus-visible:rounded-sm focus-visible:outline-[#a7f3d0]"
              >
                <MdCall aria-hidden="true" className="text-[#7be2a6]" />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-11 items-center gap-3 font-semibold text-white transition-colors hover:text-[#7be2a6] focus-visible:rounded-sm focus-visible:outline-[#a7f3d0]"
              >
                <MdMail aria-hidden="true" className="text-[#7be2a6]" />
                {email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-5 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sodoh Nigeria Limited. All rights reserved.</p>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-white/75 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-[#a7f3d0] sm:self-auto"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
