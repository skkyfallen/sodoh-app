"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <div
          key="success"
          role="status"
          className="contact-status-message mb-6 rounded-[12px] border border-[var(--border)] bg-[var(--brand-soft)] px-5 py-4 text-sm font-semibold text-[var(--ink)]"
        >
          Your message was sent. We’ll be in touch as soon as we can.
        </div>
      )}
      {status === "error" && (
        <div
          key="error"
          role="alert"
          className="contact-status-message mb-6 rounded-[12px] border border-red-300 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
        >
          We couldn’t send your message. Please try again or email us at{" "}
          <a className="underline underline-offset-2" href="mailto:info@sodohnigeria.com">info@sodohnigeria.com</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-name">Name</Label>
            <Input id="contact-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Your full name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">Email address</Label>
            <Input id="contact-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-subject">What is this about?</Label>
          <select
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="min-h-12 w-full appearance-none rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 text-[15px] text-[var(--ink)] transition-colors hover:border-[var(--brand)]/50 focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
          >
            {subjects.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about volumes, timing, or partnership details…" />
        </div>

        <Button type="submit" size="lg" disabled={status === "loading"} aria-busy={status === "loading"} className="w-full sm:w-max">
          {status === "loading" ? "Sending message…" : "Send message →"}
        </Button>
      </form>
    </div>
  );
}
