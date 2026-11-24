import type { BookableDay } from "@/lib/schedule";
import { cn } from "@/lib/utils";

/**
 * Horizontally scrollable row of day chips with scroll-snap.
 * Chips are 64px wide (spec: at least 48px) so they're easy to tap at 320px.
 * Native scrolling + touch-action pan-x pan-y: sideways swipes scroll the row,
 * vertical swipes still scroll the page.
 */
export function DayPicker({
  days,
  value,
  onChange,
  errorId,
}: {
  days: BookableDay[] | null; // null = not known yet (before hydration)
  value: string;
  onChange: (key: string) => void;
  errorId?: string;
}) {
  const row =
    "-mx-5 flex touch-pan-x touch-pan-y snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:thin]";

  // Days depend on "today", which is only known in the browser. Until then show
  // same-sized placeholders so nothing jumps.
  if (!days) {
    return (
      <div className={row} aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="h-[4.75rem] w-16 shrink-0 rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={row}>
      {days.map((d) => (
        <label
          key={d.key}
          title={d.available ? d.label : `${d.label} (unavailable)`}
          className={cn(
            "relative flex h-[4.75rem] w-16 shrink-0 cursor-pointer snap-start flex-col items-center justify-center rounded-lg border-2 border-ink/25 bg-background leading-tight transition-colors",
            "hover:border-ink/60",
            "has-checked:border-ink has-checked:bg-ink has-checked:text-paper",
            "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
            "has-disabled:cursor-not-allowed has-disabled:border-dashed",
          )}
        >
          <input
            type="radio"
            name="date"
            value={d.key}
            checked={value === d.key}
            disabled={!d.available}
            onChange={() => onChange(d.key)}
            aria-label={d.available ? d.label : `${d.label}, unavailable`}
            aria-describedby={errorId}
            className="peer sr-only"
          />
          <span className="text-xs font-semibold uppercase">{d.weekday}</span>
          <span className="font-display text-2xl font-semibold peer-disabled:line-through">
            {d.day}
          </span>
          <span className="text-xs font-semibold">
            {d.available ? d.month : "Off"}
          </span>
        </label>
      ))}
    </div>
  );
}
