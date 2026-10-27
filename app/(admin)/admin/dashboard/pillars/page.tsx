import { getAdminPillars } from "@/lib/data-admin";
import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/CrudManager";

const fields: FieldDef[] = [
  { key: "title",         label: "Title" },
  { key: "description",   label: "Description",    type: "textarea" },
  { key: "display_order", label: "Display Order",  type: "number" },
  { key: "public_reviewed", label: "Reviewed for public display", type: "checkbox" },
];

export default async function PillarsPage() {
  const pillars = await getAdminPillars();

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Pillars</h1>
      <p className="text-slate-500 text-sm mb-8">
        Manage the titles and descriptions shown in the homepage process section.
      </p>

      <CrudManager
        tableName="pillars"
        fields={fields}
        initialRows={pillars as unknown as Record<string, unknown>[]}
        listColumns={["title", "public_reviewed", "display_order"]}
      />
    </>
  );
}
