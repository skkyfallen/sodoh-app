"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactSubmission } from "@/types/content";

type Props = {
  initialMessages: ContactSubmission[];
};

const statusColors: Record<string, string> = {
  new: "bg-green-100 text-green-700",
  read: "bg-blue-100 text-blue-700",
  archived: "bg-slate-100 text-slate-500",
};

export default function MessagesManager({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const supabase = createClient();

  const updateStatus = async (id: string, status: "new" | "read" | "archived") => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : prev));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* List */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(m);
                if (m.status === "new") updateStatus(m.id, "read");
              }}
              className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors ${
                selected?.id === m.id ? "bg-slate-50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{m.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColors[m.status]}`}>
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
            <div className="px-5 py-12 text-center text-slate-400 text-sm">
              No messages yet.
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1">
        {selected ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.email}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${statusColors[selected.status]}`}>
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center text-slate-400 text-sm">
            Select a message to view details.
          </div>
        )}
      </div>
    </div>
  );
}
