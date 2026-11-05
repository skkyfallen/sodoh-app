"use client";

import { Suspense, useId, useState, type FormEvent } from "react";
import Image from "next/image";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NextLink from "@/components/mui/NextLink";

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
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: (theme) => theme.palette.admin.page,
        color: (theme) => theme.palette.admin.ink,
      }}
    >
      <Box
        component="header"
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.admin.border}`,
          bgcolor: (theme) => theme.palette.admin.surface,
        }}
      >
        <Box
          sx={{
            mx: "auto",
            maxWidth: 1152,
            height: 72,
            px: { xs: 2.5, sm: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component={NextLink}
            href="/"
            aria-label="Sodoh Nigeria home"
            sx={{ textDecoration: "none", color: "inherit", borderRadius: 1 }}
          >
            <Typography
              component="span"
              sx={{ display: "block", fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 600, fontSize: 20, letterSpacing: "-0.04em", lineHeight: 1.2 }}
            >
              Sodoh
            </Typography>
            <Typography
              component="span"
              variant="caption"
              sx={{ display: "block", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: (theme) => theme.palette.admin.muted }}
            >
              Nigeria Limited
            </Typography>
          </Box>
          <Button
            component={NextLink}
            href="/"
            variant="text"
            sx={{ minHeight: 44, fontWeight: 600, textDecoration: "underline", textDecorationColor: (theme) => theme.palette.admin.border, textUnderlineOffset: 4 }}
          >
            View public site
          </Button>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          mx: "auto",
          maxWidth: 1152,
          px: { xs: 2.5, sm: 4 },
          py: { xs: 5, md: 8 },
          minHeight: "calc(100dvh - 72px)",
          display: "grid",
          gap: 4,
          alignContent: { xs: "start", lg: "center" },
          alignItems: { lg: "center" },
          gridTemplateColumns: { lg: "1fr 0.9fr" },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.admin.border}`,
            bgcolor: "#0c2418",
            color: "#fff",
            minHeight: { xs: 260, sm: 320, lg: 480 },
          }}
        >
          <Image
            src="/images/nigerian-growing-fields.jpg"
            alt="Growing fields in Nigeria"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(7,26,16,0.85), rgba(7,26,16,0.25), transparent)",
            }}
          />
          <Box sx={{ position: "absolute", insetInline: 0, bottom: 0, p: { xs: 3, sm: 4 } }}>
            <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: "0.12em", color: "#7be2a6" }}>
              Admin workspace
            </Typography>
            <Typography
              component="p"
              variant="h4"
              sx={{ mt: 1, maxWidth: "22ch", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15, color: "#fff" }}
            >
              Keep the catalogue and enquiries current.
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          component="section"
          aria-labelledby="login-heading"
          sx={{
            width: "100%",
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.admin.border}`,
            p: { xs: 2.5, sm: 4 },
            boxShadow: "0 16px 44px rgba(10,42,26,0.08)",
          }}
        >
          <Typography component="h1" id="login-heading" variant="h4" sx={{ fontWeight: 600, letterSpacing: "-0.035em" }}>
            Sign in to your workspace
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
            Manage the Sodoh Nigeria site content, product listings, and enquiries. Use your staff account to continue.
          </Typography>

          {error && (
            <Alert severity="error" id={errorId} sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                id="admin-email"
                name="email"
                label="Email address"
                type="email"
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(null); }}
                error={Boolean(error)}
                slotProps={{ htmlInput: { "aria-describedby": error ? errorId : undefined } }}
                placeholder="staff@sodoh.com"
                fullWidth
              />

              <TextField
                id="admin-password"
                name="password"
                label="Password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(null); }}
                error={Boolean(error)}
                slotProps={{ htmlInput: { "aria-describedby": error ? errorId : undefined } }}
                placeholder="••••••••"
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                aria-busy={loading}
                fullWidth
                sx={{ minHeight: 48, borderRadius: 2 }}
              >
                {loading ? "Signing in…" : "Sign in →"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default function AdminLoginPage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <Suspense fallback={<Box role="status" sx={{ display: "grid", minHeight: "100dvh", placeItems: "center", px: 2.5, color: (theme) => theme.palette.admin.muted }}>Loading sign-in form…</Box>}>
        <LoginForm />
      </Suspense>
    </>
  );
}
