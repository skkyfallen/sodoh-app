import { getFAQs } from "@/lib/data";
import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/CrudManager";

export const runtime = 'edge';

const fields: FieldDef[] = [
  { key: "question",      label: "Question" },
  { key: "answer",        label: "Answer",         type: "textarea" },
  { key: "display_order", label: "Display Order",  type: "number" },
  { key: "is_active",     label: "Active",         type: "checkbox" },
];

export default async function FAQsPage() {
  const faqs = await getFAQs();

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">FAQs</h1>
      <p className="text-slate-500 text-sm mb-8">
        Frequently asked questions on the contact page.
      </p>

      <CrudManager
        tableName="faqs"
        fields={fields}
        initialRows={faqs as unknown as Record<string, unknown>[]}
        listColumns={["question", "display_order", "is_active"]}
      />
    </>
  );
}
