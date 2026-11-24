import type { TimeSlot } from "@/lib/schedule";
import { cn } from "@/lib/utils";

/** Time slots in a wrapping grid: as many columns as fit, never narrower than 6rem. */
export function TimeSlots({
  slots,
  value,
  onChange,
  errorId,
}: {
  slots: TimeSlot[];
  value: string;
  onChange: (time: string) => void;
  errorId?: string;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,6rem),1fr))] gap-2">
      {slots.map((s) => (
        <label
          key={s.time}
          className={cn(
            "relative flex min-h-12 cursor-pointer items-center justify-center rounded-md border-2 border-ink/25 bg-background text-base tabular-nums transition-colors",
            "hover:border-ink/60",
            "has-checked:border-ink has-checked:bg-ink has-checked:text-paper",
            "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
            "has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:line-through",
          )}
        >
          <input
            type="radio"
            name="time"
            value={s.time}
            checked={value === s.time}
            disabled={!s.available}
            onChange={() => onChange(s.time)}
            aria-label={s.available ? s.label : `${s.label}, taken`}
            aria-describedby={errorId}
            className="sr-only"
          />
          {s.label}
        </label>
      ))}
    </div>
  );
}
