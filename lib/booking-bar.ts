/**
 * Tiny shared store between the Book form and the mobile bottom nav (which lives in
 * the layout, outside the form). The form publishes; the nav subscribes via
 * useSyncExternalStore. No context provider or library needed.
 */

export type BookingBarState = {
  active: boolean; // the booking form is on screen (not the confirmation)
  complete: boolean; // every required field is valid
  summary: string; // "Standard · Sat 29 Nov · 11:00 am" ("" when nothing chosen)
  errorCount: number; // shown after a submit attempt
};

const inactive: BookingBarState = {
  active: false,
  complete: false,
  summary: "",
  errorCount: 0,
};
let state = inactive;
const listeners = new Set<() => void>();

export function setBookingBar(next: BookingBarState) {
  if (
    next.active === state.active &&
    next.complete === state.complete &&
    next.summary === state.summary &&
    next.errorCount === state.errorCount
  )
    return;
  state = next;
  listeners.forEach((l) => l());
}

export const clearBookingBar = () => setBookingBar(inactive);

export function subscribeBookingBar(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getBookingBar = () => state;
export const getServerBookingBar = () => inactive;
