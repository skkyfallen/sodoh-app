import ProductRequestsManager from "@/components/admin/ProductRequestsManager";
import PageHeader from "@/components/admin/PageHeader";
import { getProductRequests } from "@/lib/data-admin";

export default async function ProductRequestsPage() {
  const requests = await getProductRequests();
  return (
    <>
      <PageHeader
        title="Product Requests"
        description="Quote requests submitted from the products page."
      />
      <ProductRequestsManager initialRequests={requests} />
    </>
  );
}
