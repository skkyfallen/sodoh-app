import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
