import { CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { bookingCopy, bookingPolicy } from "@/content/site";
import { WhatsAppIcon } from "../icons";

/** Shown after the WhatsApp message is opened: what happens next. */
export function BookingConfirmation({
  waUrl,
  summary,
  onEdit,
}: {
  waUrl: string;
  summary: string;
  onEdit: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Move focus here so screen readers announce the new state.
  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div
      data-hide-fab
      className="rounded-xl border-2 border-ink bg-card p-5 sm:p-8"
    >
      <CircleCheck className="size-10 text-highlight" aria-hidden />
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-h2 outline-none">
        Almost done: send the message on WhatsApp
      </h2>
      <p className="mt-2 text-base">
        Your booking request is ready in WhatsApp. Press send so Rufus receives
        it.
      </p>

      <pre className="mt-5 overflow-x-auto rounded-md bg-muted p-4 font-sans text-sm leading-relaxed font-medium whitespace-pre-wrap">
        {summary}
      </pre>

      <h3 className="mt-6 text-h3">What happens next</h3>
      <ol className="mt-3 space-y-3">
        {bookingCopy.nextSteps.map((step, i) => (
          <li key={step} className="flex gap-3 text-base">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm font-semibold">{bookingPolicy.payment}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-base font-semibold text-paper"
        >
          <WhatsAppIcon className="size-5" /> WhatsApp didn&apos;t open? Tap
          here
        </a>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-12 items-center rounded-full border-2 border-ink px-5 text-base font-semibold"
        >
          Change details
        </button>
      </div>
    </div>
  );
}
