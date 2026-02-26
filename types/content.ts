/**
 * Application-level content types derived from the Supabase schema.
 * Prefer importing from types/database.ts for raw DB access;
 * use these for presentational / form-layer code.
 */

export type PageContent = {
  id: string;
  page: "home" | "about" | "contact";
  section_key: string;
  content: string;
  updated_at: string;
  updated_by: string | null;
};

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

/** A map of section_key → content for a single page */
export type PageContentMap = Record<string, string>;
