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
    <AnimateIn variant="fade-right" duration={700} threshold={0.1}>
      <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

      {status === "success" && (
        <div className="mb-6 rounded-xl bg-[#0df20d]/10 border border-[#0df20d]/30 px-5 py-4 text-sm font-semibold text-[#0ac20a]">
          ✓ Your message has been sent! We&apos;ll get back to you within 3–5 business days.
        </div>
      )}
      {status === "error" && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm font-semibold text-red-600">
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-slate-800">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0df20d] focus:border-[#0df20d] h-12 px-4 text-sm transition-all"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-800">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0df20d] focus:border-[#0df20d] h-12 px-4 text-sm transition-all"
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className="text-sm font-semibold text-slate-800">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0df20d] focus:border-[#0df20d] h-12 px-4 text-sm transition-all"
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-semibold text-slate-800">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            className="w-full rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0df20d] focus:border-[#0df20d] p-4 text-sm resize-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full md:w-max px-12 h-12 bg-[#0df20d] text-[#102210] font-bold rounded-lg transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </AnimateIn>
  );
}
