import { createClient } from "@/lib/supabase/server";
import ProductsManager from "@/components/admin/ProductsManager";
import type { Product } from "@/types/content";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("display_order");

  const products = ((data ?? []) as Array<Partial<Product> & Record<string, unknown>>).map((row) => ({
    ...row,
    public_reviewed: row.public_reviewed ?? false,
    is_active: row.is_active ?? true,
  })) as Product[];

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Products</h1>
      <p className="text-slate-500 text-sm mb-8">
        Manage the catalogue. A product appears publicly when it is active and marked reviewed.
      </p>

      <ProductsManager initialProducts={products} />
    </>
  );
}
