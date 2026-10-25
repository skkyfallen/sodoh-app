"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "@/types/content";

type Props = { product: Product };

const fieldClass = "h-12 w-full border border-[#cbd5cb] bg-white px-4 text-sm text-[#17241d] placeholder:text-[#87938a] transition-colors focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/15";

export default function ProductRequestButton({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    setOpen(false);
    if (success) reset();
  };

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button, input, textarea")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (success) {
          setQuantity("1");
          setName("");
          setEmail("");
          setPhone("");
          setMessage("");
          setError(null);
          setSuccess(false);
        }
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, success]);

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
        setError(data.error ?? "Something went wrong. Please try again.");
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
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="group inline-flex min-h-11 w-full items-center justify-between border border-[#016936] px-4 text-xs font-bold text-[#016936] transition-colors hover:bg-[#016936] hover:text-white focus-visible:outline-[#016936]">
        Request a quote <span aria-hidden="true" className="text-base transition-transform group-hover:translate-x-0.5">↗</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#071a10]/65 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${dialogId}-title`} aria-describedby={`${dialogId}-description`} className="max-h-[94dvh] w-full max-w-xl overflow-y-auto bg-[#f8f8f2] shadow-[0_28px_90px_rgba(0,0,0,0.3)] sm:max-h-[90vh]">
            <div className="flex items-start justify-between gap-6 bg-[#123d2a] px-5 py-6 text-white sm:px-8 sm:py-8">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b5eb71]">Product enquiry</p>
                <h2 id={`${dialogId}-title`} className="display-font max-w-[15ch] text-2xl font-medium leading-tight tracking-[-0.03em] sm:text-3xl">Request {product.title}</h2>
                <p id={`${dialogId}-description`} className="mt-2 text-sm leading-6 text-white/70">Tell us what you need and how to reach you.</p>
              </div>
              <button type="button" onClick={close} aria-label="Close quote request" className="flex size-10 shrink-0 items-center justify-center border border-white/25 text-2xl leading-none text-white transition-colors hover:bg-white/10 focus-visible:outline-white">×</button>
            </div>

            {success ? (
              <div className="px-5 py-10 text-center sm:px-8 sm:py-14">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e4f0da] text-2xl font-bold text-[#016936]" aria-hidden="true">✓</div>
                <h3 className="display-font mt-5 text-2xl font-semibold text-[#17241d]">Request received</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#59685d]">We’ll be in touch about your {quantity} kg of {product.title} shortly.</p>
                <button type="button" onClick={close} className="mt-7 min-h-11 bg-[#016936] px-7 text-sm font-bold text-white transition-colors hover:bg-[#014e29]">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
                <div className="grid gap-5 sm:grid-cols-[0.6fr_1.4fr]">
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${dialogId}-quantity`} className="text-xs font-bold text-[#34463a]">Quantity (kg) <span aria-hidden="true" className="text-red-700">*</span></label>
                    <input id={`${dialogId}-quantity`} type="number" min="0.5" step="0.5" value={quantity} onChange={(event) => setQuantity(event.target.value)} required className={fieldClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${dialogId}-name`} className="text-xs font-bold text-[#34463a]">Full name <span aria-hidden="true" className="text-red-700">*</span></label>
                    <input id={`${dialogId}-name`} type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required className={fieldClass} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${dialogId}-email`} className="text-xs font-bold text-[#34463a]">Email address <span aria-hidden="true" className="text-red-700">*</span></label>
                    <input id={`${dialogId}-email`} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className={fieldClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${dialogId}-phone`} className="text-xs font-bold text-[#34463a]">Phone <span className="font-normal text-[#718076]">(optional)</span></label>
                    <input id={`${dialogId}-phone`} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${dialogId}-message`} className="text-xs font-bold text-[#34463a]">Notes <span className="font-normal text-[#718076]">(optional)</span></label>
                  <textarea id={`${dialogId}-message`} value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className="w-full resize-y border border-[#cbd5cb] bg-white px-4 py-3 text-sm text-[#17241d] transition-colors focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/15" />
                </div>
                {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
                <div className="flex flex-col-reverse gap-3 border-t border-[#d9e1da] pt-5 sm:flex-row sm:justify-end">
                  <button type="button" onClick={close} className="min-h-11 px-5 text-sm font-bold text-[#526157] transition-colors hover:bg-[#e9eee7]">Cancel</button>
                  <button type="submit" disabled={submitting} className="min-h-11 bg-[#016936] px-6 text-sm font-bold text-white transition-colors hover:bg-[#014e29] disabled:cursor-wait disabled:opacity-60">{submitting ? "Sending…" : "Send quote request"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
