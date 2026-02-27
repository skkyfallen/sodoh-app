import { getPageContent } from "@/lib/data";
import CMSEditor from "@/components/admin/CMSEditor";

export const runtime = 'edge';

export default async function ContentPage() {
  const [homeContent, aboutContent, productsContent, contactContent] =
    await Promise.all([
      getPageContent("home"),
      getPageContent("about"),
      getPageContent("products"),
      getPageContent("contact"),
    ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-1">
          Site Content
        </h1>
        <p className="text-sm text-slate-500">
          Edit text, links, and structured content across every public page.
          Changes go live within 60 seconds.
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
