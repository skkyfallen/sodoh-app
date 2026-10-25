import Link from "next/link";
import { MdArrowOutward, MdLocationOn, MdMail } from "react-icons/md";

const links = [
  { label: "Our story", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#102b20] px-5 pb-6 pt-14 text-white sm:px-8 md:px-12 md:pt-20 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-[1.2fr_0.7fr_1fr] md:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 focus-visible:outline-[#d6f28c]" aria-label="Sodoh Nigeria home">
              <span className="flex size-10 items-center justify-center bg-[#0df20d] text-xs font-bold text-[#102b20]">SN</span>
              <span className="leading-tight">
                <span className="display-font block text-lg font-semibold">Sodoh</span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">Nigeria Limited</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/70">
              Connecting the care of Nigerian growers with the needs of markets at home and around the world.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#b5eb71]">Explore</h2>
            <ul className="mt-5 space-y-3">
              {links.map((link) => <li key={link.href}><Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-[#d6f28c]">{link.label}</Link></li>)}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#b5eb71]">Get in touch</h2>
            <ul className="mt-5 space-y-4 text-sm text-white/75">
              <li className="flex items-start gap-3"><MdLocationOn aria-hidden="true" className="mt-0.5 shrink-0 text-[#b5eb71]" /><span>Abuja, Federal Capital Territory, Nigeria</span></li>
              <li><a href="mailto:info@sodohnigeria.com" className="flex items-center gap-3 transition-colors hover:text-white focus-visible:outline-[#d6f28c]"><MdMail aria-hidden="true" className="shrink-0 text-[#b5eb71]" />info@sodohnigeria.com<MdArrowOutward aria-hidden="true" className="text-xs" /></a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sodoh Nigeria Limited. All rights reserved.</p>
          <a href="#top" className="inline-flex items-center gap-2 self-start font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline-[#d6f28c] sm:self-auto">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
