import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile exists in a parent directory on some machines)
  turbopack: { root: process.cwd() },
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  async headers() {
    return [
      {
        source: "/(images|textures)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
