import type { MetadataRoute } from "next";
import { nav } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

/** /sitemap.xml built from the nav in content/site.ts (Home, Portfolio, Book). */
export default function sitemap(): MetadataRoute.Sitemap {
  return nav.map((item) => ({
    url: `${siteUrl()}${item.href === "/" ? "" : item.href}`,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
