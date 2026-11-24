import { contact, whatsappMessages } from "@/content/site";

/** Builds a wa.me link that opens WhatsApp with the message already typed. */
export function whatsappLink(
  message: string = whatsappMessages.general,
): string {
  return `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
