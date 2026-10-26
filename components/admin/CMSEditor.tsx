"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeHref } from "@/lib/utils";
import {
  MdExpandMore,
  MdExpandLess,
  MdSave,
  MdCheck,
  MdOpenInNew,
  MdHome,
  MdInfo,
  MdShoppingBag,
  MdMail,
} from "react-icons/md";
import type { IconType } from "react-icons";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

type SectionMap = Record<string, Record<string, unknown>>;
type PagesData = Record<string, SectionMap>;

type Props = {
  pages: PagesData;
};

/* ────────────────────────────────────────────
   Config: pages, section labels, field hints
   ──────────────────────────────────────────── */

interface PageConfig {
  label: string;
  icon: IconType;
  href: string;
  sections: Record<string, { label: string; description: string }>;
}

const PAGE_CONFIG: Record<string, PageConfig> = {
  home: {
    label: "Home Page",
    icon: MdHome,
    href: "/",
    sections: {
      hero:         { label: "Hero Banner",      description: "Main headline, subtitle, and call-to-action buttons." },
      announcement: { label: "Announcement Bar",  description: "Optional banner above the hero." },
    },
  },
  about: {
    label: "About Page",
    icon: MdInfo,
    href: "/about",
    sections: {
      hero:       { label: "Hero Banner",      description: "Headline, subtitle, and CTAs for the About page." },
      operations: { label: "What We Do",        description: "Narrative section describing company operations." },
      timeline:   { label: "Our Journey",       description: "Milestone timeline items." },
      values:     { label: "Core Values",       description: "Values grid — icon, title, and description for each." },
      people:     { label: "Meet the Team",     description: "Key people cards — name, role, and bio." },
      cta_banner: { label: "CTA Banner",        description: "Bottom call-to-action banner." },
    },
  },
  products: {
    label: "Products Page",
    icon: MdShoppingBag,
    href: "/products",
    sections: {
      hero:         { label: "Hero Banner",      description: "Headline and subtitle for the Products page." },
      grid_heading: { label: "Grid Heading",     description: "Heading above the products grid." },
      cta_banner:   { label: "CTA Banner",       description: "Bottom call-to-action banner." },
    },
  },
  contact: {
    label: "Contact Page",
    icon: MdMail,
    href: "/contact",
    sections: {
      hero: { label: "Hero Banner",     description: "Headline and subtitle for the Contact page." },
      info: { label: "Contact Details",  description: "Address, phone, email, and map embed URL." },
    },
  },
};

// Fields that should render as textarea
const LONG_FIELDS = new Set([
  "subtitle", "description", "body", "message", "quote", "bio",
]);

// Fields that are URLs or hrefs
const URL_FIELDS = new Set([
  "cta_primary_href", "cta_secondary_href", "cta_href", "link_href", "href",
  "image_url", "map_url",
]);

const URL_FIELD_ERROR = "Enter a valid URL (/, https:, mailto:, or tel:).";

function isValidUrlField(value: unknown): boolean {
  if (value == null || (typeof value === "string" && !value.trim())) return true;
  return typeof value === "string" && safeHref(value, "") !== "";
}

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function formatFieldLabel(key: string): string {
  if (key === "public_reviewed") return "Reviewed for public display";
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSectionLabel(page: string, section: string): string {
  return PAGE_CONFIG[page]?.sections[section]?.label ?? formatFieldLabel(section);
}

function getSectionDescription(page: string, section: string): string {
  return PAGE_CONFIG[page]?.sections[section]?.description ?? "";
}

/* ────────────────────────────────────────────
   Field Renderer
   ──────────────────────────────────────────── */

function FieldInput({
  inputId,
  fieldKey,
  value,
  error,
  onChange,
}: {
  inputId: string;
  fieldKey: string;
  value: unknown;
  error?: string;
  onChange: (val: unknown) => void;
}) {
  const isComplex = typeof value === "object" && value !== null;
  const strVal = isComplex ? JSON.stringify(value, null, 2) : String(value ?? "");
  const isLong = LONG_FIELDS.has(fieldKey) || strVal.length > 120 || isComplex;
  const isUrl = URL_FIELDS.has(fieldKey);

  const baseClasses =
    "w-full rounded-xl border border-slate-200 bg-[#f7f8f4] px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#016936]/15 focus:border-[#016936] focus:bg-white transition-colors";

  if (typeof value === "boolean") {
    return (
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        className="size-5 accent-[#016936]"
      />
    );
  }

  if (isLong) {
    return (
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        rows={Math.min(12, strVal.split("\n").length + 1)}
        value={strVal}
        onChange={(e) => {
          let parsed: unknown = e.target.value;
          if (isComplex) {
            try { parsed = JSON.parse(e.target.value); } catch { /* keep as string */ }
          }
          onChange(parsed);
        }}
        className={`${baseClasses} py-3 font-mono text-xs leading-relaxed resize-y`}
      />
    );
  }

  return (
    <input
      id={inputId}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${inputId}-error` : undefined}
      type={isUrl ? "url" : "text"}
      value={strVal}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseClasses} h-10`}
    />
  );
}

