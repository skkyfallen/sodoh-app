/**
 * Admin-only data functions.
 *
 * These use the SSR cookie-based Supabase client (lib/supabase/server.ts)
 * which requires the Node.js runtime.  Admin pages do NOT use
 * `export const runtime = "edge"`, so this is safe.
 *
 * Public pages must NEVER import from this file — use lib/data.ts instead.
 */
import { createClient } from "@/lib/supabase/server";
import type {
  ContactSubmission,
  FAQ,
  Pillar,
  Product,
  ProductRequest,
  Stat,
  Testimonial,
} from "@/types/content";

export async function getAdminPageContent(page: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("section, content")
    .eq("page", page);

  if (error) {
    console.error(`[getAdminPageContent] ${page}:`, error.message);
    return {} as Record<string, Record<string, unknown>>;
  }

  const map: Record<string, Record<string, unknown>> = {};
  for (const row of data ?? []) {
    map[row.section] = (typeof row.content === "string"
      ? JSON.parse(row.content)
      : row.content) as Record<string, unknown>;
  }
  return map;
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("[getAdminProducts]", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getAdminStats(): Promise<Stat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("[getAdminStats]", error.message);
    return [];
  }
  return (data ?? []) as Stat[];
}

export async function getAdminPillars(): Promise<Pillar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pillars")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("[getAdminPillars]", error.message);
    return [];
  }
  return (data ?? []) as Pillar[];
}

export async function getAdminFAQs(): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("[getAdminFAQs]", error.message);
    return [];
  }
  return (data ?? []) as FAQ[];
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("[getAdminTestimonials]", error.message);
    return [];
  }
  return (data ?? []) as Testimonial[];
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getContactSubmissions]", error.message);
    return [];
  }
  return (data ?? []) as ContactSubmission[];
}

export async function getContactSubmissionCounts() {
  const supabase = await createClient();

  const [newRes, readRes, archivedRes] = await Promise.all([
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "read"),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "archived"),
  ]);

  return {
    new: newRes.count ?? 0,
    read: readRes.count ?? 0,
    archived: archivedRes.count ?? 0,
    total: (newRes.count ?? 0) + (readRes.count ?? 0) + (archivedRes.count ?? 0),
  };
}

export async function getProductRequests(): Promise<ProductRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getProductRequests]", error.message);
    return [];
  }
  return (data ?? []) as ProductRequest[];
}

export async function getProductRequestCounts() {
  const supabase = await createClient();

  const [newRes, readRes, archivedRes] = await Promise.all([
    supabase.from("product_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("product_requests").select("id", { count: "exact", head: true }).eq("status", "read"),
    supabase.from("product_requests").select("id", { count: "exact", head: true }).eq("status", "archived"),
  ]);

  return {
    new: newRes.count ?? 0,
    read: readRes.count ?? 0,
    archived: archivedRes.count ?? 0,
    total: (newRes.count ?? 0) + (readRes.count ?? 0) + (archivedRes.count ?? 0),
  };
}
