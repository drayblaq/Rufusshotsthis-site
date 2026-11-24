import Image from "next/image";
import { site } from "@/content/site";

/**
 * The script wordmark as an image.
 * - "dark": near-black logo for the light header (generated from the white one).
 * - "light": the original white logo for dark bands/overlays.
 * Both files are already trimmed + compressed by scripts/make-logos.mjs, so
 * `unoptimized` serves them as-is (no extra processing on Vercel).
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Image
      src={
        tone === "dark"
          ? "/brand/logo-dark-web.png"
          : "/brand/logo-white-web.png"
      }
      alt={site.name}
      width={465}
      height={177}
      unoptimized
      loading="eager"
      className={className}
    />
  );
}
