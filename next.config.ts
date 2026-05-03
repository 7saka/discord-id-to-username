import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Workers edge runtime
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
    ],
    // Disable Next.js image optimization — handled by Cloudflare
    unoptimized: true,
  },
};

export default nextConfig;

