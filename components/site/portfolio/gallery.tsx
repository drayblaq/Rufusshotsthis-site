"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { categories, copy, type CategoryId, type Photo } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Lightbox } from "./lightbox";

type Filter = CategoryId | "all";

const isCategory = (v: string | null): v is CategoryId =>
  categories.some((c) => c.id === v);

/**
 * ?category= from the URL (links from the Home page use it). Read with
 * useSyncExternalStore: "all" in the prerendered HTML, the real value after
 * hydration. One component tree throughout, so no image is ever remounted
 * (a Suspense fallback swap would remount every photo and delay the first paint).
 */
const subscribeUrl = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};
const urlCategory = () =>
  new URLSearchParams(window.location.search).get("category");

/**
 * Filterable photo grid + lightbox.
 * Filtering hides photos (the `hidden` attribute) rather than unmounting them, so
 * already-loaded images never re-download; shown photos fade in briefly.
 */
export function Gallery({ photos }: { photos: Photo[] }) {
  const fromUrl = useSyncExternalStore(subscribeUrl, urlCategory, () => null);
  const [chosen, setChosen] = useState<Filter | null>(null); // a chip the visitor tapped
  const filter: Filter = chosen ?? (isCategory(fromUrl) ? fromUrl : "all");
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
    setChosen(next);
    trackEvent("portfolio_filter", { category: next });
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
        className="-mx-[4.3478%] flex touch-pan-x touch-pan-y [scrollbar-width:none] gap-2 overflow-x-auto px-[4.3478%] pb-1"
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
                "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors duration-(--duration-fast)",
                active
                  ? "border-ink bg-ink text-paper"
                  : "bg-background hover:border-ink/40",
              )}
            >
              {c.label}
              <span className={cn("text-xs tabular-nums", "font-semibold")}>
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

      {/* Row-by-row grid (left to right), so the lightbox's "next" follows what the eye
          reads and the first row is known to be above the fold (loaded eagerly).
          Container query: 3 columns once the gallery itself is wide enough. */}
      <div className="@container">
        <ul
          ref={gridRef}
          className="mt-6 grid grid-cols-2 gap-fluid @3xl:grid-cols-3"
        >
          {photos.map((photo, i) => {
            const shown = filter === "all" || photo.category === filter;
            const pos = visible.indexOf(photo);
            return (
              <li key={photo.src} hidden={!shown}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(pos);
                    trackEvent("photo_open", { category: photo.category });
                  }}
                  aria-label={`View ${photo.title} full screen`}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 23rem, (min-width: 768px) 33vw, 50vw"
                    // First row (2 on phones) is above the fold: load right away, the first
                    // at high priority. Every other photo lazy-loads as it scrolls in.
                    loading={i < 2 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    placeholder="blur"
                    blurDataURL={photo.blurDataURL}
                    className="object-cover object-[50%_30%] transition-transform duration-(--duration-slow) ease-(--ease-soft) group-hover:scale-[1.02]"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

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
