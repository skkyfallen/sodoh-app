import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Lightweight Supabase client for **public, read-only** queries.
 *
 * Uses the plain @supabase/supabase-js client (no cookie handling)
 * so it is fully compatible with the Edge Runtime used on all
 * public-facing pages deployed to Cloudflare Pages.
 *
 * Do NOT use this client for admin mutations or any operation
 * that must run in the context of an authenticated session —
 * use lib/supabase/server.ts for those instead.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        // Public pages never need a persisted session
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}
