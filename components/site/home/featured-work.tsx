import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, copy, photos } from "@/content/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../section-heading";

/** One photo per category, each linking to that filter on the Portfolio page. */
export function FeaturedWork() {
  const picks = categories
    .map((c) => ({
      category: c,
      photo: photos.find((p) => p.category === c.id),
    }))
    .filter((x) => x.photo !== undefined);

  return (
    <section
      aria-labelledby="featured-title"
      className="mx-auto max-w-site px-gutter py-section"
    >
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          id="featured-title"
          eyebrow={copy.featured.eyebrow}
          title={copy.featured.title}
        />
        <Link
          href="/portfolio"
          className="hidden shrink-0 items-center gap-1 text-sm hover:underline sm:inline-flex"
        >
          Full portfolio <ArrowRight className="size-4" />
        </Link>
      </div>

      <ul
        className={cn(
          "mt-8 grid grid-cols-2 gap-3 sm:gap-4",
          // 4 categories -> one tidy row of 4 on desktop; otherwise rows of 3
          picks.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {picks.map(({ category, photo }) => (
          <li key={category.id}>
            <Link
              href={`/portfolio?category=${category.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
                <Image
                  src={photo!.src}
                  alt={photo!.alt}
                  fill
                  sizes="(min-width: 1024px) 23rem, 50vw"
                  placeholder="blur"
                  blurDataURL={photo!.blurDataURL}
                  className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-soft) group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-2 flex items-center justify-between text-sm">
                {category.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/portfolio"
        className="mt-6 inline-flex min-h-11 items-center gap-1 text-sm underline-offset-4 hover:underline sm:hidden"
      >
        Full portfolio <ArrowRight className="size-4" />
      </Link>
    </section>
  );
}
