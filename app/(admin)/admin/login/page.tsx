"use client";

import { Suspense, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorId = useId();
  const rawRedirect = searchParams.get("redirectTo") ?? "";
  let redirectTo = "/admin/dashboard/overview";
  try {
    const parsed = new URL(rawRedirect, "http://localhost");
    const safeAdminPath = parsed.pathname === "/admin" || parsed.pathname.startsWith("/admin/");
    if (parsed.origin === "http://localhost" && safeAdminPath) {
      redirectTo = parsed.pathname + parsed.search;
    }
  } catch {
    // Keep the safe default when a redirect URL cannot be parsed.
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError("We couldn’t sign you in. Check your email and password, then try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("We couldn’t reach the sign-in service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell min-h-[100dvh]">
      <header className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="rounded-md leading-tight focus-visible:outline-offset-4" aria-label="Sodoh Nigeria home">
            <span className="display-font block text-xl font-semibold tracking-[-0.04em] text-[var(--admin-ink)]">Sodoh</span>
            <span className="block text-xs text-[var(--admin-muted)]">Nigeria Limited</span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[var(--admin-ink)] underline decoration-[var(--admin-border)] underline-offset-4 transition-colors hover:text-[#016936]">
            View public site
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-6xl content-start items-start gap-8 px-5 py-10 sm:px-8 md:py-16 lg:grid-cols-[1fr_0.82fr] lg:content-center lg:items-center lg:gap-20">
        <section className="max-w-xl">
          <h1 className="display-font text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--admin-ink)] sm:text-5xl [text-wrap:balance]">
            Sign in to your workspace
          </h1>
          <p className="mt-5 max-w-[50ch] text-base leading-7 text-[var(--admin-muted)]">
            Manage the Sodoh Nigeria site content, product listings, and enquiries.
          </p>
        </section>

        <section aria-labelledby="login-heading" className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[0_16px_44px_rgba(10,42,26,0.08)] sm:p-8">
          <h2 id="login-heading" className="display-font text-2xl font-semibold tracking-[-0.035em] text-[var(--admin-ink)]">Admin sign in</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--admin-muted)]">Use your staff account to continue.</p>

          {error && (
            <p id={errorId} role="alert" className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="text-sm font-semibold text-[var(--admin-ink)]">Email address</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(null); }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="min-h-12 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 text-base text-[var(--admin-ink)] aria-[invalid=true]:border-red-600 focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="text-sm font-semibold text-[var(--admin-ink)]">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(null); }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="min-h-12 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 text-base text-[var(--admin-ink)] aria-[invalid=true]:border-red-600 focus:border-[#016936] focus:outline-none focus:ring-2 focus:ring-[#016936]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="mt-1 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#016936] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#014e29] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-shell grid min-h-[100dvh] place-items-center px-5 text-sm text-[var(--admin-muted)]" role="status">Loading sign-in form…</div>}>
      <LoginForm />
    </Suspense>
  );
}
