import type { Metadata } from "next";
import { Gallery } from "@/components/site/portfolio/gallery";
import { copy, photos } from "@/content/site";

export const metadata: Metadata = {
  title: copy.portfolio.title,
  description:
    "Portraits, convocations, weddings, sports, events and wildlife by RufusShotThis.",
};

/**
 * Portfolio. The full gallery is prerendered as static HTML; any ?category= filter
 * is applied in the browser after hydration (see Gallery).
 */
export default function PortfolioPage() {
  return (
    <section className="container-site pt-[clamp(1.5rem,5vw,2.5rem)] pb-section">
      <h1 className="text-h1">{copy.portfolio.title}</h1>
      <p className="mt-3 mb-8 max-w-md text-muted-foreground">
        {copy.portfolio.intro}
      </p>
      <Gallery photos={photos} />
    </section>
  );
}
