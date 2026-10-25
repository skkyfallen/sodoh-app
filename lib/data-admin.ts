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
import type { ContactSubmission, ProductRequest } from "@/types/content";

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