/* ────────────────────────────────────────────
   Section Accordion
   ──────────────────────────────────────────── */

function SectionCard({
  page,
  section,
  fields,
  onFieldChange,
  onSave,
  saving,
  saved,
}: {
  page: string;
  section: string;
  fields: Record<string, unknown>;
  onFieldChange: (key: string, val: unknown) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [urlErrors, setUrlErrors] = useState<Record<string, boolean>>({});
  const fieldEntries = Object.entries(fields);
  const description = getSectionDescription(page, section);
  const panelId = `cms-section-${page}-${section}`.replace(/[^a-z0-9-]/gi, "-");

  return (
    <div className="border-y border-slate-200 bg-white">
      {/* Header — click to toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between px-4 py-5 text-left transition-colors hover:bg-slate-50 sm:px-5"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {formatSectionLabel(page, section)}
            </h4>
            {description && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-xs font-semibold text-slate-400">
            {fieldEntries.length} field{fieldEntries.length !== 1 ? "s" : ""}
          </span>
          {open ? (
            <MdExpandLess className="text-lg text-slate-400" />
          ) : (
            <MdExpandMore className="text-lg text-slate-400" />
          )}
        </div>
      </button>

      {/* Body */}
      <div id={panelId} hidden={!open} className="border-t border-slate-100 bg-[#fbfcf9] px-4 py-5 space-y-5 sm:px-6">
        {open && <>
          {fieldEntries.map(([key, val]) => (
            <div key={key}>
              <label htmlFor={`${panelId}-${key}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                {formatFieldLabel(key)}
                {URL_FIELDS.has(key) && (
                  <MdOpenInNew className="text-slate-400 text-xs" />
                )}
              </label>
              <FieldInput
                inputId={`${panelId}-${key}`}
                fieldKey={key}
                value={val}
                error={urlErrors[key] ? URL_FIELD_ERROR : undefined}
                onChange={(v) => {
                  onFieldChange(key, v);
                  if (URL_FIELDS.has(key)) {
                    setUrlErrors((prev) => ({ ...prev, [key]: !isValidUrlField(v) }));
                  }
                }}
              />
              {urlErrors[key] && (
                <p id={`${panelId}-${key}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {URL_FIELD_ERROR}
                </p>
              )}
            </div>
          ))}

          {/* Section-level save */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const invalidFields = fieldEntries
                  .filter(([key]) => URL_FIELDS.has(key))
                  .filter(([, value]) => !isValidUrlField(value));
                if (invalidFields.length) {
                  setUrlErrors(Object.fromEntries(invalidFields.map(([key]) => [key, true])));
                  return;
                }
                setUrlErrors({});
                onSave();
              }}
              disabled={saving}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#016936] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#014e29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <MdSave className="text-sm" />
                  Save Section
                </>
              )}
            </button>
            {saved && (
              <span role="status" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                <MdCheck className="text-sm" />
                Saved
              </span>
            )}
          </div>
        </>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Page Group
   ──────────────────────────────────────────── */

