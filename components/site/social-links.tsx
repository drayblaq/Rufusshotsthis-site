import { Mail } from "lucide-react";
import { contact } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "./icons";

/** Contact/social links as a list. Used in the footer; reusable on the Book page. */
export function SocialLinks({ className }: { className?: string }) {
  const items = [
    {
      href: whatsappLink(),
      label: `WhatsApp ${contact.whatsapp.display}`,
      Icon: WhatsAppIcon,
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
      {items.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-3 text-sm opacity-85 transition-opacity hover:opacity-100"
          >
            <Icon className="size-5 shrink-0" />
            <span className="break-all">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
