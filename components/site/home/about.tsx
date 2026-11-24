import { bio, site } from "@/content/site";

/** Short introduction. Text only: fast, and lets the photos above do the talking. */
export function About() {
  return (
    <section aria-labelledby="about-title" className="border-y bg-card">
      <div className="container-site grid gap-[clamp(1.5rem,5vw,4rem)] py-section md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">About</p>
          <h2 id="about-title" className="mt-2 text-h2">
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
