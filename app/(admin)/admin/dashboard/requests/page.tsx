import ProductRequestsManager from "@/components/admin/ProductRequestsManager";
import { getProductRequests } from "@/lib/data-admin";

export default async function ProductRequestsPage() {
  const requests = await getProductRequests();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Product Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          Quote requests submitted from the products page.
        </p>
      </div>
      <ProductRequestsManager initialRequests={requests} />
    </div>
  );
}