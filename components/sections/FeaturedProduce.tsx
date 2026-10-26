import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductLedger } from "@/components/products/ProductLedger";
import type { Product } from "@/types/content";

type Props = { products: Product[] };

export default function FeaturedProduce({ products }: Props) {
  const listed = products.slice(0, 3);

  return (
    <section className="bg-[var(--surface)] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <AnimateIn className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display-font max-w-[16ch] text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.0] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]">
              Browse the current produce catalogue.
            </h2>
            <p className="mt-4 max-w-[55ch] text-[15px] leading-7 text-[var(--body)]">
              See what is listed, then ask our team about availability and supply details.
            </p>
          </div>
          <Link href="/products" className="link-arrow inline-flex min-h-11 shrink-0 items-center text-[15px] font-semibold text-[var(--brand)] underline decoration-[var(--border-strong)] underline-offset-4 hover:text-[var(--brand-hover)]">
            View all products <span aria-hidden="true" className="arrow">→</span>
          </Link>
        </AnimateIn>

        {listed.length ? (
          <ProductLedger products={listed} />
        ) : (
          <EmptyState
            title="The catalogue is being updated"
            body="Contact our team to discuss what you are looking for."
            action={
              <Link href="/contact" className="pressable inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[var(--brand)] px-6 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] dark:text-[#062a17]">
                Contact us
              </Link>
            }
          />
        )}
      </div>
    </section>
  );
}
