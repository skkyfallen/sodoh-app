"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MdClose } from "react-icons/md";
import type { Product } from "@/types/content";

type Props = { product: Product };

const fieldClass = "min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-base text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20";

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
  const submittingRef = useRef(false);
  const reduceMotion = useReducedMotion();
  submittingRef.current = submitting;

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
    setOpen(false);
    reset();
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input:not([disabled]), textarea:not([disabled])")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!submittingRef.current) close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      ));
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
      triggerRef.current?.focus();
    };
    // `close` is intentionally not a dependency: the dialog lifecycle is tied to open state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand)] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--brand)] hover:text-white active:translate-y-0 dark:hover:text-[#062a17]">
        Request a quote
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-[#071a10]/65 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !submittingRef.current) close();
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${dialogId}-title`}
              aria-describedby={`${dialogId}-description`}
              className="max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-[var(--page)] shadow-[0_24px_72px_rgba(0,0,0,0.3)] sm:max-h-[90vh] sm:rounded-3xl"
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, scale: 0.99, filter: "blur(4px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-6 rounded-t-3xl bg-[#0d2b1c] px-5 py-6 text-white sm:px-8 sm:py-7 sm:rounded-t-3xl">
                <div>
                  <h2 id={`${dialogId}-title`} className="display-font max-w-[15ch] text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">Request {product.title}</h2>
                  <p id={`${dialogId}-description`} className="mt-2 text-sm leading-6 text-white/85">Share your requirements and contact details with our team.</p>
                </div>
                <button type="button" onClick={close} disabled={submitting} aria-label="Close quote request" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-xl text-white transition-colors hover:bg-white/10 disabled:cursor-wait disabled:opacity-50">
                  <MdClose aria-hidden="true" />
                </button>
              </div>

              {success ? (
                <div className="px-5 py-10 sm:px-8 sm:py-12">
                  <div role="status" aria-live="polite">
                    <h3 className="display-font text-2xl font-semibold text-[var(--ink)]">Request sent</h3>
                    <p className="mt-3 max-w-[48ch] text-sm leading-6 text-[var(--body)]">Your enquiry for {quantity} kg of {product.title} was sent. Our team will follow up using the contact details you provided.</p>
                  </div>
                  <button type="button" onClick={close} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-7 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#062a17]">Close</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
                  <div className="grid gap-5 sm:grid-cols-[0.6fr_1.4fr]">
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`${dialogId}-quantity`} className="text-sm font-semibold text-[var(--ink)]">Quantity (kg) <span className="font-normal text-[var(--muted)]">(required)</span></label>
                      <input id={`${dialogId}-quantity`} type="number" min="0.5" step="0.5" value={quantity} onChange={(event) => setQuantity(event.target.value)} required className={fieldClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`${dialogId}-name`} className="text-sm font-semibold text-[var(--ink)]">Full name <span className="font-normal text-[var(--muted)]">(required)</span></label>
                      <input id={`${dialogId}-name`} type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required className={fieldClass} />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`${dialogId}-email`} className="text-sm font-semibold text-[var(--ink)]">Email address <span className="font-normal text-[var(--muted)]">(required)</span></label>
                      <input id={`${dialogId}-email`} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className={fieldClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`${dialogId}-phone`} className="text-sm font-semibold text-[var(--ink)]">Phone <span className="font-normal text-[var(--muted)]">(optional)</span></label>
                      <input id={`${dialogId}-phone`} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${dialogId}-message`} className="text-sm font-semibold text-[var(--ink)]">Notes <span className="font-normal text-[var(--muted)]">(optional)</span></label>
                    <textarea id={`${dialogId}-message`} value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className={`${fieldClass} min-h-28 resize-y py-3`} />
                  </div>
                  {error && <p id={`${dialogId}-error`} role="alert" aria-live="assertive" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">{error}</p>}
                  <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
                    <button type="button" onClick={close} disabled={submitting} className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-[var(--body)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-wait disabled:opacity-60">Cancel</button>
                    <button type="submit" disabled={submitting} aria-busy={submitting} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] disabled:cursor-wait disabled:opacity-60 dark:text-[#062a17]">{submitting ? "Sending request…" : "Send quote request"}</button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
