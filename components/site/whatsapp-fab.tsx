import { contact } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

/**
 * Floating WhatsApp button, always within thumb reach.
 * Ink-black rather than WhatsApp green to respect the minimal palette;
 * the glyph alone is instantly recognisable.
 * env(safe-area-inset-bottom) keeps it clear of the iPhone home bar.
 */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp (${contact.whatsapp.display})`}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 grid size-14 place-items-center rounded-full bg-ink text-paper shadow-lg ring-1 ring-white/15 transition-transform duration-(--duration-fast) hover:scale-105 active:scale-95 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
