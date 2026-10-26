import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session on every request so tokens never expire
 * mid-session. Also protects /admin routes — unauthenticated requests are
 * redirected to /admin/login.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
            })
          );
        },
      },
    }
  );

  // Refresh the session (required for Server Components to read auth state)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect all /admin routes except /admin/login
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin !== true) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "not-authorised");
      return NextResponse.redirect(loginUrl);
    }
  }

  return supabaseResponse;
}
/*test-ignore-end*/

export const config = {
  matcher: ["/admin/:path*"],
};
