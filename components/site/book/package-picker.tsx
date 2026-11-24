import { Check } from "lucide-react";
import { formatNaira, packages } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The three package cards as one radio group.
 * Layout uses container queries: cards stack in a narrow container and sit
 * three across once the container itself is wide enough (not the viewport).
 */
export function PackagePicker({
  value,
  onChange,
  errorId,
}: {
  value: string;
  onChange: (id: string) => void;
  errorId?: string;
}) {
  return (
    <div className="@container">
      <div className="grid gap-fluid @3xl:grid-cols-3">
        {packages.map((p) => {
          const selected = value === p.id;
          return (
            <label
              key={p.id}
              className={cn(
                "group @container relative flex cursor-pointer flex-col rounded-xl border-2 bg-card p-5 transition-[border-color,box-shadow]",
                "border-ink/20 hover:border-ink/50",
                "has-checked:border-ink has-checked:shadow-[0_0_0_2px_var(--ink)]",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ink",
              )}
            >
              <input
                type="radio"
                name="packageId"
                value={p.id}
                checked={selected}
                onChange={() => onChange(p.id)}
                aria-describedby={errorId}
                className="sr-only"
              />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">
                    {p.name}
                    {p.popular && (
                      <span className="ml-2 align-middle text-xs font-semibold tracking-[0.15em] text-highlight uppercase">
                        Popular
                      </span>
                    )}
                  </p>
                  <p className="mt-1 font-display text-[2.5rem] leading-none font-semibold">
                    {formatNaira(p.price)}
                  </p>
                </div>
                {/* Visible selected state: filled check vs empty ring */}
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink/40 text-paper transition-colors group-has-checked:border-ink group-has-checked:bg-ink"
                >
                  <Check
                    className="size-4 opacity-0 group-has-checked:opacity-100"
                    strokeWidth={3}
                  />
                </span>
              </div>

              {/* Features: one column in a narrow card, two once the card is wide */}
              <ul className="mt-4 grid gap-2 text-base @[24rem]:grid-cols-2">
                {[
                  p.duration,
                  `${p.outfits} outfit${p.outfits > 1 ? "s" : ""}`,
                  `${p.editedPhotos} edited pictures`,
                  ...p.includes,
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check
                      className="size-4 shrink-0 text-highlight"
                      strokeWidth={3}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold group-has-checked:underline">
                {selected ? "Selected" : "Tap to choose"}
              </p>
            </label>
          );
        })}
      </div>
    </div>
  );
}
