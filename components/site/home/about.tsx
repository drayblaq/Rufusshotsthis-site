import { bio, site } from "@/content/site";

/** Short introduction. Text only: fast, and lets the photos above do the talking. */
export function About() {
  return (
    <section aria-labelledby="about-title" className="border-y bg-card">
      <div className="mx-auto grid max-w-site gap-6 px-gutter py-section md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div>
          <p className="eyebrow">About</p>
          <h2 id="about-title" className="mt-2 text-3xl sm:text-4xl">
            {bio.heading}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {site.location.line}
          </p>
        </div>
        <div className="space-y-4 text-lg leading-relaxed">
          {bio.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
