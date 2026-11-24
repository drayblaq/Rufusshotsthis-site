/**
 * The site's public URL, used for absolute links (social preview, sitemap, robots).
 * - Custom domain: set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://rufusshotthis.com).
 * - Otherwise on Vercel: the project's production URL, provided automatically.
 * - Locally: http://localhost:3000
 */
export function siteUrl(): string {
  const custom = process.env.NEXT_PUBLIC_SITE_URL;
  if (custom) return custom.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
