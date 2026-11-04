import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js blocks dev-only resources (HMR, dev chunks) from unknown origins.
  // The preview proxy serves this app from a *.e2b.app host, so allow it.
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "localhost", "127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
