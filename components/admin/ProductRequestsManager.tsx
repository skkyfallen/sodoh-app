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
  const supabase = createClient();

  const updateStatus = async (id: string, status: "new" | "read" | "archived") => {
    const { error } = await supabase
      .from("product_requests")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : prev));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    const { error } = await supabase
      .from("product_requests")
      .delete()
      .eq("id", id);
    if (!error) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* List */}
      <div className="flex-1 overflow-hidden rounded-sm border border-slate-200 bg-white">
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
          {requests.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelected(r);
                if (r.status === "new") updateStatus(r.id, "read");
              }}
              className={`w-full text-left px-5 py-4 transition-colors hover:bg-slate-50 ${
                selected?.id === r.id ? "bg-[#eaf0e8]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{r.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColors[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {r.product_title} · {r.quantity_kg} kg
              </p>
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
            <div className="px-5 py-12 text-center text-slate-400 text-sm">
              No product requests yet.
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1">
        {selected ? (
          <div className="rounded-sm border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.email}</p>
                {selected.phone && (
                  <p className="text-sm text-slate-500">{selected.phone}</p>
                )}
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${statusColors[selected.status]}`}
              >
                {selected.status}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-4">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
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
                  onClick={() => updateStatus(selected.id, "new")}
                  className="h-8 px-4 rounded-lg bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition-colors"
                >
                  Mark New
                </button>
              )}
              {selected.status !== "read" && (
                <button
                  onClick={() => updateStatus(selected.id, "read")}
                  className="h-8 px-4 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  Mark Read
                </button>
              )}
              {selected.status !== "archived" && (
                <button
                  onClick={() => updateStatus(selected.id, "archived")}
                  className="h-8 px-4 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Archive
                </button>
              )}
              <button
                onClick={() => handleDelete(selected.id)}
                className="h-8 px-4 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-slate-200 bg-white p-12 text-center text-slate-500 text-sm">
            Select a request to view details.
          </div>
        )}
      </div>
    </div>
  );
}
