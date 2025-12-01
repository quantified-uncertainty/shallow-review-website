import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Turbopack configuration (Next.js 15+ default bundler)
  turbopack: {},

  // Output standalone build for optimized Docker deployments
  output: "standalone",
};

export default nextConfig;
