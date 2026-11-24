import { cn } from "@/lib/utils";

export type ChipOption = { value: string; label: string; disabled?: boolean };

/**
 * Radio buttons that look like chips. Real <input type="radio"> elements, visually
 * hidden but still focusable: arrow keys move between options natively.
 * Styling reacts with has-checked / has-focus-visible on the wrapping <label>.
 */
export function ChoiceChips({
  name,
  options,
  value,
  onChange,
  errorId,
  className,
}: {
  name: string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  errorId?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => (
        <label
          key={o.value}
          className={cn(
            "relative inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-2 border-ink/25 bg-background px-4 text-base transition-colors",
            "hover:border-ink/60",
            "has-checked:border-ink has-checked:bg-ink has-checked:text-paper",
            "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
            "has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:line-through",
          )}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            disabled={o.disabled}
            onChange={() => onChange(o.value)}
            aria-describedby={errorId}
            className="sr-only"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}
