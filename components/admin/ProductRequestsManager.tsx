"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProductRequest } from "@/types/content";

type Props = {
  initialRequests: ProductRequest[];
};

const statusColors: Record<string, string> = {
  new: "bg-[#e4f0da] text-[#145c34]",
  read: "bg-[#e8eff6] text-[#244d6d]",
  archived: "bg-slate-100 text-slate-700",
};

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
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
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
              className={`w-full text-left px-5 py-4 transition-colors hover:bg-slate-50 ${
                selected?.id === r.id ? "bg-[#eaf0e8]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{r.name}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">Product: {r.product_title}</p>
              <p className="text-xs text-slate-500">Quantity: {r.quantity_kg} kg</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(r.created_at).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </button>
          ))}
          {requests.length === 0 && (
            <div className="px-5 py-12 text-center text-sm leading-6 text-slate-600">
              No product requests yet. New quote requests will appear here.
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1">
        {selected ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.email}</p>
                {selected.phone && (
                  <p className="text-sm text-slate-500">{selected.phone}</p>
                )}
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[selected.status]}`}
              >
                {selected.status}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-4">
              <p className="text-sm font-semibold text-slate-600 mb-1">
                Requested product
              </p>
              <p className="text-base font-bold text-slate-900">
                {selected.product_title}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Quantity:{" "}
                <span className="font-bold text-[#016936]">
                  {selected.quantity_kg} kg
                </span>
              </p>
            </div>

            {selected.message && (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
                {selected.message}
              </p>
            )}

            <p className="text-xs text-slate-400 mb-6">
              {new Date(selected.created_at).toLocaleString("en-NG")}
            </p>

            <div className="flex gap-2 flex-wrap">
              {selected.status !== "new" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "new")}
                  disabled={pendingId !== null}
                  className="min-h-11 rounded-lg bg-green-50 px-4 text-sm font-semibold text-green-800 transition-colors hover:bg-green-100"
                >
                  Mark New
                </button>
              )}
              {selected.status !== "read" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "read")}
                  disabled={pendingId !== null}
                  className="min-h-11 rounded-lg bg-blue-50 px-4 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100"
                >
                  Mark Read
                </button>
              )}
              {selected.status !== "archived" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "archived")}
                  disabled={pendingId !== null}
                  className="min-h-11 rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Archive
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(selected.id)}
                disabled={pendingId !== null}
                className="min-h-11 rounded-lg bg-red-50 px-4 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100"
              >
                {pendingId === selected.id ? "Updating…" : "Delete"}
              </button>
            </div>
            {pendingId === selected.id && <p role="status" className="mt-3 text-sm text-slate-600">Updating request…</p>}
            {actionError && <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{actionError}</p>}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm leading-6 text-slate-600 sm:p-12">
            Select a request to review its details and update its status.
          </div>
        )}
      </div>
    </div>
  );
}
