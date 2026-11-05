"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography component="label" variant="subtitle2" sx={{ fontWeight: 600 }}>
        Product image
      </Typography>

      {currentUrl ? (
        <Box
          sx={{
            position: "relative",
            aspectRatio: "16 / 9",
            width: "100%",
            overflow: "hidden",
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.admin.border}`,
            bgcolor: "#f1f5f9",
          }}
        >
          <Image src={(() => { if (currentUrl.startsWith("/") && !currentUrl.startsWith("//") && !currentUrl.includes("\\")) return currentUrl; try { const url = new URL(currentUrl); return url.protocol === "https:" && url.hostname ? currentUrl : "/images/produce-fields.jpg"; } catch { return "/images/produce-fields.jpg"; } })()} alt="Product preview" fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: "cover" }} />
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 1, p: 1 }}>
            <Button
              type="button"
              variant="contained"
              color="inherit"
              onClick={handleRemove}
              disabled={uploading}
              sx={{ minHeight: 44, borderRadius: 999, color: "#b42323", bgcolor: "rgba(255,255,255,0.95)" }}
            >
              Remove
            </Button>
            <Button
              type="button"
              variant="contained"
              color="inherit"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              sx={{ minHeight: 44, borderRadius: 999, bgcolor: "rgba(255,255,255,0.95)" }}
            >
              {uploading ? "Uploading…" : "Replace"}
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          type="button"
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            flexDirection: "column",
            gap: 0.5,
            borderStyle: "dashed",
            textTransform: "none",
            color: (theme) => theme.palette.admin.muted,
            borderColor: (theme) => theme.palette.admin.border,
          }}
        >
          {uploading ? (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Uploading…</Typography>
          ) : (
            <>
              <MdCloudUpload aria-hidden="true" size="1.75rem" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Click to upload image</Typography>
              <Typography variant="caption">PNG, JPG, WEBP — max 50 MB</Typography>
            </>
          )}
        </Button>
      )}

      {uploading && currentUrl && <Typography role="status" variant="body2" color="text.secondary">Uploading replacement image…</Typography>}
      {error && <Alert severity="error">{error} You can choose another image and try again.</Alert>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </Box>
  );
}

// ─── Products manager ────────────────────────────────────────────────────────

type Notice = { message: string; severity: "success" | "error" };

export default function ProductsManager({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<{
    title: string;
    is_active: boolean;
    public_reviewed: boolean;
  } | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const editorHeadingRef = useRef<HTMLHeadingElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const dialogOpen = editing !== null;

  const supabase = createClient();

  const focusFirstField = () => {
    dialogContentRef.current?.querySelector<HTMLElement>("input:not([type=checkbox]), textarea, button")?.focus();
  };

  const openNew = () => {
    setSaveError(null);
    setNotice(null);
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
    setSaveError(null);
    setNotice(null);
    setJustSaved(false);
    setSavedSnapshot(null);
    setEditing({ ...p });
    setIsNew(false);
  };

  const close = () => {
    if (saving) return;
    setEditing(null);
    setIsNew(false);
    setJustSaved(false);
    setSavedSnapshot(null);
  };

  const backToForm = () => {
    setJustSaved(false);
    setSavedSnapshot(null);
    focusFirstField();
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
    focusFirstField();
  };

  const handleNoticeClose = (_event?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setNotice(null);
  };

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
      setNotice({ message: `Product added: ${saved.title}`, severity: "success" });
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
      setNotice({ message: `Changes saved: ${editing.title}`, severity: "success" });
    }

    setSaving(false);
    setJustSaved(true);
    requestAnimationFrame(() => editorHeadingRef.current?.focus());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setNotice(null);
    setPendingId(id);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setNotice({ message: "Product deleted.", severity: "success" });
    } catch {
      setNotice({ message: "This product could not be deleted. Check your connection and try again.", severity: "error" });
    } finally {
      setPendingId(null);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setNotice(null);
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
      const toggled = products.find((p) => p.id === id);
      setNotice({
        message: !current ? `Product shown: ${toggled?.title ?? ""}`.trim() : `Product hidden: ${toggled?.title ?? ""}`.trim(),
        severity: "success",
      });
    } catch {
      setNotice({ message: "This product could not be updated. Check your connection and try again.", severity: "error" });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Box>
      <Button type="button" variant="contained" onClick={openNew} sx={{ mb: 3, minHeight: 44 }}>
        <Box component="span" aria-hidden="true" sx={{ fontSize: "1.125rem", lineHeight: 1, mr: 1.5 }}>
          +
        </Box>
        Add product
      </Button>

      <Snackbar
        open={notice !== null}
        autoHideDuration={notice?.severity === "error" ? null : 5000}
        onClose={handleNoticeClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={notice?.severity ?? "success"} onClose={() => setNotice(null)} sx={{ width: "100%" }}>
          {notice?.message}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper} elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.admin.border}` }}>
        <Table size="medium" aria-label="Products">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Region</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Review</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => {
              const pending = pendingId === p.id;
              return (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>{p.display_order}</TableCell>
                  <TableCell sx={{ fontWeight: 600, overflowWrap: "break-word" }}>{p.title}</TableCell>
                  <TableCell sx={{ color: "text.secondary", overflowWrap: "break-word" }}>{p.region}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Switch
                        checked={p.is_active ?? true}
                        onChange={() => handleToggle(p.id, p.is_active ?? true)}
                        disabled={pendingId !== null}
                        slotProps={{ input: { "aria-label": `${p.is_active ? "Hide" : "Show"} ${p.title}` } }}
                        color="success"
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600 }} role={pending ? "status" : undefined}>
                        {pending ? "Updating…" : p.is_active ? "Active" : "Hidden"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={p.public_reviewed ? "Approved" : "Needs review"}
                      color={p.public_reviewed ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                      <Button
                        type="button"
                        onClick={() => openEdit(p)}
                        disabled={pendingId !== null}
                        sx={{ minHeight: 44, minWidth: 44, color: "primary.main", fontWeight: 600 }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        color="error"
                        onClick={() => handleDelete(p.id)}
                        disabled={pendingId !== null}
                        sx={{ minHeight: 44, minWidth: 44, fontWeight: 600 }}
                      >
                        {pending ? "Deleting…" : "Delete"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Alert severity="info" sx={{ my: 1 }}>
                    No products yet. Add a product to start building the catalogue.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={(_event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") close();
        }}
        aria-labelledby="product-editor-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          id="product-editor-title"
          ref={editorHeadingRef}
          tabIndex={-1}
          sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, "&:focus": { outline: "none" } }}
        >
          {justSaved ? (isNew ? "Product added" : "Changes saved") : isNew ? "Add product" : "Edit product"}
          <IconButton
            type="button"
            onClick={close}
            disabled={saving}
            aria-label="Close product editor"
            sx={{ width: 44, height: 44 }}
          >
            <MdClose aria-hidden="true" />
          </IconButton>
        </DialogTitle>

        {justSaved && savedSnapshot ? (
          <>
            <DialogContent dividers>
              <Stack spacing={2} role="status">
                <Typography variant="body2" color="text.secondary">
                  {isNew ? "The product was added to the catalogue list." : "Your changes were saved."}
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {savedSnapshot.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    <Chip
                      size="small"
                      label={savedSnapshot.is_active ? "Active" : "Hidden"}
                      color={savedSnapshot.is_active ? "success" : "default"}
                    />
                    <Chip
                      size="small"
                      label={savedSnapshot.public_reviewed ? "Reviewed" : "Needs review"}
                      color={savedSnapshot.public_reviewed ? "success" : "default"}
                    />
                  </Stack>
                </Paper>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, flexDirection: { xs: "column-reverse", sm: "row" }, alignItems: "stretch", "& > *": { flex: { sm: "none" } } }}>
              {isNew ? (
                <>
                  <Button type="button" onClick={close} sx={{ minHeight: 44 }}>
                    Done
                  </Button>
                  <Button type="button" variant="contained" onClick={addAnother} sx={{ minHeight: 44 }}>
                    Add another product
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" onClick={backToForm} sx={{ minHeight: 44 }}>
                    Keep editing
                  </Button>
                  <Button type="button" variant="contained" onClick={close} autoFocus sx={{ minHeight: 44 }}>
                    Done
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            <DialogContent dividers ref={dialogContentRef}>
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <TextField
                  id="product-field-title"
                  label="Title"
                  required
                  fullWidth
                  value={String(editing?.title ?? "")}
                  slotProps={{ htmlInput: { autoFocus: true } }}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
                />
                <TextField
                  id="product-field-region"
                  label="Region"
                  fullWidth
                  value={String(editing?.region ?? "")}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, region: e.target.value } : prev))}
                />
                <TextField
                  id="product-field-display_order"
                  label="Display Order"
                  type="number"
                  fullWidth
                  value={String(editing?.display_order ?? "")}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, display_order: Number(e.target.value) } : prev))}
                />
                <ImageUploader
                  currentUrl={editing?.image_url ?? ""}
                  onUploaded={(url) => setEditing((prev) => (prev ? { ...prev, image_url: url } : prev))}
                />
                <TextField
                  id="product-field-image_alt"
                  label="Image Alt Text"
                  fullWidth
                  value={String(editing?.image_alt ?? "")}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, image_alt: e.target.value } : prev))}
                />
                <TextField
                  id="product-field-description"
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={String(editing?.description ?? "")}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id="product-active"
                      checked={editing?.is_active ?? true}
                      onChange={(e) => setEditing((prev) => (prev ? { ...prev, is_active: e.target.checked } : prev))}
                    />
                  }
                  label="Show on the public site"
                />
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="product-reviewed"
                        checked={editing?.public_reviewed ?? false}
                        onChange={(e) => setEditing((prev) => (prev ? { ...prev, public_reviewed: e.target.checked } : prev))}
                      />
                    }
                    label="Reviewed for public display"
                  />
                  <FormHelperText sx={{ ml: 4 }}>
                    Only approved products appear in the public catalogue.
                  </FormHelperText>
                </Box>
                {saveError && <Alert severity="error">{saveError}</Alert>}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button type="button" onClick={close} disabled={saving} sx={{ minHeight: 44 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving} aria-busy={saving} sx={{ minHeight: 44 }}>
                {saving ? "Saving…" : "Save product"}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </Box>
  );
}