function PageGroup({
  page,
  data,
  onFieldChange,
  onSaveSection,
  savingState,
  savedState,
}: {
  page: string;
  data: SectionMap;
  onFieldChange: (section: string, key: string, val: unknown) => void;
  onSaveSection: (section: string) => void;
  savingState: Record<string, boolean>;
  savedState: Record<string, boolean>;
}) {
  const config = PAGE_CONFIG[page];
  const Icon = config?.icon ?? MdHome;
  const [collapsed, setCollapsed] = useState(false);
  const panelId = `cms-page-${page}`;

  // All sections that exist in data for this page
  const sectionKeys = Object.keys(data);

  return (
    <div className="space-y-1">
      {/* Page header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-controls={panelId}
        className="w-full flex items-center justify-between border-b border-[#dce4dc] py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <Icon aria-hidden="true" className="shrink-0 text-xl text-[#016936]" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {config?.label ?? formatFieldLabel(page)}
            </h3>
            <p className="text-sm text-slate-500">
              {sectionKeys.length} editable section{sectionKeys.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          {collapsed ? (
            <MdExpandMore className="text-xl text-slate-400" />
          ) : (
            <MdExpandLess className="text-xl text-slate-400" />
          )}
        </div>
      </button>

      {/* Sections */}
      <div id={panelId} hidden={collapsed} className="space-y-3 pl-0 md:pl-10">
        {!collapsed && <>
          {sectionKeys.map((section) => (
            <SectionCard
              key={section}
              page={page}
              section={section}
              fields={(data[section] ?? {}) as Record<string, unknown>}
              onFieldChange={(key, val) => onFieldChange(section, key, val)}
              onSave={() => onSaveSection(section)}
              saving={savingState[section] ?? false}
              saved={savedState[section] ?? false}
            />
          ))}
        </>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main CMS Editor
   ──────────────────────────────────────────── */

export default function CMSEditor({ pages }: Props) {
  const [data, setData] = useState<PagesData>(() =>
    Object.fromEntries(
      Object.entries(pages).map(([page, sections]) => [
        page,
        Object.fromEntries(
          Object.entries(sections).map(([section, fields]) => [
            section,
            {
              ...fields,
              public_reviewed: fields.public_reviewed === true,
            },
          ])
        ),
      ])
    )
  );
  const [saving, setSaving] = useState<Record<string, Record<string, boolean>>>({});
  const [saved, setSaved] = useState<Record<string, Record<string, boolean>>>({});

  const handleFieldChange = useCallback(
    (page: string, section: string, key: string, val: unknown) => {
      setData((prev) => ({
        ...prev,
        [page]: {
          ...prev[page],
          [section]: {
            ...prev[page]?.[section],
            [key]: val,
          },
        },
      }));
      // Clear saved state when editing
      setSaved((prev) => ({
        ...prev,
        [page]: { ...prev[page], [section]: false },
      }));
    },
    []
  );

  const handleSaveSection = useCallback(
    async (page: string, section: string) => {
      // Set saving state
      setSaving((prev) => ({
        ...prev,
        [page]: { ...prev[page], [section]: true },
      }));

      const supabase = createClient();
      const content = data[page]?.[section];

      if (content) {
        const { error } = await supabase
          .from("site_content")
          .upsert(
            { page, section, content: content as unknown as import("@/types/database").Json },
            { onConflict: "page,section" }
          );

        if (error) {
          console.error("[CMS] Save failed.");
          alert(`Save failed: ${error.message}`);
        } else {
          // Revalidate the public page
          try {
            const pagePath = PAGE_CONFIG[page]?.href ?? `/${page}`;
            await fetch("/api/revalidate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paths: [pagePath] }),
            });
          } catch {
            // Revalidation failure is non-fatal
          }
        }
      }

      setSaving((prev) => ({
        ...prev,
        [page]: { ...prev[page], [section]: false },
      }));
      setSaved((prev) => ({
        ...prev,
        [page]: { ...prev[page], [section]: true },
      }));

      // Clear saved indicator after 3s
      setTimeout(() => {
        setSaved((prev) => ({
          ...prev,
          [page]: { ...prev[page], [section]: false },
        }));
      }, 3000);
    },
    [data]
  );

  const pageOrder = ["home", "about", "products", "contact"];
  const orderedPages = pageOrder.filter((p) => data[p]);

  return (
    <div className="space-y-10">
      {orderedPages.map((page) => (
        <PageGroup
          key={page}
          page={page}
          data={data[page]}
          onFieldChange={(section, key, val) =>
            handleFieldChange(page, section, key, val)
          }
          onSaveSection={(section) => handleSaveSection(page, section)}
          savingState={saving[page] ?? {}}
          savedState={saved[page] ?? {}}
        />
      ))}

      {orderedPages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 text-sm font-semibold">
            No content found. Run the seed SQL to populate initial content.
          </p>
        </div>
      )}
    </div>
  );
}
