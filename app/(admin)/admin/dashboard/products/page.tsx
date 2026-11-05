import { createClient } from "@/lib/supabase/server";
import ProductsManager from "@/components/admin/ProductsManager";
import PageHeader from "@/components/admin/PageHeader";
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
      <PageHeader
        title="Products"
        description="Manage the catalogue. A product appears publicly when it is active and marked reviewed."
      />

      <ProductsManager initialProducts={products} />
    </>
  );
}
