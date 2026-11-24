import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Photos are pre-built at these widths (scripts/optimize-photos.mjs), and
    // lib/image-loader.ts maps each srcset entry to the matching file.
    // Matching sizes here keeps srcset short with no duplicate URLs.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [480, 960, 1600],
    imageSizes: [240],
    qualities: [75],
  },
  // Photos and logos are already optimised and rarely change: let browsers and
  // Vercel's CDN keep them for a week (revalidating in the background after),
  // so repeat visits on slow data don't download them again.
  async headers() {
    const cache = [
      {
        key: "Cache-Control",
        value: "public, max-age=604800, stale-while-revalidate=86400",
      },
    ];
    return [
      { source: "/photos/:path*", headers: cache },
      { source: "/brand/:path*", headers: cache },
    ];
  },
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
