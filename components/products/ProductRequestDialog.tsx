"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "@/types/content";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import { sodohButtonBaseSx, sodohFieldSx, sodohGhostButtonSx, sodohPrimaryButtonSx } from "@/components/sections/sodoh-mui";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
};

export default function ProductRequestDialog({ product, open, onClose }: Props) {
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogId = useId();

  const reset = () => {
    setQuantity("1");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setError(null);
    setSuccess(false);
  };

  const close = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleDialogClose = (_event: object, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") close();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/product-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          product_title: product.title,
          quantity_kg: Number(quantity),
          name,
          email,
          phone,
          message,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(`${data.error ?? "We couldn’t send your request."} Please check your details and try again.`);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("We couldn’t send your request. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby={`${dialogId}-title`}
      aria-describedby={`${dialogId}-description`}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "18px",
            backgroundColor: "var(--surface)",
            color: "var(--ink)",
            backgroundImage: "none",
          },
        },
        backdrop: { sx: { backgroundColor: "rgba(7,26,16,0.6)" } },
      }}
    >
      <DialogTitle
        id={`${dialogId}-title`}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2.5, sm: 4 },
          pt: { xs: 2.5, sm: 4 },
          pb: 0,
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "1.5rem",
          letterSpacing: "-0.03em",
          color: "var(--ink)",
        }}
      >
        Request {product.title}
        <IconButton
          type="button"
          onClick={close}
          disabled={submitting}
          aria-label="Close quote request"
          sx={{
            width: 44,
            height: 44,
            mt: -1,
            mr: -1,
            color: "var(--body)",
            "&:hover": { backgroundColor: "var(--surface-soft)", color: "var(--ink)" },
          }}
        >
          <CloseIcon aria-hidden="true" />
        </IconButton>
      </DialogTitle>

      {success ? (
        <>
          <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
            <div role="status" aria-live="polite">
              <h3 className="display-font text-2xl font-semibold text-[var(--ink)]">Request sent</h3>
              <DialogContentText
                sx={{ mt: 1.5, fontSize: "0.875rem", lineHeight: 1.6, color: "var(--body)" }}
              >
                Your enquiry for {quantity} kg of {product.title} was sent. Our team will follow up using the contact details you provided.
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2.5, sm: 4 }, pb: { xs: 2.5, sm: 4 } }}>
            <Button
              onClick={close}
              sx={[sodohButtonBaseSx, sodohPrimaryButtonSx, { minHeight: 44, paddingLeft: 3, paddingRight: 3, fontSize: "0.875rem" }]}
            >
              Close
            </Button>
          </DialogActions>
        </>
      ) : (
        <form onSubmit={submit}>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              px: { xs: 2.5, sm: 4 },
              py: 3,
            }}
          >
            <DialogContentText
              id={`${dialogId}-description`}
              sx={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--body)" }}
            >
              Share your requirements and contact details with our team.
            </DialogContentText>
            <div className="grid gap-5 sm:grid-cols-[0.6fr_1.4fr]">
              <TextField
                id={`${dialogId}-quantity`}
                label="Quantity (kg)"
                type="number"
                slotProps={{ htmlInput: { min: 0.5, step: 0.5 } }}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
                fullWidth
                sx={sodohFieldSx}
              />
              <TextField
                id={`${dialogId}-name`}
                label="Full name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
                placeholder="Your full name"
                sx={sodohFieldSx}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id={`${dialogId}-email`}
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
                placeholder="you@example.com"
                sx={sodohFieldSx}
              />
              <TextField
                id={`${dialogId}-phone`}
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                fullWidth
                placeholder="+234 …"
                sx={sodohFieldSx}
              />
            </div>
            <TextField
              id={`${dialogId}-message`}
              label="Notes (optional)"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Volumes, timing, delivery notes…"
              sx={sodohFieldSx}
            />
            {error && (
              <Alert
                severity="error"
                role="alert"
                sx={{
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  backgroundColor: "#fef2f2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  "& .MuiAlert-icon": { color: "#b42323" },
                }}
              >
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              px: { xs: 2.5, sm: 4 },
              pb: { xs: 2.5, sm: 4 },
              pt: 2.5,
              borderTop: "1px solid var(--border)",
              gap: 1.5,
              flexDirection: { xs: "column-reverse", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: { sm: "flex-end" },
            }}
          >
            <Button
              type="button"
              onClick={close}
              disabled={submitting}
              sx={[sodohButtonBaseSx, sodohGhostButtonSx, { minHeight: 44, paddingLeft: 2.5, paddingRight: 2.5, fontSize: "0.875rem" }]}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              sx={[sodohButtonBaseSx, sodohPrimaryButtonSx, { minHeight: 44, paddingLeft: 2.5, paddingRight: 2.5, fontSize: "0.875rem" }]}
            >
              {submitting ? "Sending request…" : "Send quote request"}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
