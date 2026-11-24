"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  bookingPolicy,
  packages,
  shootLocations,
  shootTypes,
} from "@/content/site";
import {
  bookingMessage,
  emptyBooking,
  NOTE_MAX,
  validateBooking,
  type BookingErrors,
  type BookingValues,
} from "@/lib/booking";
import { bookableDays, slotsFor, todayKey } from "@/lib/schedule";
import { whatsappLink } from "@/lib/whatsapp";
import { BookingConfirmation } from "./booking-confirmation";
import { StickyBar, SummaryCard } from "./booking-summary";
import { ChoiceChips } from "./choice-chips";
import { DayPicker } from "./day-picker";
import { FieldError, FieldGroup, inputClass } from "./field";
import { PackagePicker } from "./package-picker";
import { TimeSlots } from "./time-slots";

// Field order = the order errors are focused in.
const FIELD_ORDER: (keyof BookingValues)[] = [
  "packageId",
  "date",
  "time",
  "shootType",
  "location",
  "locationDetail",
  "name",
  "note",
];

// "Today" only exists in the browser (pages are prerendered at build time), so it's
// read with useSyncExternalStore: null on the server, the real date after hydration.
const noSubscribe = () => () => {};
const useToday = () =>
  useSyncExternalStore(
    noSubscribe,
    () => todayKey(),
    () => null,
  );

/**
 * Booking flow: package -> day -> time -> details -> WhatsApp.
 * Nothing is stored or paid here; the form just writes a WhatsApp message.
 */
