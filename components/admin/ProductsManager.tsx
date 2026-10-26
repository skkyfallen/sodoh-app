"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";
import { MdCloudUpload, MdClose } from "react-icons/md";

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
  icon: null,
  display_order: 0,
  is_active: true,
  public_reviewed: false,
};

// Slug is derived from the title on create so the admin never types it.
// Public anchors (#product-{slug}) and request lookups depend on it staying unique.
function uniqueSlug(title: string, taken: string[]): string {
  const base =
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product";
  const used = new Set(taken.map((s) => s.toLowerCase()));
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

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
      <label className="block text-sm font-semibold text-[var(--admin-ink)]">Product image</label>

      {currentUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-slate-100">
          <Image src={(() => { if (currentUrl.startsWith("/") && !currentUrl.startsWith("//") && !currentUrl.includes("\\")) return currentUrl; try { const url = new URL(currentUrl); return url.protocol === "https:" && url.hostname ? currentUrl : "/images/produce-fields.jpg"; } catch { return "/images/produce-fields.jpg"; } })()} alt="Product preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 500px" />
          <div className="absolute inset-0 flex items-end justify-end p-2">
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="min-h-11 rounded-full border border-red-200 bg-[var(--admin-surface)]/95 px-4 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="ml-2 min-h-11 rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)]/95 px-4 text-sm font-semibold text-[var(--admin-ink)] shadow-sm transition-colors hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full aspect-video flex-col items-center justify-center rounded-[12px] border border-dashed border-[var(--admin-border)] text-[var(--admin-muted)] transition-colors hover:border-[#016936] hover:bg-[#016936]/5 hover:text-[#016936] disabled:opacity-60"
        >
          {uploading ? (
            <span className="text-sm font-semibold">Uploading…</span>
          ) : (
            <>
              <MdCloudUpload aria-hidden="true" className="mb-2 text-3xl" />
              <span className="text-sm font-semibold">Click to upload image</span>
              <span className="text-xs mt-1">PNG, JPG, WEBP — max 50 MB</span>
            </>
          )}
        </button>
      )}

      {uploading && currentUrl && <p role="status" className="text-sm text-[var(--admin-muted)]">Uploading replacement image…</p>}
      {error && <p role="alert" className="text-sm font-medium text-red-700">{error} You can choose another image and try again.</p>}

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<{
    title: string;
    is_active: boolean;
    public_reviewed: boolean;
  } | null>(null);
  const [pageNotice, setPageNotice] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const editorHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const savingRef = useRef(false);
  const dialogOpen = editing !== null;

  useLayoutEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  const supabase = createClient();

  const openNew = () => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSaveError(null);
    setActionError(null);
    setPageNotice(null);
    setJustSaved(false);
    setSavedSnapshot(null);
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
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSaveError(null);
    setActionError(null);
    setPageNotice(null);
    setJustSaved(false);
    setSavedSnapshot(null);
    setEditing({ ...p });
    setIsNew(false);
  };

  const close = useCallback(() => {
    if (savingRef.current) return;
    setEditing(null);
    setIsNew(false);
    setJustSaved(false);
    setSavedSnapshot(null);
  }, []);

  const backToForm = () => {
    setJustSaved(false);
    setSavedSnapshot(null);
    dialogRef.current?.querySelector<HTMLElement>("input:not([type=checkbox]), textarea, button")?.focus();
  };

  const addAnother = () => {
    setSaveError(null);
    setJustSaved(false);
    setSavedSnapshot(null);
    setEditing({
      ...emptyProduct,
      id: "",
      display_order: products.length + 1,
      created_at: "",
      updated_at: "",
    } as Product);
    setIsNew(true);
    dialogRef.current?.querySelector<HTMLElement>("input:not([type=checkbox]), textarea, button")?.focus();
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
  }, [dialogOpen, close]);

  useEffect(() => {
    if (justSaved) editorHeadingRef.current?.focus();
  }, [justSaved]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      setSaveError("Add a product name before saving.");
      return;
    }
    setSaving(true);
    setSaveError(null);

    if (isNew) {
      const { id: _id, created_at: _c, updated_at: _u, ...rest } = editing;
      void _id; void _c; void _u;
      const slug = uniqueSlug(rest.title, products.map((p) => p.slug));
      const { data, error } = await supabase
        .from("products")
        .insert({ ...rest, slug, icon: null } as never)
        .select()
        .single();
      if (error || !data) {
        setSaveError(error?.message ?? "The product could not be saved. Please try again.");
        setSaving(false);
        return;
      }
      const saved = data as Product;
      setProducts((prev) => [...prev, saved]);
      setSavedSnapshot({
        title: saved.title,
        is_active: saved.is_active ?? true,
        public_reviewed: saved.public_reviewed ?? false,
      });
      setPageNotice(`Product added: ${saved.title}`);
    } else {
      const { created_at: _c, updated_at: _u, ...rest } = editing;
      void _c; void _u;
      const { error } = await supabase
        .from("products")
        .update(rest)
        .eq("id", editing.id);
      if (error) {
        setSaveError(`Could not update this product. ${error.message} Please try again.`);
        setSaving(false);
        return;
      }
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...rest } : p)));
      setSavedSnapshot({
        title: editing.title,
        is_active: editing.is_active ?? true,
        public_reviewed: editing.public_reviewed ?? false,
      });
      setPageNotice(`Changes saved: ${editing.title}`);
    }

    setSaving(false);
    setJustSaved(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setActionError(null);
    setPendingId(id);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setActionError("This product could not be deleted. Check your connection and try again.");
    } finally {
      setPendingId(null);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setActionError(null);
    setPendingId(id);
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !current })
        .eq("id", id);
      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
      );
    } catch {
      setActionError("This product could not be updated. Check your connection and try again.");
    } finally {
      setPendingId(null);
    }
  };

  const field = (key: keyof Product, label: string, type: "text" | "number" = "text") => (
    <div key={key}>
      <label htmlFor={`product-field-${key}`} className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">{label}</label>
      <input
        id={`product-field-${key}`}
        type={type}
        value={String(editing?.[key] ?? "")}
        required={key === "title" || key === "slug"}
        onChange={(e) =>
          setEditing((prev) =>
            prev ? { ...prev, [key]: type === "number" ? Number(e.target.value) : e.target.value } : prev
          )
        }
        className="min-h-11 w-full rounded-[12px] border border-[var(--admin-border)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]"
      />
    </div>
  );

  return (
    <div>
      <button
        type="button"
        onClick={openNew}
        className="mb-6 inline-flex min-h-11 items-center gap-3 rounded-[10px] bg-[#016936] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#014e29]"
      >
        <span aria-hidden="true" className="text-lg leading-none">+</span> Add product
      </button>
      {pageNotice && <p role="status" className="mb-4 rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-active)] px-4 py-3 text-sm font-semibold text-[#145c34]">{pageNotice}</p>}
      {actionError && <p role="alert" className="mb-4 rounded-[12px] border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{actionError}</p>}

      {/* Table */}
      <div className="overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-page)]">
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--admin-ink)] sm:px-4 sm:text-sm">Order</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--admin-ink)] sm:px-4 sm:text-sm">Product</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--admin-ink)] sm:px-4 sm:text-sm">Region</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--admin-ink)] sm:px-4 sm:text-sm">Active</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--admin-ink)] sm:px-4 sm:text-sm">Review</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-[var(--admin-ink)] sm:px-4 sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--admin-border)] transition-colors hover:bg-[var(--admin-page)]">
                <td className="px-2 py-3 tabular-nums text-[var(--admin-muted)] sm:px-4">{p.display_order}</td>
                <td className="break-words px-2 py-3 font-semibold text-[var(--admin-ink)] sm:px-4">{p.title}</td>
                <td className="break-words px-2 py-3 text-[var(--admin-muted)] sm:px-4">{p.region}</td>
                <td className="px-2 py-3 sm:px-4">
                  <button
                    type="button"
                    onClick={() => handleToggle(p.id, p.is_active ?? true)}
                    disabled={pendingId !== null}
                    aria-pressed={p.is_active ?? true}
                    aria-label={`${p.is_active ? "Hide" : "Show"} ${p.title}`}
                    className={`min-h-11 rounded-full px-3 text-xs font-semibold ${
                    p.is_active ? "bg-[#e4f0da] text-[#145c34]" : "bg-slate-100 text-[var(--admin-ink)]"
                    }`}
                  >
                    {pendingId === p.id ? "Updating…" : p.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="break-words px-2 py-3 text-xs font-semibold text-[var(--admin-ink)] sm:px-4">{p.public_reviewed ? "Approved" : "Needs review"}</td>
                <td className="px-1 py-3 text-right sm:px-3">
                  <div className="flex flex-wrap justify-end gap-0.5">
                    <button type="button" onClick={() => openEdit(p)} disabled={pendingId !== null} className="min-h-11 rounded-[10px] px-1.5 font-semibold text-[#016936] hover:underline disabled:opacity-60">Edit</button>
                    <button type="button" onClick={() => handleDelete(p.id)} disabled={pendingId !== null} className="min-h-11 rounded-[10px] px-1.5 font-semibold text-red-700 hover:underline disabled:opacity-60">{pendingId === p.id ? "Deleting…" : "Delete"}</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--admin-muted)]">No products yet. Add a product to start building the catalogue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="product-editor-title" className="max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[12px] border border-[var(--admin-border)] bg-[var(--admin-page)] p-5 shadow-[0_24px_72px_rgba(0,0,0,0.25)] sm:max-h-[90vh] sm:rounded-[12px] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 id="product-editor-title" ref={editorHeadingRef} tabIndex={-1} className="display-font rounded-[10px] text-2xl font-semibold text-[var(--admin-ink)] focus:outline-none">
                {justSaved ? (isNew ? "Product added" : "Changes saved") : isNew ? "Add product" : "Edit product"}
              </h2>
              <button type="button" onClick={close} disabled={saving} aria-label="Close product editor" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--admin-border)] text-xl text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-page)] disabled:opacity-50">
                <MdClose aria-hidden="true" />
              </button>
            </div>

            {justSaved && savedSnapshot ? (
              <div role="status" className="flex flex-col gap-4">
                <p className="text-sm leading-6 text-[var(--admin-muted)]">
                  {isNew
                    ? "The product was added to the catalogue list."
                    : "Your changes were saved."}
                </p>
                <div className="rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
                  <p className="text-base font-bold text-[var(--admin-ink)]">{savedSnapshot.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${savedSnapshot.is_active ? "bg-[#e4f0da] text-[#145c34]" : "bg-[var(--admin-page)] text-[var(--admin-ink)]"}`}>
                      {savedSnapshot.is_active ? "Active" : "Hidden"}
                    </span>
                    <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${savedSnapshot.public_reviewed ? "bg-[#e4f0da] text-[#145c34]" : "bg-[var(--admin-page)] text-[var(--admin-ink)]"}`}>
                      {savedSnapshot.public_reviewed ? "Reviewed" : "Needs review"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col-reverse justify-end gap-3 border-t border-[var(--admin-border)] pt-4 sm:flex-row">
                  {isNew ? (
                    <>
                      <button type="button" onClick={close} className="min-h-11 rounded-[10px] px-5 text-sm font-semibold text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-page)]">Done</button>
                      <button type="button" onClick={addAnother} className="min-h-11 rounded-[10px] bg-[#016936] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#015a2d]">Add another product</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={backToForm} className="min-h-11 rounded-[10px] px-5 text-sm font-semibold text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-page)]">Keep editing</button>
                      <button type="button" onClick={close} autoFocus className="min-h-11 rounded-[10px] bg-[#016936] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#015a2d]">Done</button>
                    </>
                  )}
                </div>
              </div>
            ) : (
            <form onSubmit={(event) => { event.preventDefault(); void handleSave(); }} className="flex flex-col gap-4">
              {field("title", "Title")}
              {field("region", "Region")}
              {field("display_order", "Display Order", "number")}

              {/* Image upload */}
              <ImageUploader
                currentUrl={editing.image_url ?? ""}
                onUploaded={(url) => setEditing((prev) => prev ? { ...prev, image_url: url } : prev)}
              />

              {field("image_alt", "Image Alt Text")}

              <div>
                <label htmlFor="product-description" className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Description</label>
                <textarea
                  id="product-description"
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing((prev) => prev ? { ...prev, description: e.target.value } : prev)}
                  className="w-full resize-y rounded-[12px] border border-[var(--admin-border)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="product-active"
                  type="checkbox"
                  checked={editing.is_active ?? true}
                  onChange={(e) => setEditing((prev) => prev ? { ...prev, is_active: e.target.checked } : prev)}
                  className="size-4 accent-[#016936]"
                />
                <label htmlFor="product-active" className="text-sm font-semibold text-[var(--admin-ink)]">Show on the public site</label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  id="product-reviewed"
                  type="checkbox"
                  checked={editing.public_reviewed ?? false}
                  onChange={(event) => setEditing((prev) => prev ? { ...prev, public_reviewed: event.target.checked } : prev)}
                  className="mt-1 size-5 accent-[#016936]"
                />
                <div>
                  <label htmlFor="product-reviewed" className="text-sm font-semibold text-[var(--admin-ink)]">Reviewed for public display</label>
                  <p className="mt-1 text-xs leading-5 text-[var(--admin-muted)]">Only approved products appear in the public catalogue.</p>
                </div>
              </div>
              {saveError && <p role="alert" className="rounded-[12px] border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{saveError}</p>}

              <div className="mt-2 flex flex-col-reverse justify-end gap-3 border-t border-[var(--admin-border)] pt-4 sm:flex-row">
                <button type="button" onClick={close} disabled={saving} className="min-h-11 rounded-[10px] bg-[var(--admin-page)] px-5 text-sm font-semibold text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-active)] disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving} aria-busy={saving} className="min-h-11 rounded-[10px] bg-[#016936] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#015a2d] disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : "Save product"}</button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
