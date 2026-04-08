"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo") ?? "";
  // Validate the redirect target to prevent open-redirect attacks.
  // Use the URL API to normalise the value (handles encoded slashes, backslashes,
  // protocol-relative paths, etc.) before checking it is a safe /admin path.
  let redirectTo = "/admin/dashboard/overview";
  try {
    // Using a dummy localhost base is intentional: the URL API normalises any
    // encoded slashes, backslashes, and protocol-relative tricks so we can
    // inspect the pathname safely. We only use parsed.pathname — the base
    // origin is never used for anything other than normalisation.
    const parsed = new URL(rawRedirect, "http://localhost");
    // Only allow same-origin paths that start with /admin
    if (parsed.origin === "http://localhost" && parsed.pathname.startsWith("/admin")) {
      redirectTo = parsed.pathname + parsed.search;
    }
  } catch {
    // Invalid URL — fall through to the safe default
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Admin Login</h1>
            <p className="text-slate-500 text-sm">Sodoh Nigeria Dashboard</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936] focus:border-[#016936] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#016936] focus:border-[#016936] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-lg bg-[#016936] text-white font-bold text-sm transition-all hover:bg-[#015a2d] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
