"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "@/types/content";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <Dialog open={open} onClose={close} labelledBy={`${dialogId}-title`} describedBy={`${dialogId}-description`} dismissible={!submitting}>
      <DialogHeader
        titleId={`${dialogId}-title`}
        title={`Request ${product.title}`}
        description="Share your requirements and contact details with our team."
        onClose={close}
        closeLabel="Close quote request"
      />

      {success ? (
        <div className="px-5 py-10 sm:px-8 sm:py-12">
          <div role="status" aria-live="polite">
            <h3 className="display-font text-2xl font-semibold text-[var(--ink)]">Request sent</h3>
            <p className="mt-3 max-w-[48ch] text-sm leading-6 text-[var(--body)]">Your enquiry for {quantity} kg of {product.title} was sent. Our team will follow up using the contact details you provided.</p>
          </div>
          <Button onClick={close} className="mt-7">Close</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-5 sm:grid-cols-[0.6fr_1.4fr]">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${dialogId}-quantity`}>Quantity (kg)</Label>
              <Input id={`${dialogId}-quantity`} type="number" min="0.5" step="0.5" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${dialogId}-name`}>Full name</Label>
              <Input id={`${dialogId}-name`} type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your full name" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${dialogId}-email`}>Email address</Label>
              <Input id={`${dialogId}-email`} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${dialogId}-phone`}>Phone <span className="font-normal text-[var(--muted)]">(optional)</span></Label>
              <Input id={`${dialogId}-phone`} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+234 …" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${dialogId}-message`}>Notes <span className="font-normal text-[var(--muted)]">(optional)</span></Label>
            <Textarea id={`${dialogId}-message`} value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder="Volumes, timing, delivery notes…" />
          </div>
          {error && <p id={`${dialogId}-error`} role="alert" aria-live="assertive" className="rounded-[12px] border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">{error}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={close} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting} aria-busy={submitting}>{submitting ? "Sending request…" : "Send quote request"}</Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
