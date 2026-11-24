import { track } from "@vercel/analytics";

/**
 * Custom Vercel Web Analytics events. The property types are deliberately narrow:
 * only option ids (package, shoot type, location, category) and where a tap came
 * from. Never names, notes, phone numbers or other personal data.
 */
type Events = {
  book_send: { package: string; shootType: string; location: string };
  whatsapp_chat: { source: WhatsAppSource };
  portfolio_filter: { category: string };
  photo_open: { category: string };
};

export type WhatsAppSource = "nav" | "footer" | "home" | "fab";

export function trackEvent<E extends keyof Events>(
  name: E,
  properties: Events[E],
) {
  track(name, properties);
}
