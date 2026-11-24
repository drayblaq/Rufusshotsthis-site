import { schedule } from "@/content/site";

/**
 * Turns the schedule config in content/site.ts into day chips and time slots.
 * All dates are calendar days in Nigerian time (Africa/Lagos), keyed "YYYY-MM-DD",
 * so a visitor abroad sees the same days Rufus does.
 */

export type BookableDay = {
  key: string; // "2026-11-29"
  weekday: string; // "Sat"
  day: string; // "29"
  month: string; // "Nov"
  label: string; // "Saturday, 29 November 2026"
  available: boolean;
};

export type TimeSlot = { time: string; label: string; available: boolean };

/** Today's date in Nigeria as "YYYY-MM-DD". */
export function todayKey(now: Date = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: schedule.timeZone,
  }).format(now);
}

// Calendar maths in UTC so daylight-saving or the visitor's own zone never shifts a day.
const fromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const toKey = (date: Date) => date.toISOString().slice(0, 10);
const fmt = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options }).format(
    date,
  );

/** Days shown in the picker, starting after the minimum notice period. */
export function bookableDays(today: string): BookableDay[] {
  const start = fromKey(today);
  return Array.from({ length: schedule.daysAhead }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + schedule.minNoticeDays + i);
    const key = toKey(date);
    const allSlotsTaken = schedule.timeSlots.every((t) =>
      schedule.unavailableSlots[key]?.includes(t),
    );
    return {
      key,
      weekday: fmt(date, { weekday: "short" }),
      day: fmt(date, { day: "numeric" }),
      month: fmt(date, { month: "short" }),
      label: fmt(date, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      available:
        !schedule.closedWeekdays.includes(date.getUTCDay()) &&
        !schedule.unavailableDates.includes(key) &&
        !allSlotsTaken,
    };
  });
}

/** "13:00" -> "1:00 pm" */
export function timeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Time slots for a given day (all slots, with booked ones marked unavailable). */
export function slotsFor(dayKey: string | undefined): TimeSlot[] {
  const taken = dayKey ? (schedule.unavailableSlots[dayKey] ?? []) : [];
  return schedule.timeSlots.map((time) => ({
    time,
    label: timeLabel(time),
    available: !taken.includes(time),
  }));
}
