import { createPublicClient } from "@/lib/supabase/public";
import type {
  HeroContent,
  AnnouncementContent,
  Product,
  Stat,
  Pillar,
  FAQ,
  Testimonial,
} from "@/types/content";

/* ─── helpers ─── */

/**
 * Fetch all site_content rows for a given page and return a
 * map of section → parsed content object.
 */
export async function getPageContent(page: string) {
  const supabase = createPublicClient();
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
  const supabase = createPublicClient();
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
  const supabase = createPublicClient();
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
  const supabase = createPublicClient();
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
  const supabase = createPublicClient();
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
  const supabase = createPublicClient();
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
