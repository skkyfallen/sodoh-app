"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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

type Notice = { message: string; severity: "success" | "error" };

export default function CrudManager({ tableName, fields, initialRows, listColumns }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const supabase = createClient();
  const colKeys = listColumns ?? fields.slice(0, 3).map((f) => f.key);
  const dialogOpen = editing !== null;

  const openNew = () => {
    setSaveError(null);
    setNotice(null);
    const blank: Record<string, unknown> = { id: "" };
    for (const f of fields) {
      blank[f.key] = f.type === "number" ? 0 : f.type === "checkbox" ? f.key !== "public_reviewed" : "";
    }
    setEditing(blank);
    setIsNew(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setSaveError(null);
    setNotice(null);
    setEditing({ ...row });
    setIsNew(false);
  };

  const close = () => {
    if (saving) return;
    setEditing(null);
    setIsNew(false);
  };

  const handleNoticeClose = (_event?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setNotice(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);

    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      payload[f.key] = editing[f.key];
    }

    if (isNew) {
      // The database still requires this legacy column, but it is no longer user-editable.
      if (tableName === "pillars") payload.step = String(rows.length + 1).padStart(2, "0");

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
      setNotice({ message: "Item saved.", severity: "success" });
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
      setNotice({ message: "Item saved.", severity: "success" });
    }

    setSaving(false);
    close();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setNotice(null);
    setDeletingId(id);
    try {
      const { error } = await supabase.from(tableName as never).delete().eq("id", id);
      if (error) throw error;
      setRows((prev) => prev.filter((r) => (r.id as string) !== id));
      setNotice({ message: "Item deleted.", severity: "success" });
    } catch {
      setNotice({ message: "This item could not be deleted. Check your connection and try again.", severity: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box>
      <Button
        type="button"
        variant="contained"
        onClick={openNew}
        sx={{ mb: 3, minHeight: 44 }}
      >
        <Box component="span" aria-hidden="true" sx={{ fontSize: "1.125rem", lineHeight: 1, mr: 1.5 }}>
          +
        </Box>
        Add item
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
        <Table size="medium" aria-label="Managed items">
          <TableHead>
            <TableRow>
              {colKeys.map((k) => (
                <TableCell key={k} sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                  {k.replace(/_/g, " ")}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id as string} hover>
                {colKeys.map((k) =>
                  typeof row[k] === "boolean" ? (
                    <TableCell key={k}>
                      <Chip
                        size="small"
                        label={row[k] ? "Yes" : "No"}
                        color={row[k] ? "success" : "default"}
                      />
                    </TableCell>
                  ) : (
                    <TableCell key={k} sx={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {String(row[k] ?? "")}
                    </TableCell>
                  )
                )}
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <Button
                      type="button"
                      onClick={() => openEdit(row)}
                      sx={{ minHeight: 44, minWidth: 44, color: "primary.main", fontWeight: 600 }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      color="error"
                      onClick={() => handleDelete(row.id as string)}
                      disabled={deletingId !== null}
                      sx={{ minHeight: 44, minWidth: 44, fontWeight: 600 }}
                    >
                      {deletingId === row.id ? "Deleting…" : "Delete"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={colKeys.length + 1}>
                  <Alert severity="info" sx={{ my: 1 }}>
                    No items yet. Add one to get started.
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
        aria-labelledby="crud-editor-title"
        fullWidth
        maxWidth="sm"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <DialogTitle
            id="crud-editor-title"
            sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}
          >
            {isNew ? "Add item" : "Edit item"}
            <IconButton
              type="button"
              onClick={close}
              disabled={saving}
              aria-label="Close editor"
              sx={{ width: 44, height: 44 }}
            >
              <MdClose aria-hidden="true" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              {fields.map((f, index) => {
                const val = editing?.[f.key];
                const inputId = `crud-field-${f.key}`;
                if (f.type === "checkbox") {
                  return (
                    <Box key={f.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={inputId}
                            checked={Boolean(val)}
                            autoFocus={index === 0}
                            onChange={(e) =>
                              setEditing((prev) => (prev ? { ...prev, [f.key]: e.target.checked } : prev))
                            }
                          />
                        }
                        label={f.label}
                      />
                      {f.key === "public_reviewed" && (
                        <FormHelperText sx={{ ml: 4 }}>
                          Unreviewed content is hidden from the public site.
                        </FormHelperText>
                      )}
                    </Box>
                  );
                }
                if (f.type === "textarea") {
                  return (
                    <TextField
                      key={f.key}
                      id={inputId}
                      label={f.label}
                      multiline
                      rows={3}
                      fullWidth
                      value={String(val ?? "")}
                      slotProps={{ htmlInput: { autoFocus: index === 0 } }}
                      onChange={(e) =>
                        setEditing((prev) => (prev ? { ...prev, [f.key]: e.target.value } : prev))
                      }
                    />
                  );
                }
                return (
                  <TextField
                    key={f.key}
                    id={inputId}
                    label={f.label}
                    type={f.type === "number" ? "number" : "text"}
                    fullWidth
                    value={String(val ?? "")}
                    slotProps={{ htmlInput: { autoFocus: index === 0 } }}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev
                          ? { ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }
                          : prev
                      )
                    }
                  />
                );
              })}
              {saveError && <Alert severity="error">{saveError}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button type="button" onClick={close} disabled={saving} sx={{ minHeight: 44 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving} aria-busy={saving} sx={{ minHeight: 44 }}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Typography component="span" role="status" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {notice?.severity === "success" ? notice.message : ""}
      </Typography>
    </Box>
  );
}
