"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, copy, type CategoryId, type Photo } from "@/content/site";
import { cn } from "@/lib/utils";
import { Lightbox } from "./lightbox";

type Filter = CategoryId | "all";

const isCategory = (v: string | null): v is CategoryId =>
  categories.some((c) => c.id === v);

/** Reads ?category= from the URL (links from the Home page use it). */
export function GalleryFromUrl({ photos }: { photos: Photo[] }) {
  const param = useSearchParams().get("category");
  return (
    <Gallery photos={photos} initial={isCategory(param) ? param : "all"} />
  );
}

/**
 * Filterable masonry grid + lightbox.
 * Filtering hides photos (the `hidden` attribute) rather than unmounting them, so
 * already-loaded images never re-download; shown photos fade in briefly.
 */
export function Gallery({
  photos,
  initial = "all",
}: {
  photos: Photo[];
  initial?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initial);
  const [open, setOpen] = useState<number | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const firstRender = useRef(true);

  const visible = useMemo(
    () =>
      filter === "all" ? photos : photos.filter((p) => p.category === filter),
    [filter, photos],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: photos.length };
    for (const p of photos) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [photos]);

  function choose(next: Filter) {
    setFilter(next);
    // Keep the URL shareable without a navigation or re-render of the page.
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
  }

  // Subtle fade/rise for the newly filtered set. Skipped for reduced motion.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items =
      gridRef.current?.querySelectorAll<HTMLElement>("li:not([hidden])") ?? [];
    items.forEach((el, i) =>
      el.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 320,
          delay: Math.min(i, 8) * 30,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        },
      ),
    );
  }, [filter]);

  const label =
    filter === "all"
      ? "all categories"
      : categories.find((c) => c.id === filter)?.label;

  return (
    <>
      {/* Filter chips: real buttons with aria-pressed, so screen readers announce the state */}
      <div
        role="group"
        aria-label="Filter photos by category"
        className="-mx-gutter flex [scrollbar-width:none] gap-2 overflow-x-auto px-gutter pb-1"
      >
        {[
          { id: "all" as const, label: copy.portfolio.all }, // Only categories that have photos get a chip (e.g. Weddings appears once added).
          ...categories.filter((c) => counts[c.id]),
        ].map((c) => {
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => choose(c.id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors duration-(--duration-fast)",
                active
                  ? "border-ink bg-ink text-paper"
                  : "bg-background hover:border-ink/40",
              )}
            >
              {c.label}
              <span
                className={cn(
                  "text-xs tabular-nums",
                  active ? "opacity-70" : "text-muted-foreground",
                )}
              >
                {counts[c.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Announced to screen readers after each filter change */}
      <p aria-live="polite" className="sr-only">
        Showing {visible.length} photos in {label}.
      </p>

      {/* CSS-columns masonry: no JS layout, photos keep their natural shape */}
      <ul ref={gridRef} className="mt-6 columns-2 gap-3 sm:gap-4 lg:columns-3">
        {photos.map((photo) => {
          const shown = filter === "all" || photo.category === filter;
          const pos = visible.indexOf(photo);
          return (
            <li
              key={photo.src}
              hidden={!shown}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              <button
                type="button"
                onClick={() => setOpen(pos)}
                aria-label={`View ${photo.title} full screen`}
                className="group block w-full overflow-hidden rounded-md bg-muted"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 23rem, 50vw"
                  placeholder="blur"
                  blurDataURL={photo.blurDataURL}
                  className="h-auto w-full transition-transform duration-(--duration-slow) ease-(--ease-soft) group-hover:scale-[1.02]"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No photos here yet.
        </p>
      )}

      <Lightbox
        photos={visible}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </>
  );
}
