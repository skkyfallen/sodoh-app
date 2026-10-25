"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactSubmission } from "@/types/content";

type Props = {
  initialMessages: ContactSubmission[];
};

const statusColors: Record<string, string> = {
  new: "bg-[#e4f0da] text-[#145c34]",
  read: "bg-[#e8eff6] text-[#244d6d]",
  archived: "bg-slate-100 text-slate-700",
};

export default function MessagesManager({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const supabase = createClient();

  const updateStatus = async (id: string, status: "new" | "read" | "archived") => {
    setActionError(null);
    setPendingId(id);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      setActionError(null);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch {
      setActionError("This message could not be updated. Check your connection and try again.");
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setActionError(null);
    setPendingId(id);
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
      setActionError(null);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setActionError("This message could not be deleted. Check your connection and try again.");
    } finally {
      setPendingId(null);
    }
  };

  return (
      <div className="flex flex-col gap-6 lg:flex-row">
      {/* List */}
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
          {messages.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={selected?.id === m.id}
              disabled={pendingId !== null}
              onClick={() => {
                setSelected(m);
                setActionError(null);
                if (m.status === "new") updateStatus(m.id, "read");
              }}
          className={`w-full text-left px-5 py-4 transition-colors hover:bg-slate-50 ${
            selected?.id === m.id ? "bg-[#eaf0e8]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{m.name}</span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{m.subject ?? "No subject"}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(m.created_at).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </button>
          ))}
          {messages.length === 0 && (
            <div className="px-5 py-12 text-center text-sm leading-6 text-slate-600">
              No messages yet. New contact form messages will appear here.
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
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[selected.status]}`}>
                {selected.status}
              </span>
            </div>

            {selected.subject && (
              <p className="text-sm font-semibold text-slate-700 mb-3">
                Subject: {selected.subject}
              </p>
            )}

            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
              {selected.message}
            </p>

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
            {pendingId === selected.id && <p role="status" className="mt-3 text-sm text-slate-600">Updating message…</p>}
            {actionError && <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{actionError}</p>}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm leading-6 text-slate-600 sm:p-12">
            Select a message to review its details and update its status.
          </div>
        )}
      </div>
    </div>
  );
}
