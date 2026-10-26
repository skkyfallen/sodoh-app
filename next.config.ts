import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  // Enable DNS prefetching for improved performance
  { key: "X-DNS-Prefetch-Control", value: "on" },
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
  // Force HTTPS for 2 years (only applied in production)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Basic Content-Security-Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-eval' in dev; 'unsafe-inline' remains a known CSP gap.
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      // Allow connections to Supabase
      "connect-src 'self' https://*.supabase.co https://*.supabase.io wss://*.supabase.co",
      "font-src 'self'",
      "frame-src 'self' https://maps.google.com https://www.google.com",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Dev only: let phones and other devices on the local network load dev assets
  // (without this, Next blocks the JS bundles and buttons never hydrate).
  allowedDevOrigins: ["10.0.0.*", "192.168.*.*", "100.65.197.35"],
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
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
