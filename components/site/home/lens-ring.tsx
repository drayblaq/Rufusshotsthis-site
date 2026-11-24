"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * "Lens ring" hero: photos sit on a big circle, like the markings on a lens
 * focus ring, and the ring turns to bring one photo to the top.
 *
 * Performance notes (low-end phones):
 * - Geometry is pure CSS (custom properties + calc), no layout measuring per frame.
 * - Only ONE thing moves: the ring's `rotate()`, a GPU-composited transform.
 * - While dragging we write the angle straight to the DOM inside rAF; React
 *   state only changes when the selected photo changes (on release / arrows).
 */

const STEP = 26; // degrees between photos on the ring
const DRAG_THRESHOLD = 6; // px of movement before a press counts as a drag
const FLICK_VELOCITY = 0.35; // px/ms; a quick flick advances one photo

export function LensRing({
  photos,
  onIndexChange,
  index,
}: {
  photos: Photo[];
  index: number;
  onIndexChange: (i: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    startX: number;
    lastX: number;
    lastT: number;
    velocity: number;
    radius: number; // ring radius in px, measured once per drag
    moved: boolean;
    frame: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const last = photos.length - 1;

  const setAngle = useCallback((deg: number) => {
    ringRef.current?.style.setProperty("--angle", `${deg}deg`);
  }, []);

  // Whenever the selected photo changes (arrows, keys, tap, swipe), snap to it.
  useEffect(() => setAngle(-index * STEP), [index, setAngle]);

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    const card = stageRef.current?.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card?.offsetWidth ?? 280;
    drag.current = {
      startX: e.clientX,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
      radius: cardWidth * 2.3, // matches --ring-r in CSS below
      moved: false,
      frame: 0,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      d.moved = true;
      setDragging(true); // disables the CSS transition while following the finger
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    const dt = e.timeStamp - d.lastT || 1;
    d.velocity = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;

    // Arc length -> degrees, so the photo stays under the finger.
    let deg = -index * STEP + (dx / d.radius) * (180 / Math.PI);
    // Rubber-band past the first/last photo.
    const min = -last * STEP;
    if (deg > 0) deg *= 0.35;
    if (deg < min) deg = min + (deg - min) * 0.35;

    cancelAnimationFrame(d.frame);
    d.frame = requestAnimationFrame(() => setAngle(deg));
  }

  function onPointerUp(e: React.PointerEvent) {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    cancelAnimationFrame(d.frame);

    if (!d.moved) {
      // A tap: if it landed on a side photo, bring that one to the top.
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-card]",
      );
      const i = target ? Number(target.dataset.card) : index;
      if (i !== index) onIndexChange(i);
      return;
    }

    setDragging(false);
    const dx = e.clientX - d.startX;
    const travelled = (dx / d.radius) * (180 / Math.PI);
    let next = Math.round(index - travelled / STEP);
    // A fast flick that didn't cross halfway still moves one photo.
    if (next === index && Math.abs(d.velocity) > FLICK_VELOCITY) {
      next = index + (d.velocity < 0 ? 1 : -1);
    }
    next = Math.max(0, Math.min(last, next));
    if (next === index)
      setAngle(-index * STEP); // snap back
    else onIndexChange(next);
  }

  return (
    <div
      ref={stageRef}
      // pan-y: vertical page scroll still works; we only take horizontal drags.
      className="relative h-(--stage-h) touch-pan-y overflow-hidden select-none [--card-h:calc(var(--card-w)*1.25)] [--card-w:min(62vw,17rem)] [--ring-r:calc(var(--card-w)*2.3)] [--stage-h:calc(var(--card-h)+var(--card-w)*0.42+1.5rem)] lg:[--card-w:19rem]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Index mark: a small fixed notch, like the marker on a lens barrel */}
      <span
        aria-hidden
        className="absolute top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-highlight"
      />

      {/* The ring. Its centre sits far below the stage; only the top arc is visible. */}
      <div
        ref={ringRef}
        className={cn(
          "absolute left-1/2 size-0 rotate-(--angle) will-change-transform",
          "top-[calc(1rem+var(--card-h)/2+var(--ring-r))]",
          !dragging &&
            "transition-transform duration-(--duration-slow) ease-(--ease-soft)",
        )}
        style={{ "--angle": "0deg" } as React.CSSProperties}
      >
        <TickRing />
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            data-card={i}
            className={cn(
              "absolute top-[calc(var(--card-h)/-2)] left-[calc(var(--card-w)/-2)] h-(--card-h) w-(--card-w)",
              "overflow-hidden rounded-md bg-muted shadow-sm",
              "transition-opacity duration-(--duration-base)",
              i === index ? "opacity-100" : "cursor-pointer opacity-55",
            )}
            style={{
              transform: `rotate(${i * STEP}deg) translateY(calc(-1 * var(--ring-r)))`,
            }}
            aria-hidden={i !== index}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 19rem, 62vw"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              // Only the first (visible on load) photo is preloaded.
              preload={i === 0}
              draggable={false}
              className="pointer-events-none object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Lens-style tick marks drawn as one dashed SVG circle that rotates with the ring.
 * stroke-width (screen px, via non-scaling-stroke) = tick length; dash = tick thickness. pathLength=360 makes the
 * dash maths work in degrees. Major ticks line up with each photo position.
 */
function TickRing() {
  // Circle paths start at 3 o'clock; the top is 270 units along. Offset so a
  // major tick lands exactly on 270 (the photo positions are top + i * STEP).
  const majorOffset = (STEP - ((270 - 0.2) % STEP)) % STEP;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-[calc(var(--tick-r)*-1)] left-[calc(var(--tick-r)*-1)] size-[calc(var(--tick-r)*2)] overflow-visible text-ink/25 [--tick-r:calc(var(--ring-r)-var(--card-h)/2-1.1rem)]"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="49"
        fill="none"
        stroke="currentColor"
        pathLength={360}
        strokeDasharray="0.12 1.88"
        strokeWidth={6}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="50"
        cy="50"
        r="49"
        fill="none"
        stroke="currentColor"
        pathLength={360}
        strokeDasharray={`0.4 ${STEP - 0.4}`}
        strokeDashoffset={majorOffset}
        strokeWidth={14}
        vectorEffect="non-scaling-stroke"
        className="text-ink/50"
      />
    </svg>
  );
}

/** Previous / next buttons shared by the ring and the reduced-motion carousel. */
export function ArrowButtons({
  onPrev,
  onNext,
  label,
}: {
  onPrev: () => void;
  onNext: () => void;
  label: string;
}) {
  const cls =
    "grid size-11 place-items-center rounded-full border bg-background transition-colors hover:bg-muted";
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onPrev}
        className={cls}
        aria-label={`Previous ${label}`}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        className={cls}
        aria-label={`Next ${label}`}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
