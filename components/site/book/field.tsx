import { cn } from "@/lib/utils";

/** Shared look for inputs: 16px text (no iOS zoom), 48px tall, clear border + focus. */
export const inputClass =
  "block min-h-12 w-full rounded-md border-2 border-ink/25 bg-background px-3.5 py-2.5 text-base text-foreground transition-colors hover:border-ink/50 focus-visible:border-ink focus-visible:outline-none aria-invalid:border-destructive";

/** Inline error under a field; the id is referenced by aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-semibold text-destructive">
      {message}
    </p>
  );
}

/**
 * A titled group of related controls. Uses <fieldset>/<legend> so screen readers
 * announce the question ("Pick a time") before each option.
 */
export function FieldGroup({
  id,
  legend,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  legend: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      id={id}
      aria-invalid={error ? true : undefined}
      className={cn("min-w-0", className)}
    >
      <legend className="text-base font-semibold">{legend}</legend>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
      {/* Error right under the question, so it's seen where focus lands (not below
          a long list of options) */}
      <FieldError id={`${id}-error`} message={error} />
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}
