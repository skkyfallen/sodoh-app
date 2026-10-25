import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/content";

type Props = { products: Product[] };

function ProductImage({ product, priority = false }: { product: Product; priority?: boolean }) {
  if (!product.image_url) {
    return (
      <div className="flex aspect-[1.45/1] items-end rounded-2xl bg-[var(--surface-muted)] p-4 text-sm leading-5 text-[var(--muted)]">
        Product image not provided
      </div>
    );
  }

  return (
    <div className="relative aspect-[1.45/1] overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
      <Image
        src={product.image_url}
        alt={product.image_alt || `${product.title} produce`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 hover:scale-[1.025]"
      />
    </div>
  );
}

export default function FeaturedProduce({ products }: Props) {
  const [featured, ...more] = products.slice(0, 3);

  return (
    <section className="bg-[var(--surface-muted)] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display-font max-w-[15ch] text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-4xl [text-wrap:balance]">
              Browse the current produce catalogue.
            </h2>
            <p className="mt-3 max-w-[55ch] text-sm leading-6 text-[var(--body)]">
              See what is listed, then ask our team about availability and supply details.
            </p>
          </div>
          <Link href="/products" className="inline-flex min-h-11 shrink-0 items-center font-semibold text-[var(--brand)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--brand-hover)]">
            View all products
          </Link>
        </div>

        {featured ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <article className="min-w-0">
              <Link href={`/products#product-${featured.slug}`} className="group block rounded-2xl focus-visible:outline-offset-4">
                <ProductImage product={featured} priority />
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="display-font text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)] group-hover:text-[var(--brand)] sm:text-3xl">{featured.title}</h3>
                  {featured.region && <span className="text-sm text-[var(--muted)]">{featured.region}</span>}
                </div>
                {featured.description && <p className="mt-2 max-w-[62ch] text-sm leading-6 text-[var(--body)]">{featured.description}</p>}
              </Link>
            </article>

            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {more.map((product) => (
                <article key={product.id} className="grid grid-cols-[6.5rem_1fr] items-center gap-4 py-4 sm:grid-cols-[8rem_1fr] sm:gap-5">
                  <Link href={`/products#product-${product.slug}`} className="block rounded-2xl focus-visible:outline-offset-4">
                    <ProductImage product={product} />
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/products#product-${product.slug}`} className="display-font text-lg font-semibold tracking-[-0.02em] text-[var(--ink)] hover:text-[var(--brand)] sm:text-xl">
                      {product.title}
                    </Link>
                    {product.region && <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{product.region}</p>}
                    {product.description && <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--body)]">{product.description}</p>}
                  </div>
                </article>
              ))}
              {more.length === 0 && (
                <div className="flex min-h-32 items-center py-5 text-sm leading-6 text-[var(--body)]">
                  Contact our team to discuss the products listed in the catalogue.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4 border-y border-[var(--border)] py-8">
            <p className="max-w-[55ch] text-sm leading-6 text-[var(--body)]">
              The catalogue is being updated. Contact our team to discuss what you are looking for.
            </p>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#062a17]">
              Contact us
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
