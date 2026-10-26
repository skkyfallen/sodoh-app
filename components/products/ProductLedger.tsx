import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import ProductRequestButton from "@/components/products/ProductRequestButton";
import { safeHref } from "@/lib/utils";
import type { Product } from "@/types/content";

type Props = {
  products: Product[];
  showRequest?: boolean;
};

/**
 * Market-list ledger: full-width rows separated by hairlines.
 * No cards, no grids — reads like a price list at the market.
 * One section-level reveal covers the whole list; rows render plain.
 */
export function ProductLedger({ products, showRequest = false }: Props) {
  return (
    <AnimateIn variant="fade-up">
      <div className="border-b border-[var(--border-strong)]/60">
        {products.map((product) => (
          <article
            key={product.id}
            id={`product-${product.slug}`}
            className="group grid scroll-mt-28 grid-cols-[1fr_auto] items-center gap-4 border-t border-[var(--border-strong)]/60 py-7 sm:gap-8 sm:py-8 md:grid-cols-[1fr_auto_auto] md:gap-10"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="display-font text-[1.65rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--ink)] transition-colors group-hover:text-[var(--brand)] sm:text-4xl">
                  {showRequest ? (
                    product.title
                  ) : (
                    <Link
                      href={`/products#product-${product.slug}`}
                      className="rounded-md focus-visible:outline-offset-4"
                    >
                      {product.title}
                    </Link>
                  )}
                </h3>
                {product.region && (
                  <span className="text-sm font-medium text-[var(--ink)]">{product.region}</span>
                )}
              </div>
              {product.description && (
                <p className="mt-2 max-w-[62ch] text-[15px] leading-7 text-[var(--body)]">
                  {product.description}
                </p>
              )}
            </div>

            <Link
              href={`/products#product-${product.slug}`}
              aria-hidden={showRequest ? undefined : true}
              tabIndex={showRequest ? undefined : -1}
              className="hidden w-36 shrink-0 overflow-hidden rounded-[14px] border border-[var(--border)]/70 bg-[var(--surface-muted)] sm:block md:w-48"
            >
              {safeHref(product.image_url, "") ? (
                <span className="media-zoom relative block aspect-[4/3]">
                  <Image
                    src={safeHref(product.image_url, "")}
                    alt={product.image_alt || product.title}
                    fill
                    sizes="200px"
                    loading="lazy"
                    className="object-cover"
                  />
                </span>
              ) : (
                <span className="flex aspect-[4/3] items-end p-3 text-[13px] leading-5 text-[var(--muted)]">
                  Product image not provided
                </span>
              )}
            </Link>

            <div className="col-span-2 w-full sm:w-56 md:col-span-1 md:w-48">
              {showRequest ? (
                <ProductRequestButton product={product} />
              ) : (
                <Link
                  href={`/products#product-${product.slug}`}
                  aria-label={`View ${product.title}`}
                  className="link-arrow inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)]"
                >
                  View <span aria-hidden="true" className="arrow">→</span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </AnimateIn>
  );
}
