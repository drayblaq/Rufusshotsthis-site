"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Header link that marks itself as the current page (visually + for screen readers). */
export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative py-2 text-sm transition-colors duration-(--duration-fast) hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
        // thin underline on the active page
        "after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:bg-current after:opacity-0",
        active && "after:opacity-100",
      )}
    >
      {children}
    </Link>
  );
}
