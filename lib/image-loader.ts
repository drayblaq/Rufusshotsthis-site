"use client";

/**
 * Custom next/image loader (wired up in next.config.ts).
 *
 * Photos are pre-optimised by scripts/optimize-photos.mjs into fixed widths,
 * so instead of resizing on Vercel (which uses up its image quota), we just
 * point each requested width at the nearest pre-built file.
 *   "/photos/placeholder-01" + width 700  ->  "/photos/placeholder-01-960.webp"
 * Anything else (e.g. logos) is served as-is.
 */

export const PHOTO_WIDTHS = [480, 960, 1600] as const; // keep in sync with the script

type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width }: LoaderArgs): string {
  if (!src.startsWith("/photos/")) return src;
  const best = PHOTO_WIDTHS.find((w) => w >= width) ?? PHOTO_WIDTHS.at(-1);
  return `${src}-${best}.webp`;
}
