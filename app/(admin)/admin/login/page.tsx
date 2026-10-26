"use client";

import { Suspense, useId, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorId = useId();
  const hasNotAuthorisedError = searchParams.get("error") === "not-authorised";
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
  const [error, setError] = useState<string | null>(
    hasNotAuthorisedError
      ? "We couldn’t sign you in. Check your email and password, then try again."
      : null
  );
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
            <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--admin-muted)]">Nigeria Limited</span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[var(--admin-ink)] underline decoration-[var(--admin-border)] underline-offset-4 transition-colors hover:text-[#016936]">
            View public site
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-6xl content-start items-stretch gap-8 px-5 py-10 sm:px-8 md:py-16 lg:grid-cols-[1fr_0.9fr] lg:content-center lg:items-center lg:gap-14">
        <section className="page-enter relative overflow-hidden rounded-[18px] border border-[var(--admin-border)] bg-[#0c2418] text-white">
          <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-[480px]">
            <Image
              src="/images/nigerian-growing-fields.jpg"
              alt="Growing fields in Nigeria"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#071a10]/85 via-[#071a10]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7be2a6]">Admin workspace</p>
              <p className="display-font mt-2 max-w-[22ch] text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                Keep the catalogue and enquiries current.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="login-heading" className="page-enter w-full rounded-[18px] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[0_16px_44px_rgba(10,42,26,0.08)] sm:p-8" style={{ animationDelay: "120ms" }}>
          <h1 id="login-heading" className="display-font text-3xl font-semibold tracking-[-0.035em] text-[var(--admin-ink)] sm:text-4xl">
            Sign in to your workspace
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--admin-muted)]">
            Manage the Sodoh Nigeria site content, product listings, and enquiries. Use your staff account to continue.
          </p>

          {error && (
            <p id={errorId} role="alert" className="mt-6 rounded-[12px] border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-email">Email address</Label>
              <Input
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
                placeholder="staff@sodoh.com"
                className="border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-ink)] focus:border-[#016936] focus:ring-[#016936]/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(null); }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                placeholder="••••••••"
                className="border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-ink)] focus:border-[#016936] focus:ring-[#016936]/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="mt-1 w-full rounded-[12px]"
            >
              {loading ? "Signing in…" : "Sign in →"}
            </Button>
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
