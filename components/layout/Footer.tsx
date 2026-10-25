import Link from "next/link";
import { MdLocationOn, MdMail } from "react-icons/md";

const links = [
  { label: "Our story", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d2b1c] px-5 pb-6 pt-14 text-white sm:px-8 md:px-12 md:pt-20 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/20 pb-12 md:grid-cols-[1.2fr_0.7fr_1fr] md:gap-10">
          <div>
            <Link href="/" className="inline-flex rounded-md leading-tight focus-visible:outline-[#a7f3d0]" aria-label="Sodoh Nigeria home">
              <span>
                <span className="display-font block text-2xl font-semibold tracking-[-0.045em]">Sodoh</span>
                <span className="block text-xs text-white/75">Nigeria Limited</span>
              </span>
            </Link>
            <p className="mt-6 max-w-[38ch] text-sm leading-6 text-white/80">
              Explore agricultural produce from Nigeria and speak with our team about your sourcing needs.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-4 space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-10 items-center text-sm text-white/80 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-[#a7f3d0]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-white">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MdLocationOn aria-hidden="true" className="mt-1 shrink-0 text-[#a7f3d0]" />
                <span>Abuja, Federal Capital Territory, Nigeria</span>
              </li>
              <li>
                <a href="mailto:info@sodohnigeria.com" className="inline-flex min-h-10 items-center gap-3 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-[#a7f3d0]">
                  <MdMail aria-hidden="true" className="shrink-0 text-[#a7f3d0]" />
                  <span>info@sodohnigeria.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sodoh Nigeria Limited. All rights reserved.</p>
          <a href="#top" className="inline-flex min-h-10 items-center gap-2 self-start font-semibold text-white/85 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-[#a7f3d0] sm:self-auto">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
