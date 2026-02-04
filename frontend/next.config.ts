import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL; // e.g. http://localhost:8000

const nextConfig: NextConfig = {
  async rewrites() {
    // Only proxy to backend when BACKEND_URL is set (local dev with FastAPI)
    // Otherwise, Next.js API routes serve static data
    if (!backendUrl) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
