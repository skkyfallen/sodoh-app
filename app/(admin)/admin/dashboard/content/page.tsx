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
