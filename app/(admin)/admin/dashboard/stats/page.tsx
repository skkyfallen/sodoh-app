import { getAdminStats } from "@/lib/data-admin";
import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/CrudManager";

const fields: FieldDef[] = [
  { key: "value",         label: "Value (e.g. 500+)" },
  { key: "label",         label: "Label" },
  { key: "sub",           label: "Sub-text",       type: "text" },
  { key: "display_order", label: "Display Order",  type: "number" },
  { key: "public_reviewed", label: "Reviewed for public display", type: "checkbox" },
];

export default async function StatsPage() {
  const stats = await getAdminStats();

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Stats</h1>
      <p className="text-slate-500 text-sm mb-8">
        Add only metrics you can substantiate. A metric appears publicly after it is marked reviewed.
      </p>

      <CrudManager
        tableName="stats"
        fields={fields}
        initialRows={stats as unknown as Record<string, unknown>[]}
        listColumns={["value", "label", "public_reviewed", "display_order"]}
      />
    </>
  );
}
