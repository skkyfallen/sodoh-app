import { createClient } from "@/lib/supabase/server";
import type {
  HeroContent,
  AnnouncementContent,
  Product,
  Stat,
  Pillar,
  FAQ,
  Testimonial,
  ContactSubmission,
} from "@/types/content";

/* ─── helpers ─── */

/**
 * Fetch all site_content rows for a given page and return a
 * map of section → parsed content object.
 */
export async function getPageContent(page: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("section, content")
    .eq("page", page);

  if (error) {
    console.error(`[getPageContent] ${page}:`, error.message);
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

/** Typed shortcut for hero content */
export async function getHeroContent(page: string): Promise<HeroContent> {
  const map = await getPageContent(page);
  return (map.hero ?? {}) as HeroContent;
}

/** Typed shortcut for announcement content */
export async function getAnnouncementContent(): Promise<AnnouncementContent | null> {
  const map = await getPageContent("home");
  return (map.announcement as AnnouncementContent) ?? null;
}

/* ─── table queries ─── */

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getProducts]", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getStats(): Promise<Stat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("[getStats]", error.message);
    return [];
  }
  return (data ?? []) as Stat[];
}

export async function getPillars(): Promise<Pillar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pillars")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("[getPillars]", error.message);
    return [];
  }
  return (data ?? []) as Pillar[];
}

export async function getFAQs(): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getFAQs]", error.message);
    return [];
  }
  return (data ?? []) as FAQ[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getTestimonials]", error.message);
    return [];
  }
  return (data ?? []) as Testimonial[];
}

/* ─── admin-only queries ─── */

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
