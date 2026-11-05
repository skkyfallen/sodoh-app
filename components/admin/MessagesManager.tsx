"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ContactSubmission } from "@/types/content";

type Props = {
  initialMessages: ContactSubmission[];
};

type Notice = { message: string; severity: "success" | "error" };

const chipColorFor = (status: string): "success" | "info" | "default" =>
  status === "new" ? "success" : status === "read" ? "info" : "default";

export default function MessagesManager({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const supabase = createClient();

  const updateStatus = async (id: string, status: "new" | "read" | "archived") => {
    setNotice(null);
    setPendingId(id);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      setNotice(null);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch {
      setNotice({ message: "This message could not be updated. Check your connection and try again.", severity: "error" });
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setNotice(null);
    setPendingId(id);
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
      setNotice(null);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      setNotice({ message: "Message deleted.", severity: "success" });
    } catch {
      setNotice({ message: "This message could not be deleted. Check your connection and try again.", severity: "error" });
    } finally {
      setPendingId(null);
    }
  };

  const handleNoticeClose = (_event?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setNotice(null);
  };

  return (
    <Box>
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

      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        {/* List */}
        <Paper elevation={0} sx={{ flex: 1, overflow: "hidden", border: (theme) => `1px solid ${theme.palette.admin.border}` }}>
          {messages.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="info">
                No messages yet. New contact form messages will appear here.
              </Alert>
            </Box>
          ) : (
            <List
              disablePadding
              sx={{ maxHeight: "70vh", overflowY: "auto" }}
              aria-label="Contact messages"
            >
              {messages.map((m) => (
                <ListItemButton
                  key={m.id}
                  type="button"
                  aria-pressed={selected?.id === m.id}
                  selected={selected?.id === m.id}
                  disabled={pendingId !== null}
                  onClick={() => {
                    setSelected(m);
                    setNotice(null);
                    if (m.status === "new") updateStatus(m.id, "read");
                  }}
                  divider
                  sx={{
                    alignItems: "flex-start",
                    px: 2.5,
                    py: 2,
                    "&.Mui-selected": {
                      bgcolor: (theme) => theme.palette.admin.active,
                      "&:hover": { bgcolor: (theme) => theme.palette.admin.active },
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 0.5 }}>
                        <Typography component="span" variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {m.name}
                        </Typography>
                        <Chip size="small" label={m.status} color={chipColorFor(m.status)} />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m.subject ?? "No subject"}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary">
                          {new Date(m.created_at).toLocaleDateString("en-NG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>

        {/* Detail */}
        <Box sx={{ flex: 1 }}>
          {selected ? (
            <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.admin.border}` }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>
                      {selected.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selected.email}
                    </Typography>
                  </Box>
                  <Chip label={selected.status} color={chipColorFor(selected.status)} />
                </Stack>

                {selected.subject && (
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Subject: {selected.subject}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                  {selected.message}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
                  {new Date(selected.created_at).toLocaleString("en-NG")}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {selected.status !== "new" && (
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => updateStatus(selected.id, "new")}
                      disabled={pendingId !== null}
                      sx={{ minHeight: 44 }}
                    >
                      Mark New
                    </Button>
                  )}
                  {selected.status !== "read" && (
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => updateStatus(selected.id, "read")}
                      disabled={pendingId !== null}
                      sx={{ minHeight: 44 }}
                    >
                      Mark Read
                    </Button>
                  )}
                  {selected.status !== "archived" && (
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => updateStatus(selected.id, "archived")}
                      disabled={pendingId !== null}
                      sx={{ minHeight: 44 }}
                    >
                      Archive
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(selected.id)}
                    disabled={pendingId !== null}
                    sx={{ minHeight: 44 }}
                  >
                    {pendingId === selected.id ? "Updating…" : "Delete"}
                  </Button>
                </Stack>
                {pendingId === selected.id && <Typography role="status" variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>Updating message…</Typography>}
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={1.5}>
              <Alert severity="info">
                <AlertTitle>No message selected</AlertTitle>
                Select a message to review its details and update its status.
              </Alert>
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
