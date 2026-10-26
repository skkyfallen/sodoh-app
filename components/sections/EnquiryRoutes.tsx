import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";

const routes = [
  {
    title: "Start from a product",
    body: "Open the catalogue, choose a listing, and send a quote request with your quantity.",
    linkText: "Browse products",
    href: "/products",
  },
  {
    title: "Start from a message",
    body: "Tell us what you need in your own words — volumes, timing, or a partnership idea.",
    linkText: "Contact us",
    href: "/contact",
  },
];

/**
 * The two enquiry routes, as ledger rows. Directs buyers to the
 * products page or the contact form depending on how they buy.
 */
export function EnquiryRoutes() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <AnimateIn className="mb-10 max-w-[1320px]">
          <h2 className="display-font max-w-[16ch] text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.0] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">
            Start with a listing, or start with a message.
          </h2>
        </AnimateIn>
        <div className="border-b border-[var(--border-strong)]/60">
          {routes.map((route, index) => (
            <AnimateIn
              key={route.href}
              variant={index % 2 === 0 ? "fade-right" : "fade-left"}
              delay={index * 0.07}
            >
              <article className="group grid gap-3 border-t border-[var(--border-strong)]/60 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
                <div>
                  <h3 className="display-font text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)] transition-colors group-hover:text-[var(--brand)] sm:text-3xl">
                    <Link href={route.href} className="rounded-md focus-visible:outline-offset-4">
                      {route.title}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-[58ch] text-[15px] leading-7 text-[var(--body)]">
                    {route.body}
                  </p>
                </div>
                <Link
                  href={route.href}
                  className="link-arrow inline-flex min-h-11 items-center gap-2 justify-self-start text-[15px] font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)] sm:justify-self-end"
                >
                  {route.linkText} <span aria-hidden="true" className="arrow">→</span>
                </Link>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
