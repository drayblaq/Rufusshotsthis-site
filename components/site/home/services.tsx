import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  bookingPolicy,
  copy,
  formatNaira,
  packages,
  services,
} from "@/content/site";
import { SectionHeading } from "../section-heading";

/** What he shoots + a compact look at the three packages. Full details live on /book. */
export function Services() {
  const from = Math.min(...packages.map((p) => p.price));
  return (
    <section
      aria-labelledby="services-title"
      className="@container container-site py-section"
    >
      <SectionHeading
        id="services-title"
        eyebrow={copy.services.eyebrow}
        title={copy.services.title}
      />

      <ul className="mt-8 grid gap-x-[clamp(1.5rem,4vw,2.5rem)] @xl:grid-cols-2 @4xl:grid-cols-4">
        {services.map((s) => (
          <li key={s.title} className="border-t py-4">
            <h3 className="font-sans text-base font-medium tracking-normal">
              {s.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
          </li>
        ))}
      </ul>

      <div className="@container mt-12 rounded-lg border bg-card p-[clamp(1.25rem,4vw,2rem)]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-h3">Packages</h3>
          <p className="text-sm text-muted-foreground">
            {copy.services.packagesNote}{" "}
            <span className="font-medium text-foreground">
              {formatNaira(from)}
            </span>
          </p>
        </div>
        <ul className="mt-5 grid gap-fluid @2xl:grid-cols-3">
          {packages.map((p) => (
            <li key={p.id} className="rounded-md bg-muted px-4 py-4">
              <p className="flex items-center justify-between text-sm font-medium">
                {p.name}
                {p.popular && (
                  <span className="text-xs font-semibold tracking-[0.15em] text-highlight uppercase">
                    Popular
                  </span>
                )}
              </p>
              <p className="mt-1 font-display text-3xl">
                {formatNaira(p.price)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {p.duration} · {p.outfits} outfit{p.outfits > 1 ? "s" : ""} ·{" "}
                {p.editedPhotos} edited
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-sm text-muted-foreground">
            {bookingPolicy.summary}
          </p>
          <Link href="/book" className={buttonVariants({ size: "cta" })}>
            See packages &amp; book
          </Link>
        </div>
      </div>
    </section>
  );
}
