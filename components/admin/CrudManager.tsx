"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MdClose } from "react-icons/md";

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const savingRef = useRef(false);
  const dialogOpen = editing !== null;
  savingRef.current = saving;

  const supabase = createClient();
  const colKeys = listColumns ?? fields.slice(0, 3).map((f) => f.key);

  const openNew = () => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSaveError(null);
    const blank: Record<string, unknown> = { id: "" };
    for (const f of fields) {
      blank[f.key] = f.type === "number" ? 0 : f.type === "checkbox" ? f.key !== "public_reviewed" : "";
    }
    setEditing(blank);
    setIsNew(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSaveError(null);
    setEditing({ ...row });
    setIsNew(false);
  };

  const close = () => {
    if (savingRef.current) return;
    setEditing(null);
    setIsNew(false);
  };

  useEffect(() => {
    if (!dialogOpen) {
      previousFocusRef.current?.focus();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input:not([type=checkbox]), textarea, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
    // Dialog focus and scroll behavior follows the open state, not each field edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);

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
      if (error || !data) {
        setSaveError(error?.message ?? "This item could not be saved. Please try again.");
        setSaving(false);
        return;
      }
      setRows((prev) => [...prev, data as Record<string, unknown>]);
    } else {
      const { error } = await supabase
        .from(tableName as never)
        .update(payload as never)
        .eq("id", editing.id as string);
      if (error) {
        setSaveError(`This item could not be saved. ${error.message} Please try again.`);
        setSaving(false);
        return;
      }
      setRows((prev) => prev.map((row) => (row.id as string) === (editing.id as string) ? { ...row, ...payload } : row));
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
        type="button"
        onClick={openNew}
        className="mb-6 inline-flex min-h-11 items-center gap-3 rounded-lg bg-[#016936] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#014e29]"
      >
        <span aria-hidden="true" className="text-lg leading-none">+</span> Add item
      </button>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {colKeys.map((k) => (
                  <th key={k} className="px-3 py-3 text-left font-semibold text-slate-700 capitalize sm:px-4">
                  {k.replace(/_/g, " ")}
                </th>
              ))}
                <th className="px-3 py-3 text-right font-semibold text-slate-700 sm:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id as string} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                {colKeys.map((k) => (
                  <td key={k} className="max-w-xs truncate px-3 py-3 text-slate-700 sm:px-4">
                    {typeof row[k] === "boolean"
                      ? row[k]
                        ? "Yes"
                        : "No"
                      : String(row[k] ?? "")}
                  </td>
                ))}
                <td className="px-2 py-3 text-right sm:px-4">
                  <div className="flex flex-wrap justify-end gap-1">
                    <button type="button" onClick={() => openEdit(row)} className="min-h-11 rounded-lg px-2 font-semibold text-[#016936] hover:underline">Edit</button>
                    <button type="button" onClick={() => handleDelete(row.id as string)} className="min-h-11 rounded-lg px-2 font-semibold text-red-700 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={colKeys.length + 1} className="px-4 py-8 text-center text-slate-500">
                  No items yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="crud-editor-title" className="max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#dce4dc] bg-[var(--admin-page)] p-5 shadow-[0_24px_72px_rgba(0,0,0,0.25)] sm:max-h-[90vh] sm:rounded-2xl sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 id="crud-editor-title" className="display-font text-2xl font-semibold text-slate-900">
                {isNew ? "Add item" : "Edit item"}
              </h2>
              <button type="button" onClick={close} disabled={saving} aria-label="Close editor" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-700 transition-colors hover:bg-white disabled:opacity-50"><MdClose aria-hidden="true" /></button>
            </div>

            <form onSubmit={(event) => { event.preventDefault(); void handleSave(); }} className="flex flex-col gap-4">
              {fields.map((f) => {
                const val = editing[f.key];
                const inputId = `crud-field-${f.key}`;
                if (f.type === "checkbox") {
                  return (
                    <div key={f.key} className="flex min-h-11 items-center gap-3">
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) =>
                          setEditing((prev) => (prev ? { ...prev, [f.key]: e.target.checked } : prev))
                        }
                        className="size-4 accent-[#016936]"
                      />
                      <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">{f.label}</label>
                    </div>
                  );
                }
                if (f.type === "textarea") {
                  return (
                    <div key={f.key}>
                      <label htmlFor={inputId} className="mb-1 block text-sm font-semibold text-slate-700">{f.label}</label>
                      <textarea
                        id={inputId}
                        rows={3}
                        value={String(val ?? "")}
                        onChange={(e) =>
                          setEditing((prev) => (prev ? { ...prev, [f.key]: e.target.value } : prev))
                        }
                        className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]"
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.key}>
                    <label htmlFor={inputId} className="mb-1 block text-sm font-semibold text-slate-700">{f.label}</label>
                    <input
                      id={inputId}
                      type={f.type === "number" ? "number" : "text"}
                      value={String(val ?? "")}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev
                            ? { ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }
                            : prev
                        )
                      }
                      className="min-h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]"
                    />
                  </div>
                );
              })}
              {saveError && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{saveError}</p>}

              <div className="mt-2 flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-4 sm:flex-row">
                <button type="button" onClick={close} disabled={saving} className="min-h-11 rounded-lg bg-slate-100 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving} aria-busy={saving} className="min-h-11 rounded-lg bg-[#016936] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#015a2d] disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
