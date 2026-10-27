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

type CmsFieldType = "text" | "textarea" | "url" | "array";

interface CmsFieldConfig {
  key: string;
  label: string;
  type?: CmsFieldType;
  itemFields?: Array<{ key: string; label: string; type?: "text" | "textarea" }>;
  addLabel?: string;
  itemLabel?: string;
}

interface SectionConfig {
  label: string;
  description: string;
  fields: CmsFieldConfig[];
}

interface PageConfig {
  label: string;
  icon: IconType;
  href: string;
  sections: Record<string, SectionConfig>;
}

const REVIEWED_FIELD: CmsFieldConfig = {
  key: "public_reviewed",
  label: "Reviewed for public display",
};

const HERO_FIELDS = {
  title: { key: "title", label: "Headline" },
  subtitle: { key: "subtitle", label: "Supporting text", type: "textarea" as const },
  primaryText: { key: "cta_primary_text", label: "Primary button text" },
  primaryHref: { key: "cta_primary_href", label: "Primary button link", type: "url" as const },
  secondaryText: { key: "cta_secondary_text", label: "Secondary button text" },
  secondaryHref: { key: "cta_secondary_href", label: "Secondary button link", type: "url" as const },
};

const PAGE_CONFIG: Record<string, PageConfig> = {
  home: {
    label: "Home Page",
    icon: MdHome,
    href: "/",
    sections: {
      hero: {
        label: "Hero Banner",
        description: "Headline, supporting text, and the two hero buttons.",
        fields: [HERO_FIELDS.title, HERO_FIELDS.subtitle, HERO_FIELDS.primaryText, HERO_FIELDS.primaryHref, HERO_FIELDS.secondaryText, HERO_FIELDS.secondaryHref, REVIEWED_FIELD],
      },
      announcement: {
        label: "Announcement Bar",
        description: "Optional message shown above the hero.",
        fields: [
          { key: "text", label: "Announcement text", type: "textarea" },
          { key: "link_text", label: "Link text" },
          { key: "link_href", label: "Link destination", type: "url" },
          REVIEWED_FIELD,
        ],
      },
    },
  },
  about: {
    label: "About Page",
    icon: MdInfo,
    href: "/about",
    sections: {
      hero: {
        label: "Hero Banner",
        description: "Headline, supporting text, and the two hero buttons.",
        fields: [HERO_FIELDS.title, HERO_FIELDS.subtitle, HERO_FIELDS.primaryText, HERO_FIELDS.primaryHref, HERO_FIELDS.secondaryText, HERO_FIELDS.secondaryHref, REVIEWED_FIELD],
      },
      operations: {
        label: "What We Do",
        description: "Section heading and body copy.",
        fields: [{ key: "heading", label: "Section heading" }, { key: "body", label: "Description", type: "textarea" }, REVIEWED_FIELD],
      },
      values: {
        label: "How to Work With Us",
        description: "Heading and the value items shown on the About page.",
        fields: [
          { key: "heading", label: "Section heading" },
          {
            key: "items",
            label: "Value items",
            type: "array",
            itemLabel: "Value",
            addLabel: "Add value",
            itemFields: [
              { key: "title", label: "Value title" },
              { key: "description", label: "Value description", type: "textarea" },
            ],
          },
          REVIEWED_FIELD,
        ],
      },
      timeline: {
        label: "Our Journey",
        description: "Heading and milestones shown on the About page.",
        fields: [
          { key: "heading", label: "Section heading" },
          {
            key: "milestones",
            label: "Milestones",
            type: "array",
            itemLabel: "Milestone",
            addLabel: "Add milestone",
            itemFields: [
              { key: "year", label: "Year" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ],
          },
          REVIEWED_FIELD,
        ],
      },
      people: {
        label: "Our Team",
        description: "Heading and team members shown on the About page.",
        fields: [
          { key: "heading", label: "Section heading" },
          {
            key: "members",
            label: "Team members",
            type: "array",
            itemLabel: "Team member",
            addLabel: "Add team member",
            itemFields: [
              { key: "name", label: "Name" },
              { key: "role", label: "Role" },
              { key: "bio", label: "Bio", type: "textarea" },
            ],
          },
          REVIEWED_FIELD,
        ],
      },
      cta_banner: {
        label: "Call to Action",
        description: "Heading, supporting text, and button shown at the bottom of the About page.",
        fields: [
          { key: "heading", label: "Heading" },
          { key: "subtitle", label: "Supporting text", type: "textarea" },
          { key: "cta_text", label: "Button text" },
          { key: "cta_href", label: "Button link", type: "url" },
          REVIEWED_FIELD,
        ],
      },
    },
  },
  products: {
    label: "Products Page",
    icon: MdShoppingBag,
    href: "/products",
    sections: {
      hero: {
        label: "Hero Banner",
        description: "Headline, supporting text, and the primary button.",
        fields: [HERO_FIELDS.title, HERO_FIELDS.subtitle, HERO_FIELDS.primaryText, HERO_FIELDS.primaryHref, REVIEWED_FIELD],
      },
      grid_heading: {
        label: "Product Grid Heading",
        description: "Heading above the product catalogue.",
        fields: [{ key: "heading", label: "Heading" }],
      },
      cta_banner: {
        label: "Call to Action",
        description: "Heading and button shown below the catalogue.",
        fields: [
          { key: "heading", label: "Heading" },
          { key: "cta_text", label: "Button text" },
          { key: "cta_href", label: "Button link", type: "url" },
          REVIEWED_FIELD,
        ],
      },
    },
  },
  contact: {
    label: "Contact Page",
    icon: MdMail,
    href: "/contact",
    sections: {
      hero: {
        label: "Hero Banner",
        description: "Headline, supporting text, and the button label.",
        fields: [HERO_FIELDS.title, HERO_FIELDS.subtitle, HERO_FIELDS.primaryText, REVIEWED_FIELD],
      },
      info: {
        label: "Contact Details",
        description: "Contact details and the location searched in Google Maps.",
        fields: [
          {
            key: "details",
            label: "Contact details",
            type: "array",
            itemLabel: "Contact",
            addLabel: "Add contact detail",
            itemFields: [
              { key: "icon", label: "Icon name" },
              { key: "label", label: "Contact label" },
              { key: "value", label: "Contact value", type: "textarea" },
            ],
          },
          { key: "map_query", label: "Map search location" },
        ],
      },
    },
  },
};

const URL_FIELD_ERROR = "Enter a valid URL (/, https:, mailto:, or tel:).";

function isValidUrlField(value: unknown): boolean {
  if (value == null || (typeof value === "string" && !value.trim())) return true;
  return typeof value === "string" && safeHref(value, "") !== "";
}

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function formatFieldLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ────────────────────────────────────────────
   Field Renderer
   ──────────────────────────────────────────── */

function FieldInput({
  inputId,
  definition,
  value,
  error,
  onChange,
}: {
  inputId: string;
  definition: CmsFieldConfig;
  value: unknown;
  error?: string;
  onChange: (val: unknown) => void;
}) {
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

  if (definition.type === "array") {
    const items = Array.isArray(value) ? value : [];
    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-700">{definition.label}</legend>
        {items.map((item, index) => {
          const record = item && typeof item === "object" && !Array.isArray(item)
            ? item as Record<string, unknown>
            : {};
          return (
            <div key={`${inputId}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h5 className="text-sm font-semibold text-slate-700">{definition.itemLabel ?? definition.label} {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                  className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                {definition.itemFields?.map((itemField) => {
                  const itemInputId = `${inputId}-${index}-${itemField.key}`;
                  const itemValue = String(record[itemField.key] ?? "");
                  return (
                    <div key={itemField.key}>
                      <label htmlFor={itemInputId} className="mb-1.5 block text-sm font-semibold text-slate-700">
                        {itemField.label}
                      </label>
                      {itemField.type === "textarea" ? (
                        <textarea
                          id={itemInputId}
                          rows={3}
                          value={itemValue}
                          onChange={(event) => onChange(items.map((current, itemIndex) => itemIndex === index
                            ? { ...record, [itemField.key]: event.target.value }
                            : current))}
                          className={`${baseClasses} resize-y py-3`}
                        />
                      ) : (
                        <input
                          id={itemInputId}
                          type="text"
                          value={itemValue}
                          onChange={(event) => onChange(items.map((current, itemIndex) => itemIndex === index
                            ? { ...record, [itemField.key]: event.target.value }
                            : current))}
                          className={`${baseClasses} h-10`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => onChange([...items, Object.fromEntries((definition.itemFields ?? []).map(({ key }) => [key, ""]))])}
          className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-white"
        >
          {definition.addLabel ?? "Add item"}
        </button>
      </fieldset>
    );
  }

  const strVal = String(value ?? "");
  const attributes = {
    id: inputId,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${inputId}-error` : undefined,
  };

  if (definition.type === "textarea") {
    return (
      <textarea
        {...attributes}
        rows={Math.min(12, strVal.split("\n").length + 1)}
        value={strVal}
        onChange={(event) => onChange(event.target.value)}
        className={`${baseClasses} resize-y py-3`}
      />
    );
  }

  return (
    <input
      {...attributes}
      type={definition.type === "url" ? "url" : "text"}
      value={strVal}
      onChange={(event) => onChange(event.target.value)}
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
  sectionConfig,
  fields,
  onFieldChange,
  onSave,
  saving,
  saved,
}: {
  page: string;
  section: string;
  sectionConfig: SectionConfig;
  fields: Record<string, unknown>;
  onFieldChange: (key: string, val: unknown) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [urlErrors, setUrlErrors] = useState<Record<string, boolean>>({});
  const fieldEntries = sectionConfig.fields.map((definition) => [
    definition,
    fields[definition.key],
  ] as const);
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
              {sectionConfig.label}
            </h4>
            {sectionConfig.description && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{sectionConfig.description}</p>
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
          {fieldEntries.map(([definition, val]) => {
            const key = definition.key;
            const inputId = `${panelId}-${key}`;
            const isUrl = definition.type === "url";
            return (
              <div key={key}>
                {definition.type !== "array" && (
                  <label htmlFor={inputId} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                    {definition.label}
                    {isUrl && <MdOpenInNew aria-hidden="true" className="text-slate-400 text-xs" />}
                  </label>
                )}
                <FieldInput
                  inputId={inputId}
                  definition={definition}
                  value={val}
                  error={urlErrors[key] ? URL_FIELD_ERROR : undefined}
                  onChange={(v) => {
                    onFieldChange(key, v);
                    if (isUrl) setUrlErrors((prev) => ({ ...prev, [key]: !isValidUrlField(v) }));
                  }}
                />
                {key === "public_reviewed" && (
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">Unreviewed content is hidden from the public site.</p>
                )}
                {urlErrors[key] && (
                  <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {URL_FIELD_ERROR}
                  </p>
                )}
              </div>
            );
          })}

          {/* Section-level save */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const invalidFields = fieldEntries
                  .filter(([definition]) => definition.type === "url")
                  .filter(([, value]) => !isValidUrlField(value));
                if (invalidFields.length) {
                  setUrlErrors(Object.fromEntries(invalidFields.map(([definition]) => [definition.key, true])));
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

  // Only expose sections whose fields are deliberately mapped to public output.
  const sectionKeys = Object.keys(config.sections);

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
              sectionConfig={config.sections[section]}
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
      Object.entries(PAGE_CONFIG)
        .filter(([page]) => pages[page])
        .map(([page, pageConfig]) => [
          page,
          Object.fromEntries(
            Object.entries(pageConfig.sections).map(([section, sectionConfig]) => {
              const existingFields = pages[page][section] ?? {};
              const fields = { ...existingFields };
              for (const definition of sectionConfig.fields) {
                if (definition.key === "public_reviewed") {
                  fields[definition.key] = existingFields[definition.key] === true;
                } else if (!(definition.key in fields)) {
                  fields[definition.key] = definition.type === "array" ? [] : "";
                } else if (definition.type === "array" && !Array.isArray(fields[definition.key])) {
                  fields[definition.key] = [];
                }
              }
              return [section, fields];
            })
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
