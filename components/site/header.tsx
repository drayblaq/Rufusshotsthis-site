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
    <header className="sticky top-0 z-40 border-b bg-background/95">
      <div className="mx-auto flex h-header max-w-site items-center justify-between gap-4 px-gutter">
        <Link
          href="/"
          aria-label="RufusShotThis Photography, home"
          className="shrink-0"
        >
          <Logo className="h-10 w-auto md:h-12" />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-5 sm:gap-7">
          {links.map((item) => (
            <span
              key={item.href}
              className={item.href === "/" ? "hidden sm:inline" : undefined}
            >
              <NavLink href={item.href}>{item.label}</NavLink>
            </span>
          ))}
          <Link
            href="/book"
            className={cn(buttonVariants({ size: "cta" }), "h-10 px-4")}
          >
            Book
          </Link>
        </nav>
      </div>
    </header>
  );
}
