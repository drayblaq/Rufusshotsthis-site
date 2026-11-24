"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { categoryLabel, type Photo } from "@/content/site";

/**
 * Full-screen photo viewer built on the native <dialog> element. showModal() gives us,
 * for free: focus trapped inside, Escape to close, the page behind made inert,
 * and focus returned to the photo you opened when it closes.
 * Swipe left/right on touch, arrow keys on keyboard.
 */
export function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number | null; // null = closed
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; dx: number } | null>(null);
  const photo = index === null ? null : photos[index];
  const count = photos.length;

  // Open/close the native dialog to match state.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (dir: 1 | -1) => {
    if (index !== null) onNavigate((index + dir + count) % count);
  };

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  }

  // Swipe: move the photo with the finger (direct DOM write, no re-render),
  // then either change photo or spring back.
  const setX = (x: number, animate: boolean) => {
    const el = figureRef.current;
    if (!el) return;
    el.style.transition = animate
      ? "transform var(--duration-base) var(--ease-soft)"
      : "none";
    el.style.transform = x ? `translateX(${x}px)` : "";
  };
  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return; // mouse users have buttons + keys
    swipe.current = { x: e.clientX, dx: 0 };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!swipe.current) return;
    swipe.current.dx = e.clientX - swipe.current.x;
    setX(swipe.current.dx, false);
  }
  function onPointerUp() {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    if (Math.abs(s.dx) > 60) {
      setX(0, false);
      step(s.dx < 0 ? 1 : -1);
    } else {
      setX(0, true);
    }
  }

  const navBtn =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/70 md:grid";
  // Phones: one-handed controls in the thumb zone at the bottom
  const thumbBtn =
    "grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors active:bg-white/25";

  return (
    <dialog
      ref={dialogRef}
      aria-label={
        photo
          ? `${photo.title}, photo ${index! + 1} of ${count}`
          : "Photo viewer"
      }
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col bg-black p-0 text-white backdrop:bg-black open:flex open:animate-in open:duration-200 open:fade-in"
    >
      {photo && (
        <>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-base font-semibold tabular-nums">
              {index! + 1} / {count}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="hidden size-11 place-items-center rounded-full hover:bg-white/10 md:grid"
            >
              <X className="size-6" />
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1 touch-pan-y overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* key: re-mount per photo for a quick fade between images */}
            <div
              key={photo.src}
              ref={figureRef}
              className="absolute inset-0 animate-in duration-200 fade-in"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
                draggable={false}
                className="object-contain select-none"
              />
            </div>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className={`${navBtn} left-3`}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className={`${navBtn} right-3`}
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          <div className="px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center">
            <p className="font-display text-xl">{photo.title}</p>
            <p className="mt-0.5 text-xs font-semibold tracking-[0.2em] uppercase">
              {categoryLabel(photo.category)}
            </p>
            <div className="mt-3 flex items-center justify-center gap-6 md:hidden">
              {count > 1 && (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className={thumbBtn}
                >
                  <ChevronLeft className="size-6" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-14 place-items-center rounded-full bg-white text-ink"
              >
                <X className="size-6" strokeWidth={2.5} />
              </button>
              {count > 1 && (
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className={thumbBtn}
                >
                  <ChevronRight className="size-6" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
