import { getAdminPillars } from "@/lib/data-admin";
import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/CrudManager";

const fields: FieldDef[] = [
  { key: "step",          label: "Step (e.g. 01)" },
  { key: "title",         label: "Title" },
  { key: "tag",           label: "Tag" },
  { key: "description",   label: "Description",    type: "textarea" },
  { key: "icon",          label: "Icon (e.g. MdSpa)" },
  { key: "display_order", label: "Display Order",  type: "number" },
  { key: "public_reviewed", label: "Reviewed for public display", type: "checkbox" },
];

export default async function PillarsPage() {
  const pillars = await getAdminPillars();

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Pillars</h1>
      <p className="text-slate-500 text-sm mb-8">
        Manage the sourcing steps shown on the homepage. Unreviewed items stay out of the public view.
      </p>

      <CrudManager
        tableName="pillars"
        fields={fields}
        initialRows={pillars as unknown as Record<string, unknown>[]}
        listColumns={["title", "tag", "public_reviewed", "display_order"]}
      />
    </>
  );
}
