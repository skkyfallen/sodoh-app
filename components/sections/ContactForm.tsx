"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

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

const fieldClass = "min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-base text-[var(--ink)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20";

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
      <p className="mb-7 max-w-[52ch] text-sm leading-6 text-[var(--body)]">
        Tell us what you are looking for and our team will get back to you. Name, email address, and message are required.
      </p>

      {status === "success" && (
        <div role="status" className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--brand-soft)] px-5 py-4 text-sm font-semibold text-[var(--ink)]">
          Your message was sent. We’ll be in touch as soon as we can.
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="mb-6 rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          We couldn’t send your message. Please try again or email us at <a className="underline underline-offset-2" href="mailto:info@sodohnigeria.com">info@sodohnigeria.com</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="text-sm font-semibold text-[var(--ink)]">Name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="text-sm font-semibold text-[var(--ink)]">Email address</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} className={fieldClass} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-subject" className="text-sm font-semibold text-[var(--ink)]">What is this about?</label>
          <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange} className={fieldClass}>
            {subjects.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className="text-sm font-semibold text-[var(--ink)]">Message</label>
          <textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} className={`${fieldClass} min-h-36 resize-y py-3`} />
        </div>

        <button type="submit" disabled={status === "loading"} aria-busy={status === "loading"} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--brand)] px-7 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--brand-hover)] active:translate-y-0 disabled:cursor-wait disabled:opacity-60 dark:text-[#062a17] sm:w-max">
          {status === "loading" ? "Sending message…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
