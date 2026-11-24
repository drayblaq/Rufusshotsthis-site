import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

/**
 * Sticky header. With only three pages, everything fits on a 360px phone
 * (logo = Home, "Portfolio" link, "Book" button), so there's no hamburger menu:
 * one less tap and no menu JavaScript.
 * Solid background instead of backdrop-blur: blur is expensive on low-end phones.
 */
export function Header() {
  const links = nav.filter((item) => item.href !== "/book"); // Book is the button
  return (
    <header className="sticky top-0 z-40 border-b bg-background pt-[env(safe-area-inset-top)]">
      <div className="container-site flex min-h-header flex-wrap items-center justify-between gap-x-4">
        <Link
          href="/"
          aria-label="RufusShotThis Photography, home"
          className="inline-flex min-h-11 shrink-0 items-center"
        >
          <Logo className="h-10 w-auto md:h-12" />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-3 sm:gap-5">
          {links.map((item) => (
            <span
              key={item.href}
              // data-dup-nav: hidden on phones where the bottom nav already has these links
              data-dup-nav
              className={item.href === "/" ? "hidden sm:inline" : undefined}
            >
              <NavLink href={item.href}>{item.label}</NavLink>
            </span>
          ))}
          <Link
            href="/book"
            className={cn(buttonVariants({ size: "cta" }), "px-4")}
          >
            Book
          </Link>
        </nav>
      </div>
    </header>
  );
}
