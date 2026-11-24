import { Mail } from "lucide-react";
import { contact } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "./icons";
import { WhatsAppLink } from "./whatsapp-link";
import type { WhatsAppSource } from "@/lib/analytics";

/** Contact/social links as a list. Used in the footer; reusable on the Book page. */
export function SocialLinks({
  className,
  source = "footer",
}: {
  className?: string;
  source?: WhatsAppSource; // reported with the whatsapp_chat event
}) {
  const items = [
    {
      href: whatsappLink(),
      label: `WhatsApp ${contact.whatsapp.display}`,
      Icon: WhatsAppIcon,
      whatsapp: true,
    },
    {
      href: contact.instagram.url,
      label: `Instagram ${contact.instagram.handle}`,
      Icon: InstagramIcon,
    },
    {
      href: contact.tiktok.url,
      label: `TikTok ${contact.tiktok.handle}`,
      Icon: TikTokIcon,
    },
    { href: `mailto:${contact.email}`, label: contact.email, Icon: Mail },
  ];
  return (
    <ul className={className}>
      {items.map(({ href, label, Icon, whatsapp }) => {
        const cls =
          "inline-flex min-h-11 items-center gap-3 text-base hover:underline";
        const content = (
          <>
            <Icon className="size-5 shrink-0" />
            <span className="break-all">{label}</span>
          </>
        );
        return (
          <li key={href}>
            {whatsapp ? (
              <WhatsAppLink href={href} source={source} className={cls}>
                {content}
              </WhatsAppLink>
            ) : (
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={cls}
              >
                {content}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