export function BookingForm() {
  const today = useToday();
  const days = useMemo(() => (today ? bookableDays(today) : null), [today]);

  const [values, setValues] = useState<BookingValues>(emptyBooking);
  const [submitted, setSubmitted] = useState(false); // after first attempt, validate live
  const [sent, setSent] = useState<{ url: string; message: string } | null>(
    null,
  );

  const errors: BookingErrors =
    submitted && days ? validateBooking(values, days) : {};
  const errorCount = Object.keys(errors).length;
  const slots = slotsFor(values.date || undefined);

  function set<K extends keyof BookingValues>(key: K, value: BookingValues[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      // Changing the day can make the chosen time unavailable: clear it.
      if (
        key === "date" &&
        !slotsFor(value).find((s) => s.time === v.time)?.available
      ) {
        next.time = "";
      }
      return next;
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!days) return;
    setSubmitted(true);
    const found = validateBooking(values, days);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      // Focus the first problem so keyboard and screen-reader users land on it.
      const el = document.querySelector<HTMLElement>(
        `#field-${first} input:not(:disabled), #field-${first} textarea`,
      );
      el?.focus();
      el?.closest("fieldset, div")?.scrollIntoView({ block: "center" });
      return;
    }
    const message = bookingMessage(values, days);
    const url = whatsappLink(message);
    // Opened straight from the click, so browsers treat it as a user action.
    window.open(url, "_blank", "noopener,noreferrer");
    setSent({ url, message });
  }

  if (sent) {
    return (
      <BookingConfirmation
        waUrl={sent.url}
        summary={sent.message}
        onEdit={() => setSent(null)}
      />
    );
  }

  const err = (f: keyof BookingValues) =>
    errors[f] ? `field-${f}-error` : undefined;

  return (
    <form id="booking-form" noValidate onSubmit={onSubmit} className="mt-8">
      {/* 1. Package cards */}
      <FieldGroup
        id="field-packageId"
        legend="1. Choose a package"
        error={errors.packageId}
      >
        <PackagePicker
          value={values.packageId}
          onChange={(id) => set("packageId", id)}
          errorId={err("packageId")}
        />
      </FieldGroup>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        {/* 2. The booking card */}
        <div className="space-y-8 rounded-xl border-2 border-ink/15 bg-card p-5">
          <FieldGroup
            id="field-date"
            legend="2. Pick a day"
            hint="Swipe for more days. Crossed-out days are unavailable."
            error={errors.date}
          >
            <DayPicker
              days={days}
              value={values.date}
              onChange={(d) => set("date", d)}
              errorId={err("date")}
            />
          </FieldGroup>

          <FieldGroup
            id="field-time"
            legend="3. Pick a time"
            error={errors.time}
          >
            <TimeSlots
              slots={slots}
              value={values.time}
              onChange={(t) => set("time", t)}
              errorId={err("time")}
            />
          </FieldGroup>

          <FieldGroup id="field-packageChip" legend="Package">
            {/* Mirrors the cards above, so the choice is visible while filling the card */}
            <ChoiceChips
              name="packageChip"
              value={values.packageId}
              onChange={(id) => set("packageId", id)}
              options={packages.map((p) => ({ value: p.id, label: p.name }))}
            />
          </FieldGroup>

          <FieldGroup
            id="field-shootType"
            legend="Type of shoot"
            error={errors.shootType}
          >
            <ChoiceChips
              name="shootType"
              value={values.shootType}
              onChange={(v) => set("shootType", v)}
              options={shootTypes.map((t) => ({ value: t.id, label: t.label }))}
              errorId={err("shootType")}
            />
          </FieldGroup>

          <FieldGroup
            id="field-location"
            legend="Location"
            error={errors.location}
          >
            <ChoiceChips
              name="location"
              value={values.location}
              onChange={(v) => set("location", v)}
              options={shootLocations.map((l) => ({
                value: l.id,
                label: l.label,
              }))}
              errorId={err("location")}
            />
          </FieldGroup>

          {values.location && (
            <div id="field-locationDetail">
              <label
                htmlFor="locationDetail"
                className="block text-base font-semibold"
              >
                {values.location === "other"
                  ? "Which city or venue?"
                  : "Venue or area (optional)"}
              </label>
              <input
                id="locationDetail"
                name="locationDetail"
                value={values.locationDetail}
                onChange={(e) => set("locationDetail", e.target.value)}
                aria-invalid={errors.locationDetail ? true : undefined}
                aria-describedby={err("locationDetail")}
                autoComplete="address-level2"
                maxLength={80}
                className={`${inputClass} mt-2`}
              />
              <FieldError
                id="field-locationDetail-error"
                message={errors.locationDetail}
              />
            </div>
          )}

          <div id="field-name">
            <label htmlFor="name" className="block text-base font-semibold">
              Your name
            </label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={err("name")}
              autoComplete="name"
              maxLength={60}
              className={`${inputClass} mt-2`}
            />
            <FieldError id="field-name-error" message={errors.name} />
          </div>

          <div id="field-note">
            <label htmlFor="note" className="block text-base font-semibold">
              Short note <span className="font-medium">(optional)</span>
            </label>
            <p id="note-hint" className="mt-1 text-sm">
              Anything Rufus should know: outfits, number of people, ideas.
            </p>
            <textarea
              id="note"
              name="note"
              rows={3}
              value={values.note}
              onChange={(e) => set("note", e.target.value)}
              aria-invalid={errors.note ? true : undefined}
              aria-describedby={["note-hint", err("note")]
                .filter(Boolean)
                .join(" ")}
              maxLength={NOTE_MAX}
              className={`${inputClass} mt-2 resize-y`}
            />
            <p className="mt-1 text-right text-sm tabular-nums">
              {values.note.length}/{NOTE_MAX}
            </p>
            <FieldError id="field-note-error" message={errors.note} />
          </div>

          <p className="rounded-md bg-muted p-4 text-sm font-semibold">
            {bookingPolicy.summary} {bookingPolicy.payment}
          </p>
        </div>

        {/* Desktop summary beside the form */}
        <aside aria-label="Booking summary" className="hidden h-full lg:block">
          <SummaryCard values={values} days={days} />
        </aside>
      </div>

      {/* Mobile/tablet sticky confirm bar (last child so it sticks to the form's bottom) */}
      <StickyBar values={values} days={days} errorCount={errorCount} />
    </form>
  );
}
