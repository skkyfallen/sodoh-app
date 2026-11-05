import { getAdminPillars } from "@/lib/data-admin";
import CrudManager from "@/components/admin/CrudManager";
import PageHeader from "@/components/admin/PageHeader";
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
      <PageHeader
        title="Pillars"
        description="Manage the titles and descriptions shown in the homepage process section."
      />

      <CrudManager
        tableName="pillars"
        fields={fields}
        initialRows={pillars as unknown as Record<string, unknown>[]}
        listColumns={["title", "public_reviewed", "display_order"]}
      />
    </>
  );
}
