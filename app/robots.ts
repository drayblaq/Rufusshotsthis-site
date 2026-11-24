import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/** /robots.txt: everything may be indexed; points crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
