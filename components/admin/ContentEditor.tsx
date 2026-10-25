"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SectionMap = Record<string, Record<string, unknown>>;

type Props = {
  pages: Record<string, SectionMap>;
};

const PAGE_LABELS: Record<string, string> = {
  home: "Home Page",
  products: "Products Page",
  contact: "Contact Page",
};

export default function ContentEditor({ pages }: Props) {
  const [activeTab, setActiveTab] = useState("home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState(pages);

  const sections = Object.entries(data[activeTab] ?? {});

  const updateField = (section: string, key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [section]: {
          ...prev[activeTab][section],
          [key]: value,
        },
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    for (const [section, content] of Object.entries(data[activeTab])) {
      await supabase
        .from("site_content")
        .update({ content: content as unknown as import("@/types/database").Json })
        .eq("page", activeTab)
        .eq("section", section);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-7 flex flex-wrap gap-2 border-b border-[#dce4dc] pb-4" role="group" aria-label="Site pages">
        {Object.keys(pages).map((page) => (
          <button
            key={page}
            onClick={() => setActiveTab(page)}
            aria-pressed={activeTab === page}
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === page
                ? "bg-[#016936] text-white"
                : "bg-white text-slate-600 hover:bg-[#eaf0e8]"
            }`}
          >
            {PAGE_LABELS[page] ?? page}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-6">
        {sections.map(([section, fields]) => (
          <div key={section} className="border-t border-slate-200 bg-white px-5 py-6 sm:px-7">
            <h3 className="text-lg font-bold text-slate-900 capitalize mb-4">
              {section.replace(/_/g, " ")}
            </h3>
            <div className="flex flex-col gap-4">
              {Object.entries(fields as Record<string, unknown>).map(([key, val]) => {
                // Skip complex nested arrays (like contact details); render them as JSON
                const isComplex = typeof val === "object" && val !== null;
                const strVal = isComplex ? JSON.stringify(val, null, 2) : String(val ?? "");
                const isLong = strVal.length > 80 || isComplex;

                return (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-slate-600 mb-1 capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    {isLong ? (
                      <textarea
                        rows={Math.min(10, strVal.split("\n").length + 1)}
                        value={strVal}
                        onChange={(e) => {
                          let parsed: unknown = e.target.value;
                          if (isComplex) {
                            try { parsed = JSON.parse(e.target.value); } catch { /* keep as string */ }
                          }
                          updateField(section, key, parsed as string);
                        }}
                        className="w-full rounded-sm border border-slate-200 bg-[#f7f8f4] px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#016936]/15 resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={strVal}
                        onChange={(e) => updateField(section, key, e.target.value)}
                        className="h-11 w-full rounded-sm border border-slate-200 bg-[#f7f8f4] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936]/15"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="min-h-11 bg-[#016936] px-6 text-sm font-bold text-white transition-colors hover:bg-[#014e29] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <span className="text-sm font-semibold text-green-600">✓ Saved successfully</span>
        )}
      </div>
    </div>
  );
}
