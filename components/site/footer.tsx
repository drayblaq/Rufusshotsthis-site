import Link from "next/link";
import { cacheLife } from "next/cache";
import { copy, nav, site } from "@/content/site";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";

/** Dark band footer: the original white logo sits on near-black, as designed. */
export function Footer() {
  return (
    <footer className="bg-band text-band-foreground">
      {/* extra bottom padding so the floating WhatsApp button never covers links */}
      <div className="mx-auto grid max-w-site gap-10 px-gutter pt-14 pb-28 md:grid-cols-[1.2fr_1fr_1fr] md:pb-16">
        <div>
          <Logo tone="light" className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm opacity-75">
            {site.location.line}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-3 text-xs tracking-[0.2em] uppercase opacity-60">
            Pages
          </p>
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm opacity-85 hover:opacity-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-xs tracking-[0.2em] uppercase opacity-60">
            Contact
          </p>
          <SocialLinks className="space-y-1" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-site px-gutter py-5 text-xs opacity-60">
          © <CopyrightYear /> {site.name}. {copy.footer.rights}
        </p>
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
