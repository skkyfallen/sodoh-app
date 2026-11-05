"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { sodohFieldSx, sodohPrimaryButtonSx, sodohButtonBaseSx } from "./sodoh-mui";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const subjects = [
  "General Inquiry",
  "Partnership Proposal",
  "Technical Support",
  "Press & Media",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("The contact service returned an error.");
      setStatus("success");
      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <h2 className="display-font mb-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--ink)] md:text-4xl">
        Send us a message
      </h2>
      <p className="mb-7 max-w-[52ch] text-[15px] leading-7 text-[var(--body)]">
        Tell us what you are looking for and our team will get back to you. Name, email address, and message are required.
      </p>

      {status === "success" && (
        <Alert
          severity="success"
          role="status"
          className="contact-status-message"
          sx={{
            mb: 3,
            borderRadius: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--brand-soft)",
            color: "var(--ink)",
            fontSize: "0.875rem",
            fontWeight: 600,
            "& .MuiAlert-icon": { color: "var(--brand)" },
          }}
        >
          Your message was sent. We’ll be in touch as soon as we can.
        </Alert>
      )}
      {status === "error" && (
        <Alert
          severity="error"
          role="alert"
          className="contact-status-message"
          sx={{
            mb: 3,
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontWeight: 600,
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            "& .MuiAlert-icon": { color: "#b42323" },
          }}
        >
          We couldn’t send your message. Please try again or email us at{" "}
          <a className="underline underline-offset-2" href="mailto:info@sodohnigerialtd.com">info@sodohnigerialtd.com</a>.
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="contact-name"
            name="name"
            label="Name"
            type="text"
            autoComplete="name"
            required
            fullWidth
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            sx={sodohFieldSx}
          />
          <TextField
            id="contact-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            fullWidth
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            sx={sodohFieldSx}
          />
        </div>

        <FormControl fullWidth sx={sodohFieldSx}>
          <InputLabel id="contact-subject-label">What is this about?</InputLabel>
          <Select
            labelId="contact-subject-label"
            id="contact-subject"
            name="subject"
            label="What is this about?"
            value={form.subject}
            onChange={handleChange}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          id="contact-message"
          name="message"
          label="Message"
          required
          multiline
          rows={5}
          fullWidth
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about volumes, timing, or partnership details…"
          sx={sodohFieldSx}
        />

        <Button
          type="submit"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          sx={[
            sodohButtonBaseSx,
            sodohPrimaryButtonSx,
            { minHeight: 48, paddingLeft: 3.5, paddingRight: 3.5, fontSize: "0.9375rem", width: { xs: "100%", sm: "auto" }, alignSelf: { xs: "stretch", sm: "flex-start" } },
          ]}
        >
          {status === "loading" ? "Sending message…" : "Send message →"}
        </Button>
      </form>
    </div>
  );
}
