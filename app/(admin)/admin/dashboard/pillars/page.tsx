import { getPillars } from "@/lib/data";
import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/CrudManager";

const fields: FieldDef[] = [
  { key: "step",          label: "Step (e.g. 01)" },
  { key: "title",         label: "Title" },
  { key: "tag",           label: "Tag" },
  { key: "description",   label: "Description",    type: "textarea" },
  { key: "icon",          label: "Icon (e.g. MdSpa)" },
  { key: "display_order", label: "Display Order",  type: "number" },
];

export default async function PillarsPage() {
  const pillars = await getPillars();

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Pillars</h1>
      <p className="text-slate-500 text-sm mb-8">
        Quality Guarantee section items.
      </p>

      <CrudManager
        tableName="pillars"
        fields={fields}
        initialRows={pillars as unknown as Record<string, unknown>[]}
        listColumns={["step", "title", "tag", "display_order"]}
      />
    </>
  );
}
