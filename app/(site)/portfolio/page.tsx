import type { Metadata } from "next";
import { Suspense } from "react";
import { Gallery, GalleryFromUrl } from "@/components/site/portfolio/gallery";
import { copy, photos } from "@/content/site";

export const metadata: Metadata = {
  title: copy.portfolio.title,
  description:
    "Portraits, convocations, weddings, sports, events and wildlife by RufusShotThis.",
};

/**
 * Portfolio. The full gallery is prerendered as static HTML (the Suspense fallback),
 * then the URL-aware version takes over to apply any ?category= filter.
 */
export default function PortfolioPage() {
  return (
    <section className="mx-auto max-w-site px-gutter pt-10 pb-section">
      <h1 className="text-4xl sm:text-5xl">{copy.portfolio.title}</h1>
      <p className="mt-3 mb-8 max-w-md text-muted-foreground">
        {copy.portfolio.intro}
      </p>
      <Suspense fallback={<Gallery photos={photos} />}>
        <GalleryFromUrl photos={photos} />
      </Suspense>
    </section>
  );
}
