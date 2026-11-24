import { formatNaira, packages } from "@/content/site";
import { bookingCopy } from "@/content/site";
import type { BookingValues } from "@/lib/booking";
import type { BookableDay } from "@/lib/schedule";
import { timeLabel } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "../icons";

/** One-line summary of the current choices, e.g. "Standard · Sat 29 Nov · 11:00 am". */
export function summaryParts(
  values: BookingValues,
  days: BookableDay[] | null,
) {
  const pkg = packages.find((p) => p.id === values.packageId);
  const day = days?.find((d) => d.key === values.date);
  return {
    pkg,
    when: [
      day && `${day.weekday} ${day.day} ${day.month}`,
      values.time && timeLabel(values.time),
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

/** The submit button. type="submit" + form= lets it live outside the field markup. */
export function ConfirmButton({ className }: { className?: string }) {
  return (
    <button
      type="submit"
      form="booking-form"
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-base font-semibold text-paper transition-transform active:scale-[0.98]",
        className,
      )}
    >
      <WhatsAppIcon className="size-5" />
      {bookingCopy.confirm}
    </button>
  );
}

/**
 * Mobile/tablet: a bar stuck to the bottom of the booking form (position: sticky,
 * so it never covers the footer), padded above the iPhone home bar.
 * data-hide-fab hides the floating WhatsApp button on this page (globals.css).
 */
export function StickyBar({
  values,
  days,
  errorCount,
}: {
  values: BookingValues;
  days: BookableDay[] | null;
  errorCount: number;
}) {
  const { pkg, when } = summaryParts(values, days);
  return (
    <div
      data-booking-bar
      data-hide-fab
      className="sticky bottom-0 z-30 -mx-[4vw] mt-6 border-t-2 border-ink bg-background px-[4vw] pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div aria-live="polite" className="min-w-0 text-sm leading-snug">
          {errorCount > 0 ? (
            <p className="font-semibold text-destructive">
              {errorCount === 1 ? "1 thing needs" : `${errorCount} things need`}{" "}
              your attention
            </p>
          ) : (
            <>
              <p className="truncate font-semibold">
                {pkg
                  ? `${pkg.name} · ${formatNaira(pkg.price)}`
                  : "Choose a package"}
              </p>
              <p className="truncate">{when || "Pick a day and time"}</p>
            </>
          )}
        </div>
        <ConfirmButton className="grow sm:grow-0" />
      </div>
    </div>
  );
}

/** Desktop: summary card that stays in view beside the form. */
export function SummaryCard({
  values,
  days,
}: {
  values: BookingValues;
  days: BookableDay[] | null;
}) {
  const { pkg, when } = summaryParts(values, days);
  const rows = [
    ["Package", pkg ? `${pkg.name} · ${formatNaira(pkg.price)}` : "Not chosen"],
    ["When", when || "Not chosen"],
  ];
  return (
    <div className="sticky top-[calc(var(--spacing-header)+1.5rem)] rounded-xl border-2 border-ink bg-card p-5">
      <h2 className="text-h3">Your booking</h2>
      <dl className="mt-4 space-y-3 text-base">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-semibold tracking-[0.15em] uppercase">
              {k}
            </dt>
            <dd className="font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <ConfirmButton className="mt-5 w-full" />
      <p className="mt-3 text-sm">{bookingCopy.depositLine}.</p>
    </div>
  );
}
