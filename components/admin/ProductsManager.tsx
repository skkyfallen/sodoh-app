"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

type Product = Tables<"products">;

type Props = {
  initialProducts: Product[];
};

const emptyProduct: Omit<Product, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  region: "",
  description: "",
  image_url: "",
  image_alt: "",
  icon: "MdEco",
  display_order: 0,
  is_active: true,
};

export default function ProductsManager({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const openNew = () => {
    setEditing({
      ...emptyProduct,
      id: "",
      display_order: products.length + 1,
      created_at: "",
      updated_at: "",
    } as Product);
    setIsNew(true);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setIsNew(false);
  };

  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    if (isNew) {
      const { id: _id, created_at: _c, updated_at: _u, ...rest } = editing;
      void _id; void _c; void _u;
      const { data, error } = await supabase
        .from("products")
        .insert(rest as never)
        .select()
        .single();
      if (!error && data) {
        setProducts((prev) => [...prev, data as Product]);
      }
    } else {
      const { created_at: _c, updated_at: _u, ...rest } = editing;
      void _c; void _u;
      const { error } = await supabase
        .from("products")
        .update(rest)
        .eq("id", editing.id);
      if (!error) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...rest } : p))
        );
      }
    }

    setSaving(false);
    close();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !current })
      .eq("id", id);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
      );
    }
  };

  return (
    <div>
      <button
        onClick={openNew}
        className="mb-6 h-10 px-5 rounded-lg bg-[#016936] text-white text-sm font-bold hover:bg-[#015a2d] transition-colors"
      >
        + Add Product
      </button>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-bold text-slate-600">Order</th>
              <th className="text-left px-4 py-3 font-bold text-slate-600">Title</th>
              <th className="text-left px-4 py-3 font-bold text-slate-600">Region</th>
              <th className="text-left px-4 py-3 font-bold text-slate-600">Active</th>
              <th className="text-right px-4 py-3 font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-500">{p.display_order}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{p.title}</td>
                <td className="px-4 py-3 text-slate-600">{p.region}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(p.id, p.is_active)}
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      p.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-[#016936] font-semibold hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              {isNew ? "Add Product" : "Edit Product"}
            </h2>

            <div className="flex flex-col gap-4">
              {(
                [
                  ["title", "Title"],
                  ["slug", "Slug"],
                  ["region", "Region"],
                  ["icon", "Icon (e.g. MdEco)"],
                  ["image_url", "Image URL"],
                  ["image_alt", "Image Alt Text"],
                  ["display_order", "Display Order"],
                ] as [keyof Product, string][]
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    {label}
                  </label>
                  <input
                    type={key === "display_order" ? "number" : "text"}
                    value={String(editing[key] ?? "")}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev
                          ? {
                              ...prev,
                              [key]:
                                key === "display_order"
                                  ? Number(e.target.value)
                                  : e.target.value,
                            }
                          : prev
                      )
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936] resize-y"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, is_active: e.target.checked } : prev
                    )
                  }
                  className="size-4 accent-[#016936]"
                />
                <label className="text-sm font-semibold text-slate-600">Active</label>
              </div>
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
