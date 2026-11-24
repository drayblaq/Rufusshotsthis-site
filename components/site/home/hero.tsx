"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { categoryLabel, copy, type Photo } from "@/content/site";
import { cn } from "@/lib/utils";
import { ArrowButtons, LensRing } from "./lens-ring";

/**
 * Home hero. One `index` state drives two presentations:
 * - motion-safe:   the rotating lens ring
 * - motion-reduce: a plain horizontal scroll-snap carousel (no animation)
 * Both are in the HTML and CSS shows exactly one, so there is no flash or
 * layout jump while JavaScript loads.
 */
export function Hero({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const current = photos[index];
  const go = (i: number) => setIndex((i + count) % count); // arrows wrap around

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else return;
    e.preventDefault();
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured photos"
      className="mx-auto grid max-w-site grid-cols-[minmax(0,1fr)] gap-x-12 px-gutter pt-8 pb-section lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:pt-14"
    >
      {/* Intro text */}
      <div className="lg:col-start-1">
        <p className="eyebrow">{copy.hero.eyebrow}</p>
        <h1 className="mt-3 text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-6xl">
          {copy.hero.title}
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">{copy.hero.intro}</p>
      </div>

      {/* Photos: lens ring, or simple carousel for reduced motion */}
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Featured photos. Use the left and right arrow keys to browse."
        className="-mx-gutter mt-8 min-w-0 rounded-md focus-visible:outline-offset-4 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mx-0 lg:mt-0"
      >
        <div className="motion-reduce:hidden">
          <LensRing photos={photos} index={index} onIndexChange={setIndex} />
        </div>
        <div className="hidden motion-reduce:block">
          <SimpleCarousel
            photos={photos}
            index={index}
            onIndexChange={setIndex}
          />
        </div>
      </div>

      {/* Caption for the current photo + controls ("beside" it on desktop).
          On phones the arrows sit on the LEFT so the floating WhatsApp button
          (bottom-right) can never cover them. */}
      <div className="mt-6 flex flex-row-reverse items-end justify-end gap-5 lg:col-start-1 lg:mt-10 lg:flex-row lg:justify-between">
        {/* key={index} replays the small fade-in when the photo changes */}
        <div
          key={index}
          aria-live="polite"
          className="animate-in duration-300 fade-in"
        >
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <span aria-hidden> · </span>
            {categoryLabel(current.category)}
          </p>
          <p className="mt-1 font-display text-2xl">{current.title}</p>
        </div>
        <ArrowButtons
          onPrev={() => go(index - 1)}
          onNext={() => go(index + 1)}
          label="photo"
        />
      </div>

      {/* Calls to action */}
      <div className="mt-8 flex flex-wrap gap-3 lg:col-start-1">
        <Link href="/book" className={buttonVariants({ size: "cta" })}>
          {copy.cta.primary}
        </Link>
        <Link
          href={`/portfolio?category=${current.category}`}
          className={buttonVariants({ size: "cta", variant: "outline" })}
        >
          More {categoryLabel(current.category).toLowerCase()} <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

/** Reduced-motion fallback: native horizontal scrolling with snap points. */
function SimpleCarousel({
  photos,
  index,
  onIndexChange,
}: {
  photos: Photo[];
  index: number;
  onIndexChange: (i: number) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  // Arrow buttons / keys -> scroll the matching photo into place (instantly).
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (list && item)
      list.scrollTo({
        left: item.offsetLeft - list.offsetLeft,
        behavior: "instant",
      });
  }, [index]);

  // Swiping natively -> update the caption.
  function onScroll() {
    const list = listRef.current;
    const first = list?.children[0] as HTMLElement | undefined;
    if (!list || !first) return;
    const i = Math.round(list.scrollLeft / (first.offsetWidth + 12));
    if (i !== index) onIndexChange(Math.max(0, Math.min(photos.length - 1, i)));
  }

  return (
    <ul
      ref={listRef}
      onScroll={onScroll}
      className="flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto px-gutter lg:px-0"
    >
      {photos.map((photo, i) => (
        <li
          key={photo.src}
          className={cn(
            "relative aspect-[4/5] w-[min(62vw,17rem)] shrink-0 snap-start overflow-hidden rounded-md bg-muted lg:w-[19rem]",
          )}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            // Same sizes as the ring, so the browser reuses the same file.
            sizes="(min-width: 1024px) 19rem, 62vw"
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            loading={i === 0 ? "eager" : "lazy"}
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
