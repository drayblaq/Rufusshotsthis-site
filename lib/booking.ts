import { z } from "zod";
import {
  bookingCopy,
  formatNaira,
  packages,
  schedule,
  shootLocations,
  shootTypes,
} from "@/content/site";
import type { BookableDay } from "./schedule";
import { slotsFor, timeLabel } from "./schedule";

/** Values the booking form collects. Empty string = not chosen yet. */
export type BookingValues = {
  packageId: string;
  date: string;
  time: string;
  shootType: string;
  location: string;
  locationDetail: string;
  name: string;
  note: string;
};

export const emptyBooking: BookingValues = {
  packageId: "",
  date: "",
  time: "",
  shootType: "",
  location: "",
  locationDetail: "",
  name: "",
  note: "",
};

export const NOTE_MAX = 300;

const ids = <T extends readonly { id: string }[]>(list: T) =>
  list.map((x) => x.id) as [T[number]["id"], ...T[number]["id"][]];

/**
 * Zod schema. Built per render from the days currently on screen, so a day
 * Rufus has blocked (or one that's no longer in range) can't be submitted.
 * Messages are written for people, not developers.
 */
export function bookingSchema(days: BookableDay[]) {
  const open = new Set(days.filter((d) => d.available).map((d) => d.key));
  return z
    .object({
      packageId: z.enum(ids(packages), { error: "Choose a package." }),
      date: z
        .string()
        .refine((d) => open.has(d), { error: "Pick an available day." }),
      time: z.enum(schedule.timeSlots as [string, ...string[]], {
        error: "Pick a time.",
      }),
      shootType: z.enum(ids(shootTypes), {
        error: "Choose the type of shoot.",
      }),
      location: z.enum(ids(shootLocations), {
        error: "Choose where the shoot is.",
      }),
      locationDetail: z
        .string()
        .trim()
        .max(80, { error: "Keep this under 80 characters." }),
      name: z
        .string()
        .trim()
        .min(2, { error: "Enter your name (at least 2 letters)." })
        .max(60, { error: "Keep your name under 60 characters." }),
      note: z
        .string()
        .trim()
        .max(NOTE_MAX, {
          error: `Keep the note under ${NOTE_MAX} characters.`,
        }),
    })
    .superRefine((v, ctx) => {
      if (v.location === "other" && v.locationDetail.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["locationDetail"],
          message: "Tell Rufus the city or venue.",
        });
      }
      const slot = slotsFor(v.date).find((s) => s.time === v.time);
      if (slot && !slot.available) {
        ctx.addIssue({
          code: "custom",
          path: ["time"],
          message: "That time is taken. Pick another.",
        });
      }
    });
}

export type BookingErrors = Partial<Record<keyof BookingValues, string>>;

/** Runs the schema and returns the first message per field (empty object = valid). */
export function validateBooking(
  values: BookingValues,
  days: BookableDay[],
): BookingErrors {
  const result = bookingSchema(days).safeParse(values);
  if (result.success) return {};
  const errors: BookingErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof BookingValues;
    errors[field] ??= issue.message;
  }
  return errors;
}

const labelOf = (list: readonly { id: string; label: string }[], id: string) =>
  list.find((x) => x.id === id)?.label ?? id;

/** The pre-filled WhatsApp message. Plain text, one detail per line. */
export function bookingMessage(v: BookingValues, days: BookableDay[]): string {
  const pkg = packages.find((p) => p.id === v.packageId);
  const day = days.find((d) => d.key === v.date);
  const where =
    v.location === "other"
      ? v.locationDetail.trim()
      : [labelOf(shootLocations, v.location), v.locationDetail.trim()]
          .filter(Boolean)
          .join(", ");
  const lines = [
    "Hi Rufus, I'd like to book a shoot.",
    "",
    `Name: ${v.name.trim()}`,
    pkg
      ? `Package: ${pkg.name}, ${formatNaira(pkg.price)} (${pkg.duration}, ${pkg.outfits} outfit${pkg.outfits > 1 ? "s" : ""}, ${pkg.editedPhotos} edited pictures)`
      : null,
    `Shoot type: ${labelOf(shootTypes, v.shootType)}`,
    `Date: ${day?.label ?? v.date}`,
    `Time: ${timeLabel(v.time)}`,
    `Location: ${where}`,
    v.note.trim() ? `Note: ${v.note.trim()}` : null,
    "",
    `${bookingCopy.depositLine}.`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
