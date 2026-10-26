"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AdminEmptyState } from "@/components/ui/empty-state";
import type { ProductRequest } from "@/types/content";

type Props = {
  initialRequests: ProductRequest[];
};

const badgeFor = (status: string) =>
  status === "new" ? "success" : status === "read" ? "info" : "neutral";

export default function ProductRequestsManager({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [selected, setSelected] = useState<ProductRequest | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const supabase = createClient();

  const updateStatus = async (id: string, status: "new" | "read" | "archived") => {
    setActionError(null);
    setPendingId(id);
    try {
      const { error } = await supabase
        .from("product_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      setActionError(null);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch {
      setActionError("This request could not be updated. Check your connection and try again.");
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    setActionError(null);
    setPendingId(id);
    try {
      const { error } = await supabase
        .from("product_requests")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setActionError(null);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setActionError("This request could not be deleted. Check your connection and try again.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* List */}
      <div className="flex-1 overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <div className="max-h-[70vh] divide-y divide-[var(--admin-border)] overflow-y-auto">
          {requests.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={selected?.id === r.id}
              disabled={pendingId !== null}
              onClick={() => {
                setSelected(r);
                setActionError(null);
                if (r.status === "new") updateStatus(r.id, "read");
              }}
              className={`w-full px-5 py-4 text-left transition-colors hover:bg-[var(--admin-page)] ${
                selected?.id === r.id ? "bg-[var(--admin-active)]/60" : ""
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-[var(--admin-ink)]">{r.name}</span>
                <Badge variant={badgeFor(r.status) as "success" | "info" | "neutral"}>
                  {r.status}
                </Badge>
              </div>
              <p className="truncate text-xs text-[var(--admin-muted)]">Product: {r.product_title}</p>
              <p className="text-xs text-[var(--admin-muted)]">Quantity: {r.quantity_kg} kg</p>
              <p className="mt-0.5 text-xs text-[var(--admin-muted)]/80">
                {new Date(r.created_at).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </button>
          ))}
          {requests.length === 0 && (
            <div className="px-5 py-12 text-center text-sm leading-6 text-[var(--admin-muted)]">
              No product requests yet. New quote requests will appear here.
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1">
        {selected ? (
          <div className="rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--admin-ink)]">{selected.name}</h3>
                <p className="text-sm text-[var(--admin-muted)]">{selected.email}</p>
                {selected.phone && (
                  <p className="text-sm text-[var(--admin-muted)]">{selected.phone}</p>
                )}
              </div>
              <Badge variant={badgeFor(selected.status) as "success" | "info" | "neutral"}>
                {selected.status}
              </Badge>
            </div>

            <div className="mb-4 rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-page)] p-4">
              <p className="mb-1 text-sm font-semibold text-[var(--admin-muted)]">
                Requested product
              </p>
              <p className="text-base font-bold text-[var(--admin-ink)]">
                {selected.product_title}
              </p>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">
                Quantity:{" "}
                <span className="font-bold text-[#016936]">
                  {selected.quantity_kg} kg
                </span>
              </p>
            </div>

            {selected.message && (
              <p className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-muted)]">
                {selected.message}
              </p>
            )}

            <p className="mb-6 text-xs text-[var(--admin-muted)]/80">
              {new Date(selected.created_at).toLocaleString("en-NG")}
            </p>

            <div className="flex flex-wrap gap-2">
              {selected.status !== "new" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "new")}
                  disabled={pendingId !== null}
                  className="inline-flex min-h-11 items-center rounded-[10px] border border-[var(--admin-border)] bg-[var(--admin-active)] px-4 text-sm font-semibold text-[#145c34] transition-colors hover:brightness-95"
                >
                  Mark New
                </button>
              )}
              {selected.status !== "read" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "read")}
                  disabled={pendingId !== null}
                  className="inline-flex min-h-11 items-center rounded-[10px] border border-[#c4d9ec] bg-[#e8eff6] px-4 text-sm font-semibold text-[#244d6d] transition-colors hover:brightness-95"
                >
                  Mark Read
                </button>
              )}
              {selected.status !== "archived" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "archived")}
                  disabled={pendingId !== null}
                  className="inline-flex min-h-11 items-center rounded-[10px] border border-[var(--admin-border)] bg-[var(--admin-page)] px-4 text-sm font-semibold text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-active)]"
                >
                  Archive
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(selected.id)}
                disabled={pendingId !== null}
                className="inline-flex min-h-11 items-center rounded-[10px] border border-[#f3c1c1] bg-[#fdecec] px-4 text-sm font-semibold text-[#a12323] transition-colors hover:brightness-95"
              >
                {pendingId === selected.id ? "Updating…" : "Delete"}
              </button>
            </div>
            {pendingId === selected.id && <p role="status" className="mt-3 text-sm text-[var(--admin-muted)]">Updating request…</p>}
            {actionError && <p role="alert" className="mt-4 rounded-[10px] border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{actionError}</p>}
          </div>
        ) : (
          <AdminEmptyState
            title="No request selected"
            body="Select a request to review its details and update its status."
          />
        )}
      </div>
    </div>
  );
}
