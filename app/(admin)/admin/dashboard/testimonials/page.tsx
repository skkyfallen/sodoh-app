import { getTestimonials } from "@/lib/data";
import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/CrudManager";

export const runtime = 'edge';

const fields: FieldDef[] = [
  { key: "quote",         label: "Quote",          type: "textarea" },
  { key: "author_name",   label: "Author Name" },
  { key: "author_role",   label: "Author Role" },
  { key: "author_image",  label: "Author Image URL" },
  { key: "display_order", label: "Display Order",  type: "number" },
  { key: "is_active",     label: "Active",         type: "checkbox" },
];

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Testimonials</h1>
      <p className="text-slate-500 text-sm mb-8">
        Manage customer testimonials shown on the homepage.
      </p>

      <CrudManager
        tableName="testimonials"
        fields={fields}
        initialRows={testimonials as unknown as Record<string, unknown>[]}
        listColumns={["author_name", "author_role", "display_order", "is_active"]}
      />
    </>
  );
}
