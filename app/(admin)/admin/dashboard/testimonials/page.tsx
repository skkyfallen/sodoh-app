import { getAdminTestimonials } from "@/lib/data-admin";
import CrudManager from "@/components/admin/CrudManager";
import PageHeader from "@/components/admin/PageHeader";
import type { FieldDef } from "@/components/admin/CrudManager";

const fields: FieldDef[] = [
  { key: "quote",         label: "Quote",          type: "textarea" },
  { key: "author_name",   label: "Author Name" },
  { key: "author_role",   label: "Author Role" },
  { key: "author_image",  label: "Author Image URL" },
  { key: "display_order", label: "Display Order",  type: "number" },
  { key: "is_active",     label: "Active",         type: "checkbox" },
  { key: "public_reviewed", label: "Quote approved for public display", type: "checkbox" },
];

export default async function TestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Publish a real, approved customer quote only after it is marked reviewed."
      />

      <CrudManager
        tableName="testimonials"
        fields={fields}
        initialRows={testimonials as unknown as Record<string, unknown>[]}
        listColumns={["author_name", "author_role", "is_active", "public_reviewed"]}
      />
    </>
  );
}
