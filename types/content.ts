/**
 * Application-level content types derived from the Supabase schema.
 * Prefer importing from types/database.ts for raw DB access;
 * use these for presentational / form-layer code.
 */

import type { Json } from "./database";

/* ── CMS site content ── */
export type SiteContent = {
  id: string;
  page: string;
  section: string;
  content: Json;
  updated_at: string;
  updated_by: string | null;
};

/** Parsed content map: section → parsed JSON */
export type SiteContentMap = Record<string, Record<string, unknown>>;

/* ── Hero section shape (shared across pages) ── */
export type HeroContent = {
  badge?: string;
  title: string;
  highlight_word?: string;
  subtitle?: string;
  cta_primary_text?: string;
  cta_primary_href?: string;
  cta_secondary_text?: string;
  cta_secondary_href?: string;
};

/* ── Announcement bar ── */
export type AnnouncementContent = {
  text: string;
  link_text?: string;
  link_href?: string;
};

/* ── Products ── */
export type Product = {
  id: string;
  title: string;
  slug: string;
  region: string | null;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/* ── Stats ── */
export type Stat = {
  id: string;
  value: string;
  label: string;
  sub: string | null;
  display_order: number;
};

/* ── Pillars ── */
export type Pillar = {
  id: string;
  step: string;
  title: string;
  tag: string | null;
  description: string | null;
  icon: string | null;
  display_order: number;
};

/* ── FAQ ── */
export type FAQ = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
};

/* ── Testimonial ── */
export type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  author_image: string | null;
  is_active: boolean;
  display_order: number;
};

/* ── Contact submissions ── */
export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
};

/** Data sent by the public contact form */
export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
