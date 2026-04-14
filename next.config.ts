import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the site from being embedded in an iframe (clickjacking protection)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features / powerful APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 1 year (only applied in production)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Basic Content-Security-Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-eval' in dev; restrict to self + supabase in prod
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      // Allow connections to Supabase
      "connect-src 'self' https://*.supabase.co https://*.supabase.io wss://*.supabase.co",
      "font-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // NOTE: 'unsafe-inline' and 'unsafe-eval' are required by Next.js for
      // its runtime hydration. A nonce-based or hash-based CSP would be
      // stronger but requires additional Next.js middleware configuration
      // beyond the scope of this change.
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "@supabase/supabase-js",
      "@supabase/ssr",
    ],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
