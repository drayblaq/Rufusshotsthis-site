"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Aperture,
  House,
  Images,
  MessageCircle,
  Send,
  Tag,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { mobileNavLabels as L, whatsappMessages } from "@/content/site";
import {
  getBookingBar,
  getServerBookingBar,
  subscribeBookingBar,
} from "@/lib/booking-bar";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Phone-only bottom navigation (hidden from md up, where the header nav takes over).
 *
 *   Home | Portfolio | (Book shutter button) | Prices | Chat
 *
 * - On /book (while the form is shown) the centre button becomes "Send": a submit
 *   button for the booking form, plus a summary strip above the bar.
 * - Slides away while a text field is focused / the on-screen keyboard is open.
 * - The lightbox is a modal <dialog> (top layer), so it always covers this bar.
 */

// Geometry (px). The notch is cut around the raised Book button.
const BAR_H = 64;
const FAB = 64;
const FAB_DROP = 4; // FAB centre sits 4px below the bar's top edge, so most of it rises above
const NOTCH_R = FAB / 2 + 3 + 6; // radius + clay ring + breathing gap

const SLOTS = 5; // the pill moves in fifths of the bar
// The bar is a fixed-size control (px), so its tap-target minimums and label sizes are
// capped in px too: at 200% text, rem-based minimums (5 x 96px) would overflow a phone.

/** True while a text-like field has focus or the visual viewport has shrunk (keyboard). */
function keyboardSnapshot(): boolean {
  const el = document.activeElement;
  const typing =
    el instanceof HTMLElement &&
    el.matches(
      "textarea, select, [contenteditable=''], [contenteditable='true'], input:not([type=radio]):not([type=checkbox]):not([type=button]):not([type=submit]):not([type=range])",
    );
  const vv = window.visualViewport;
  const squeezed = vv ? window.innerHeight - vv.height > 150 : false;
  return typing || squeezed;
}
function subscribeKeyboard(onChange: () => void) {
  document.addEventListener("focusin", onChange);
  document.addEventListener("focusout", onChange);
  window.visualViewport?.addEventListener("resize", onChange);
  return () => {
    document.removeEventListener("focusin", onChange);
    document.removeEventListener("focusout", onChange);
    window.visualViewport?.removeEventListener("resize", onChange);
  };
}
const useKeyboardOpen = () =>
  useSyncExternalStore(subscribeKeyboard, keyboardSnapshot, () => false);

