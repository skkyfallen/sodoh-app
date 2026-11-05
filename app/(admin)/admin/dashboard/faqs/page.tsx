import { getAdminFAQs } from "@/lib/data-admin";
import CrudManager from "@/components/admin/CrudManager";
import PageHeader from "@/components/admin/PageHeader";
import type { FieldDef } from "@/components/admin/CrudManager";

const fields: FieldDef[] = [
  { key: "question",      label: "Question" },
  { key: "answer",        label: "Answer",         type: "textarea" },
  { key: "display_order", label: "Display Order",  type: "number" },
  { key: "is_active",     label: "Active",         type: "checkbox" },
  { key: "public_reviewed", label: "Reviewed for public display", type: "checkbox" },
];

export default async function FAQsPage() {
  const faqs = await getAdminFAQs();

  return (
    <>
      <PageHeader
        title="FAQs"
        description="Manage answers shown on the contact page. Only active, reviewed answers appear publicly."
      />

      <CrudManager
        tableName="faqs"
        fields={fields}
        initialRows={faqs as unknown as Record<string, unknown>[]}
        listColumns={["question", "is_active", "public_reviewed"]}
      />
    </>
  );
}
