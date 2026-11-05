"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeHref } from "@/lib/utils";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  MdExpandMore,
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
  urlError,
  onChange,
}: {
  inputId: string;
  definition: CmsFieldConfig;
  value: unknown;
  urlError?: string;
  onChange: (val: unknown) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              id={inputId}
              checked={value}
              onChange={(event) => onChange(event.target.checked)}
            />
          }
          label={definition.label}
        />
        {definition.key === "public_reviewed" && (
          <FormHelperText sx={{ ml: 4 }}>
            Unreviewed content is hidden from the public site.
          </FormHelperText>
        )}
      </Box>
    );
  }

  if (definition.type === "array") {
    const items = Array.isArray(value) ? value : [];
    return (
      <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <Typography component="legend" variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, p: 0 }}>
          {definition.label}
        </Typography>
        <Stack spacing={1.5}>
          {items.map((item, index) => {
            const record = item && typeof item === "object" && !Array.isArray(item)
              ? item as Record<string, unknown>
              : {};
            return (
              <Paper key={`${inputId}-${index}`} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {definition.itemLabel ?? definition.label} {index + 1}
                  </Typography>
                  <Button
                    type="button"
                    color="error"
                    onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                    sx={{ minHeight: 44 }}
                  >
                    Remove
                  </Button>
                </Box>
                <Stack spacing={1.5}>
                  {definition.itemFields?.map((itemField) => {
                    const itemInputId = `${inputId}-${index}-${itemField.key}`;
                    const itemValue = String(record[itemField.key] ?? "");
                    return (
                      <TextField
                        key={itemField.key}
                        id={itemInputId}
                        label={itemField.label}
                        multiline={itemField.type === "textarea"}
                        rows={itemField.type === "textarea" ? 3 : undefined}
                        fullWidth
                        value={itemValue}
                        onChange={(event) => onChange(items.map((current, itemIndex) => itemIndex === index
                          ? { ...record, [itemField.key]: event.target.value }
                          : current))}
                      />
                    );
                  })}
                </Stack>
              </Paper>
            );
          })}
          <Button
            type="button"
            variant="outlined"
            onClick={() => onChange([...items, Object.fromEntries((definition.itemFields ?? []).map(({ key }) => [key, ""]))])}
            sx={{ minHeight: 44, alignSelf: "flex-start" }}
          >
            {definition.addLabel ?? "Add item"}
          </Button>
        </Stack>
      </Box>
    );
  }

  const strVal = String(value ?? "");
  const describedBy = urlError ? `${inputId}-error` : undefined;

  if (definition.type === "textarea") {
    return (
      <TextField
        id={inputId}
        label={definition.label}
        multiline
        rows={Math.min(12, strVal.split("\n").length + 1)}
        fullWidth
        value={strVal}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <>
      <TextField
        id={inputId}
        label={definition.label}
        type={definition.type === "url" ? "url" : "text"}
        fullWidth
        value={strVal}
        error={Boolean(urlError)}
        slotProps={{ htmlInput: { "aria-describedby": describedBy } }}
        onChange={(event) => onChange(event.target.value)}
      />
      {urlError && (
        <Alert severity="error" id={`${inputId}-error`} sx={{ mt: 1 }}>
          {URL_FIELD_ERROR}
        </Alert>
      )}
    </>
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
    <Accordion
      expanded={open}
      onChange={(_event, expanded) => setOpen(expanded)}
      disableGutters
      elevation={0}
      sx={{ border: (theme) => `1px solid ${theme.palette.admin.border}`, borderRadius: 2, "&:before": { display: "none" } }}
    >
      <AccordionSummary
        expandIcon={<MdExpandMore aria-hidden="true" size="1.25rem" />}
        aria-controls={panelId}
        id={`${panelId}-header`}
        sx={{ px: 2.5, py: 1, minHeight: 64 }}
      >
        <Box sx={{ minWidth: 0, mr: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {sectionConfig.label}
          </Typography>
          {sectionConfig.description && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sectionConfig.description}
            </Typography>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, alignSelf: "center", mr: 1 }}>
          {fieldEntries.length} field{fieldEntries.length !== 1 ? "s" : ""}
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={panelId} sx={{ borderTop: (theme) => `1px solid ${theme.palette.admin.border}`, bgcolor: "#fbfcf9", px: { xs: 2.5, sm: 3 }, py: 2.5 }}>
        <Stack spacing={2.5}>
          {fieldEntries.map(([definition, val]) => {
            const key = definition.key;
            const inputId = `${panelId}-${key}`;
            const isUrl = definition.type === "url";
            return (
              <Box key={key}>
                {definition.type !== "array" && typeof val !== "boolean" && (
                  <Typography
                    component="label"
                    htmlFor={inputId}
                    variant="subtitle2"
                    sx={{ display: "flex", alignItems: "center", gap: 0.75, fontWeight: 600, mb: 1 }}
                  >
                    {definition.label}
                    {isUrl && <MdOpenInNew aria-hidden="true" size="0.85rem" color="#64748b" />}
                  </Typography>
                )}
                <FieldInput
                  inputId={inputId}
                  definition={definition}
                  value={val}
                  urlError={urlErrors[key] ? URL_FIELD_ERROR : undefined}
                  onChange={(v) => {
                    onFieldChange(key, v);
                    if (isUrl) setUrlErrors((prev) => ({ ...prev, [key]: !isValidUrlField(v) }));
                  }}
                />
              </Box>
            );
          })}

          {/* Section-level save */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 1 }}>
            <Button
              type="button"
              variant="contained"
              startIcon={saving ? <CircularProgress size="0.9rem" color="inherit" /> : <MdSave aria-hidden="true" size="0.9rem" />}
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
              sx={{ minHeight: 44 }}
            >
              {saving ? "Saving…" : "Save Section"}
            </Button>
            {saved && (
              <Typography role="status" variant="subtitle2" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 600, color: "#15803d" }}>
                <MdCheck aria-hidden="true" size="0.9rem" />
                Saved
              </Typography>
            )}
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
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

  // Only expose sections whose fields are deliberately mapped to public output.
  const sectionKeys = Object.keys(config.sections);

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      sx={{ bgcolor: "transparent", "&:before": { display: "none" } }}
    >
      <AccordionSummary
        expandIcon={<MdExpandMore aria-hidden="true" size="1.25rem" />}
        aria-controls={`cms-page-${page}`}
        sx={{ px: 0, borderBottom: "1px solid #dce4dc", minHeight: 72 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Icon aria-hidden="true" size="1.35rem" color="#016936" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {config?.label ?? formatFieldLabel(page)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sectionKeys.length} editable section{sectionKeys.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails id={`cms-page-${page}`} sx={{ px: 0, py: 2, pl: { md: 5 } }}>
        <Stack spacing={1.5}>
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
        </Stack>
      </AccordionDetails>
    </Accordion>
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
  const [saveFailure, setSaveFailure] = useState<string | null>(null);

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
          setSaveFailure(`Save failed: ${error.message}`);
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
    <Stack spacing={2}>
      <Snackbar
        open={saveFailure !== null}
        onClose={(_event, reason) => {
          if (reason === "clickaway") return;
          setSaveFailure(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSaveFailure(null)} sx={{ width: "100%" }}>
          {saveFailure}
        </Alert>
      </Snackbar>

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
        <Alert severity="info">
          No content found. Run the seed SQL to populate initial content.
        </Alert>
      )}
    </Stack>
  );
}
