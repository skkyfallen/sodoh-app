import { getPageContent } from "@/lib/data";
import ContentEditor from "@/components/admin/ContentEditor";

export default async function ContentPage() {
  const [homeContent, productsContent, contactContent] = await Promise.all([
    getPageContent("home"),
    getPageContent("products"),
    getPageContent("contact"),
  ]);

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Site Content</h1>
      <p className="text-slate-500 text-sm mb-8">
        Edit hero text, announcements, and CTA copy across all pages.
      </p>

      <ContentEditor
        pages={{
          home: homeContent,
          products: productsContent,
          contact: contactContent,
        }}
      />
    </>
  );
}