export function MobileNav() {
  const pathname = usePathname();
  const keyboardOpen = useKeyboardOpen();
  const booking = useSyncExternalStore(
    subscribeBookingBar,
    getBookingBar,
    getServerBookingBar,
  );
  const sendMode = pathname === "/book" && booking.active;
  const showStrip =
    sendMode && (booking.summary !== "" || booking.errorCount > 0);

  // usePathname ignores ?query, so /portfolio?category=sports still highlights Portfolio.
  const active =
    pathname === "/" ? 0 : pathname.startsWith("/portfolio") ? 1 : -1;

  const tabClass =
    "relative z-10 flex min-h-[48px] min-w-[48px] flex-col items-center justify-start gap-1 rounded-xl pt-2 outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-ink";

  return (
    <nav
      aria-label="Mobile"
      data-mobile-nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-(--duration-base) ease-(--ease-soft) md:hidden",
        // Soft shadow that follows the notched shape (box-shadow would be clipped by the mask)
        "drop-shadow-[0_-4px_14px_rgba(28,25,23,0.14)]",
        keyboardOpen && "pointer-events-none translate-y-[calc(100%+9rem)]",
      )}
    >
      {/* Book page: slim summary of the choices so far, floating just above the
          raised button (so the button never covers it). aria-live announces changes. */}
      {showStrip && (
        <p
          data-booking-strip
          aria-live="polite"
          className={cn(
            "absolute left-1/2 max-w-[92%] -translate-x-1/2 truncate rounded-full px-4 py-1.5 text-[clamp(12px,0.8125rem,15px)] leading-tight font-semibold shadow-md",
            booking.errorCount > 0
              ? "bg-destructive text-white"
              : "bg-ink text-paper",
          )}
          style={{ bottom: `calc(100% + ${FAB / 2 - FAB_DROP + 8}px)` }}
        >
          {booking.errorCount > 0
            ? `${booking.errorCount === 1 ? "1 thing needs" : `${booking.errorCount} things need`} your attention`
            : booking.summary}
        </p>
      )}

      {/* Bar surface with a curved notch cut around the Book button */}
      <div
        aria-hidden
        className="absolute inset-0 bg-paper"
        style={{
          mask: `radial-gradient(circle at 50% ${FAB_DROP}px, transparent ${NOTCH_R}px, #000 ${NOTCH_R + 0.5}px)`,
        }}
      />

      <ul
        className="relative grid grid-cols-5 pb-[env(safe-area-inset-bottom)]"
        style={{ height: `calc(${BAR_H}px + env(safe-area-inset-bottom))` }}
      >
        {/* Sliding active pill: one element, moved with a CSS transform */}
        <li
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-2 left-0 flex h-8 justify-center transition-[transform,opacity] duration-(--duration-base) ease-(--ease-soft)",
            active < 0 && "opacity-0",
          )}
          style={{
            width: `${100 / SLOTS}%`,
            transform: `translateX(${Math.max(active, 0) * 100}%)`,
          }}
        >
          <span className="h-8 w-14 rounded-full bg-highlight/15" />
        </li>

        <Tab
          href="/"
          label={L.home}
          Icon={House}
          current={active === 0}
          className={tabClass}
        />
        <Tab
          href="/portfolio"
          label={L.portfolio}
          Icon={Images}
          current={active === 1}
          className={tabClass}
        />

        {/* Centre: the raised button. "Book" link everywhere, "Send" (submits the
            booking form) on /book while the form is on screen. */}
        <li className="relative flex justify-center">
          {sendMode ? (
            <button
              type="submit"
              form="booking-form"
              aria-label="Send booking request on WhatsApp"
              onClick={() => navigator.vibrate?.(10)}
              className={centreClass}
              style={{ top: `${FAB_DROP - FAB / 2}px` }}
            >
              <CentreButton
                key="send"
                Icon={Send}
                label={L.send}
                pulse={booking.complete}
                pulseFast
              />
            </button>
          ) : (
            <Link
              href="/book"
              aria-label="Book a shoot"
              onClick={() => navigator.vibrate?.(10)}
              className={centreClass}
              style={{ top: `${FAB_DROP - FAB / 2}px` }}
            >
              <CentreButton key="book" Icon={Aperture} label={L.book} pulse />
            </Link>
          )}
        </li>

        <Tab
          href="/book#packages"
          label={L.prices}
          Icon={Tag}
          current={false}
          className={tabClass}
        />
        <li className="flex justify-center">
          <a
            href={whatsappLink(whatsappMessages.chat)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${L.chat} on WhatsApp`}
            className={tabClass}
          >
            <span className="grid h-8 place-items-center">
              <MessageCircle
                aria-hidden
                strokeWidth={2.5}
                className="size-[22px]"
              />
            </span>
            <span className="text-[clamp(12px,0.75rem,14px)] leading-none font-bold">
              {L.chat}
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

function Tab({
  href,
  label,
  Icon,
  current,
  className,
}: {
  href: string;
  label: string;
  Icon: typeof House;
  current: boolean;
  className: string;
}) {
  return (
    <li className="flex justify-center">
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        className={className}
      >
        <span className="grid h-8 place-items-center">
          <Icon
            aria-hidden
            strokeWidth={current ? 2.75 : 2.25}
            className="size-[22px]"
          />
        </span>
        <span
          className={cn(
            "text-[clamp(12px,0.75rem,14px)] leading-none",
            current ? "font-extrabold" : "font-bold",
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

const centreClass =
  "group absolute inset-x-0 bottom-0 flex flex-col items-center justify-end rounded-xl pb-2 outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-ink";

/**
 * The raised circle + label. Keyed by mode, so switching Book <-> Send re-mounts it
 * and plays the short morph (spin + scale in). Pulse: slow idle on "Book"; on "Send"
 * only once the form is complete. Reduced motion: no pulse, no morph.
 */
function CentreButton({
  Icon,
  label,
  pulse,
  pulseFast = false,
}: {
  Icon: typeof Aperture;
  label: string;
  pulse: boolean;
  pulseFast?: boolean;
}) {
  return (
    <>
      <span
        className="absolute left-1/2 grid -translate-x-1/2 place-items-center rounded-full bg-ink text-paper shadow-[0_6px_16px_rgba(28,25,23,0.35)] ring-3 ring-highlight transition-transform duration-(--duration-fast) group-active:scale-90"
        style={{ top: 0, width: FAB, height: FAB }}
      >
        {pulse && (
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full border-2 border-highlight motion-reduce:hidden",
              pulseFast
                ? "motion-safe:animate-[shutter-pulse_1.6s_ease-out_infinite]"
                : "motion-safe:animate-[shutter-pulse_3.2s_ease-out_infinite]",
            )}
          />
        )}
        <span className="grid place-items-center motion-safe:animate-in motion-safe:duration-300 motion-safe:zoom-in-50 motion-safe:fade-in motion-safe:spin-in-90">
          <Icon
            aria-hidden
            strokeWidth={2.25}
            className="size-8 transition-transform duration-300 ease-(--ease-soft) group-active:rotate-90"
          />
        </span>
      </span>
      <span className="text-[clamp(12px,0.75rem,14px)] leading-none font-extrabold motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in">
        {label}
      </span>
    </>
  );
}
