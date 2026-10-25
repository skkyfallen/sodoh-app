"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox";
};

type Props = {
  tableName: string;
  fields: FieldDef[];
  initialRows: Record<string, unknown>[];
  /** Columns shown in the list table (subset of field keys) */
  listColumns?: string[];
};

export default function CrudManager({ tableName, fields, initialRows, listColumns }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const colKeys = listColumns ?? fields.slice(0, 3).map((f) => f.key);

  const openNew = () => {
    const blank: Record<string, unknown> = { id: "" };
    for (const f of fields) {
      blank[f.key] = f.type === "number" ? 0 : f.type === "checkbox" ? true : "";
    }
    setEditing(blank);
    setIsNew(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditing({ ...row });
    setIsNew(false);
  };

  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      payload[f.key] = editing[f.key];
    }

    if (isNew) {
      const { data, error } = await supabase
        .from(tableName as never)
        .insert(payload as never)
        .select()
        .single();
      if (!error && data) {
        setRows((prev) => [...prev, data as Record<string, unknown>]);
      }
    } else {
      const { error } = await supabase
        .from(tableName as never)
        .update(payload as never)
        .eq("id", editing.id as string);
      if (!error) {
        setRows((prev) =>
          prev.map((r) =>
            (r.id as string) === (editing.id as string) ? { ...r, ...payload } : r
          )
        );
      }
    }

    setSaving(false);
    close();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(tableName as never).delete().eq("id", id);
    if (!error) {
      setRows((prev) => prev.filter((r) => (r.id as string) !== id));
    }
  };

  return (
    <div>
      <button
        onClick={openNew}
        className="mb-6 inline-flex min-h-11 items-center gap-3 bg-[#016936] px-5 text-sm font-bold text-white transition-colors hover:bg-[#014e29]"
      >
        <span aria-hidden="true" className="text-lg leading-none">+</span> Add item
      </button>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {colKeys.map((k) => (
                <th key={k} className="text-left px-4 py-3 font-bold text-slate-600 capitalize whitespace-nowrap">
                  {k.replace(/_/g, " ")}
                </th>
              ))}
              <th className="text-right px-4 py-3 font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id as string} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                {colKeys.map((k) => (
                  <td key={k} className="px-4 py-3 text-slate-700 max-w-xs truncate">
                    {typeof row[k] === "boolean"
                      ? row[k]
                        ? "Yes"
                        : "No"
                      : String(row[k] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(row)} className="mr-3 font-semibold text-[#016936] hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(row.id as string)} className="font-semibold text-red-700 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={colKeys.length + 1} className="px-4 py-8 text-center text-slate-400">
                  No items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#dce4dc] bg-[#f8f8f2] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              {isNew ? "Add Item" : "Edit Item"}
            </h2>

            <div className="flex flex-col gap-4">
              {fields.map((f) => {
                const val = editing[f.key];
                if (f.type === "checkbox") {
                  return (
                    <div key={f.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) =>
                          setEditing((prev) => (prev ? { ...prev, [f.key]: e.target.checked } : prev))
                        }
                        className="size-4 accent-[#016936]"
                      />
                      <label className="text-sm font-semibold text-slate-600">{f.label}</label>
                    </div>
                  );
                }
                if (f.type === "textarea") {
                  return (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">{f.label}</label>
                      <textarea
                        rows={3}
                        value={String(val ?? "")}
                        onChange={(e) =>
                          setEditing((prev) => (prev ? { ...prev, [f.key]: e.target.value } : prev))
                        }
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936] resize-y"
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">{f.label}</label>
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={String(val ?? "")}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev
                            ? { ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }
                            : prev
                        )
                      }
                      className="w-full h-10 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={close}
                className="h-10 px-5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-10 px-5 rounded-lg bg-[#016936] text-white font-bold text-sm hover:bg-[#015a2d] disabled:opacity-60 transition-colors"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
