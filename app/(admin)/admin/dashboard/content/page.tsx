import { getAdminPageContent } from "@/lib/data-admin";
import CMSEditor from "@/components/admin/CMSEditor";

export default async function ContentPage() {
  const [homeContent, aboutContent, productsContent, contactContent] =
    await Promise.all([
      getAdminPageContent("home"),
      getAdminPageContent("about"),
      getAdminPageContent("products"),
      getAdminPageContent("contact"),
    ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-1">
          Site Content
        </h1>
        <p className="text-sm text-slate-500">
          Edit copy, links, and structured content across the public site. Mark a section reviewed only after its claims are checked.
        </p>
      </div>

      <section aria-labelledby="managed-in-code-heading" className="mb-8 border-y border-slate-200 bg-white px-5 py-4 sm:px-6">
        <h2 id="managed-in-code-heading" className="text-sm font-bold text-slate-900">Managed in code</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>Home intro — HomeIntro</li>
          <li>Enquiry routes — EnquiryRoutes</li>
          <li>Home call to action — SiteCta</li>
          <li>Products grid explanatory copy</li>
          <li>Contact form</li>
          <li>Header and footer</li>
          <li>Product request dialog</li>
        </ul>
      </section>

      <CMSEditor
        pages={{
          home: homeContent,
          about: aboutContent,
          products: productsContent,
          contact: contactContent,
        }}
      />
    </>
  );
}
