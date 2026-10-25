"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

type Product = Tables<"products">;

type Props = {
  initialProducts: Product[];
};

const BUCKET = "product-images";

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

// ─── Image uploader ──────────────────────────────────────────────────────────

type ImageUploaderProps = {
  currentUrl: string;
  onUploaded: (url: string) => void;
};

function ImageUploader({ currentUrl, onUploaded }: ImageUploaderProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("Image must be under 50 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    if (path.includes('..')) {
      throw new Error("Invalid path");
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  const handleRemove = async () => {
    if (!currentUrl) return;
    // Extract the file path from the public URL
    const path = currentUrl.split(`/${BUCKET}/`)[1];
    if (path) {
      if (path.includes('..')) throw new Error('Invalid path');
      await supabase.storage.from(BUCKET).remove([path]);
    }
    onUploaded("");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-semibold text-slate-700">Product image</label>

      {currentUrl ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <Image src={currentUrl} alt="Product preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 500px" />
          <div className="absolute inset-0 flex items-end justify-end p-2">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white/90 hover:bg-red-50 text-red-600 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors shadow-sm"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="ml-2 bg-white/90 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors shadow-sm"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-[#016936] hover:bg-[#016936]/5 transition-colors text-slate-500 hover:text-[#016936] disabled:opacity-60"
        >
          {uploading ? (
            <span className="text-sm font-semibold">Uploading…</span>
          ) : (
            <>
              <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm font-semibold">Click to upload image</span>
              <span className="text-xs mt-1">PNG, JPG, WEBP — max 50 MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Products manager ────────────────────────────────────────────────────────

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
      if (!error && data) setProducts((prev) => [...prev, data as Product]);
    } else {
      const { created_at: _c, updated_at: _u, ...rest } = editing;
      void _c; void _u;
      const { error } = await supabase
        .from("products")
        .update(rest)
        .eq("id", editing.id);
      if (!error)
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...rest } : p))
        );
    }

    setSaving(false);
    close();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggle = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !current })
      .eq("id", id);
    if (!error)
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
      );
  };

  const field = (key: keyof Product, label: string, type: "text" | "number" = "text") => (
    <div key={key}>
      <label className="block text-sm font-semibold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={String(editing?.[key] ?? "")}
        onChange={(e) =>
          setEditing((prev) =>
            prev ? { ...prev, [key]: type === "number" ? Number(e.target.value) : e.target.value } : prev
          )
        }
        className="w-full h-10 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]"
      />
    </div>
  );

  return (
    <div>
      <button
        onClick={openNew}
        className="mb-6 inline-flex min-h-11 items-center gap-3 bg-[#016936] px-5 text-sm font-bold text-white transition-colors hover:bg-[#014e29]"
      >
        <span aria-hidden="true" className="text-lg leading-none">+</span> Add product
      </button>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-bold text-slate-600">Order</th>
              <th className="text-left px-4 py-3 font-bold text-slate-600">Title</th>
              <th className="text-left px-4 py-3 font-bold text-slate-600">Region</th>
              <th className="text-left px-4 py-3 font-bold text-slate-600">Active</th>
              <th className="text-right px-4 py-3 font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-500">{p.display_order}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{p.title}</td>
                <td className="px-4 py-3 text-slate-600">{p.region}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(p.id, p.is_active)}
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                    p.is_active ? "bg-[#e4f0da] text-[#145c34]" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="mr-3 font-semibold text-[#016936] hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="font-semibold text-red-700 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No products yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#dce4dc] bg-[#f8f8f2] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <h2 className="display-font mb-6 text-2xl font-semibold text-slate-900">
              {isNew ? "Add Product" : "Edit Product"}
            </h2>

            <div className="flex flex-col gap-4">
              {field("title", "Title")}
              {field("slug", "Slug")}
              {field("region", "Region")}
              {field("icon", "Icon (e.g. MdEco)")}
              {field("display_order", "Display Order", "number")}

              {/* Image upload */}
              <ImageUploader
                currentUrl={editing.image_url ?? ""}
                onUploaded={(url) => setEditing((prev) => prev ? { ...prev, image_url: url } : prev)}
              />

              {field("image_alt", "Image Alt Text")}

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing((prev) => prev ? { ...prev, description: e.target.value } : prev)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936] resize-y"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing((prev) => prev ? { ...prev, is_active: e.target.checked } : prev)}
                  className="size-4 accent-[#016936]"
                />
                <label className="text-sm font-semibold text-slate-600">Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={close} className="h-10 px-5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="h-10 px-5 rounded-lg bg-[#016936] text-white font-bold text-sm hover:bg-[#015a2d] disabled:opacity-60 transition-colors">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
