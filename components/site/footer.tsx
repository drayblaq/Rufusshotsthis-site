import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail } from "lucide-react";
import { copy, credits, nav, site } from "@/content/site";
import { WhatsAppIcon } from "./icons";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";

/** Dark band footer: the original white logo sits on near-black, as designed. */
export function Footer() {
  return (
    <footer className="bg-band text-band-foreground">
      <div className="container-site grid gap-[clamp(2rem,5vw,2.5rem)] py-[clamp(2.5rem,7vw,4rem)] md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo tone="light" className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-base">{site.location.line}</p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
            Pages
          </p>
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 min-w-11 items-center text-base hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
            Contact
          </p>
          <SocialLinks className="space-y-1" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-x-6 gap-y-1 py-4 text-sm md:flex-row md:items-center md:justify-between md:pr-16">
          <p className="py-2">
            © <CopyrightYear /> {site.name}. {copy.footer.rights}
          </p>
          {/* md:pr-16 keeps the credit links clear of the floating WhatsApp button */}
          <Credit />
        </div>
      </div>
    </footer>
  );
}

/**
 * With Cache Components, reading the clock during prerender is not allowed.
 * "use cache" computes the year once and refreshes it daily, so pages stay static.
 */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/**
 * Developer credit with contact links. Plain links (not tracked): these contact
 * the site's developer, not Rufus, so they stay out of the booking analytics.
 */
function Credit() {
  const link = "inline-flex min-h-11 items-center gap-2 hover:underline";
  const wa = `https://wa.me/${credits.whatsapp.number}?text=${encodeURIComponent(credits.whatsapp.message)}`;
  return (
    <p className="flex flex-wrap items-center gap-x-5">
      <span className="py-2">
        {credits.label} <strong className="font-bold">{credits.name}</strong>
      </span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={link}>
        <WhatsAppIcon className="size-4 shrink-0" />
        <span>
          <span className="sr-only">{credits.name} on WhatsApp </span>
          {credits.whatsapp.display}
        </span>
      </a>
      <a href={`mailto:${credits.email}`} className={`${link} break-all`}>
        <Mail className="size-4 shrink-0" aria-hidden />
        <span>
          <span className="sr-only">Email {credits.name} </span>
          {credits.email}
        </span>
      </a>
    </p>
  );
}
