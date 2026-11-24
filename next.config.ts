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
