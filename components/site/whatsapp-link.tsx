"use client";

import { trackEvent, type WhatsAppSource } from "@/lib/analytics";

/**
 * A WhatsApp link that records a "whatsapp_chat" event (with where it was tapped)
 * before opening WhatsApp. Lets server components (footer, home CTA) stay server
 * components and only ship this tiny client piece.
 */
export function WhatsAppLink({
  source,
  onClick,
  ...props
}: React.ComponentProps<"a"> & { source: WhatsAppSource }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={(e) => {
        trackEvent("whatsapp_chat", { source });
        onClick?.(e);
      }}
    />
  );
}
