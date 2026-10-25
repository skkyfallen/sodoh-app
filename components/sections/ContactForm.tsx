"use client";

import { useState, type FormEvent } from "react";
import AnimateIn from "@/components/ui/AnimateIn";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimateIn variant="fade-up" duration={550} threshold={0.1}>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#016936]">Start a conversation</p>
      <h3 className="display-font mb-7 text-3xl font-medium tracking-[-0.04em] text-[#17241d] md:text-4xl">Send us a message</h3>

      {status === "success" && (
        <div role="status" className="mb-6 border border-[#a8c6a9] bg-[#edf5eb] px-5 py-4 text-sm font-semibold text-[#145c34]">
          ✓ Your message has been sent! We&apos;ll get back to you within 3–5 business days.
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-sm font-semibold text-[#34463a]">
            Full Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="h-12 w-full border border-[#cbd5cb] bg-white px-4 text-sm text-[#17241d] transition-colors placeholder:text-[#7a887e] focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/15"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm font-semibold text-[#34463a]">
            Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="h-12 w-full border border-[#cbd5cb] bg-white px-4 text-sm text-[#17241d] transition-colors placeholder:text-[#7a887e] focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/15"
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className="text-sm font-semibold text-[#34463a]">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="h-12 w-full border border-[#cbd5cb] bg-white px-4 text-sm text-[#17241d] transition-colors focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/15"
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className="text-sm font-semibold text-[#34463a]">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            className="w-full resize-y border border-[#cbd5cb] bg-white p-4 text-sm text-[#17241d] transition-colors placeholder:text-[#7a887e] focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/15"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-h-12 w-full items-center justify-center bg-[#016936] px-8 text-sm font-bold text-white transition-colors hover:bg-[#014e29] disabled:cursor-not-allowed disabled:opacity-60 md:w-max"
        >
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </AnimateIn>
  );
}
