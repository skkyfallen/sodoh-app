import { createServerClient } from "@supabase/ssr";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { Database } from "@/types/database";

/**
 * Middleware Supabase client.
 * Pass in the request/response cookie stores from Next.js middleware.
 */
export function createMiddlewareClient(
  requestCookies: ReadonlyRequestCookies,
  responseCookies: ResponseCookies
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return requestCookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            requestCookies.set(name, value, options as Parameters<typeof requestCookies.set>[2]);
            responseCookies.set(name, value, options as Parameters<typeof responseCookies.set>[2]);
          });
        },
      },
    }
  );
}
