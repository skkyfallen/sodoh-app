import { createClient } from "@/lib/supabase/server";
import ProductsManager from "@/components/admin/ProductsManager";
import type { Product } from "@/types/content";

export const runtime = 'edge';

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("display_order");

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Products</h1>
      <p className="text-slate-500 text-sm mb-8">
        Manage agricultural products shown on the public site.
      </p>

      <ProductsManager initialProducts={(products ?? []) as Product[]} />
    </>
  );
}
