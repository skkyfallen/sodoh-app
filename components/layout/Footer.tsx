import Link from "next/link";
import { MdLocalFlorist, MdLeaderboard, MdShare, MdLink, MdLocationOn, MdCall, MdMail } from 'react-icons/md';

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Farms", href: "/#farms" },
  { label: "Product Catalogue", href: "/#products" },
  { label: "Investor Relations", href: "/about#investors" },
];

const products = [
  { label: "Farm Management", href: "/products" },
  { label: "Agro-Logistics", href: "/products" },
  { label: "Farmer Training", href: "/products" },
  { label: "Supply Chain Solutions", href: "/products" },
];

export default function Footer() {
  return (
    <footer className="bg-[#102210] text-slate-400 py-16 px-6 md:px-20 border-t border-[#0df20d]/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="size-6 bg-[#0df20d] rounded-md flex items-center justify-center text-[#102210]">
              <MdLocalFlorist className="text-xs" />
            </div>
            <h2 className="text-white text-lg font-black tracking-tight">
              Sodoh{" "}
              <span className="text-[#0df20d]">Nigeria Limited</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Leading agricultural operations in West Africa through innovation,
            sustainability, and community-focused growth.
          </p>
          <div className="flex gap-4">
          {[MdLeaderboard, MdShare, MdLink].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="size-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#0df20d] hover:text-[#102210] transition-all"
              >
                <Icon className="text-base" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#0df20d] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products (formerly Services) */}
        <div>
          <h4 className="text-white font-bold mb-6">Products</h4>
          <ul className="flex flex-col gap-3 text-sm">
            {products.map((service) => (
              <li key={service.label}>
                <Link href={service.href} className="hover:text-[#0df20d] transition-colors">
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex gap-3">
              <MdLocationOn className="text-[#0df20d] shrink-0" />
              <span>Abuja, Federal Capital Territory, Nigeria</span>
            </li>
            <li className="flex gap-3">
              <MdCall className="text-[#0df20d] shrink-0" />
              <span>+234 (0) 800 SODOH NG</span>
            </li>
            <li className="flex gap-3">
              <MdMail className="text-[#0df20d] shrink-0" />
              <span>info@sodohnigeria.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest">
        <p>© {new Date().getFullYear()} Sodoh Nigeria Limited. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
