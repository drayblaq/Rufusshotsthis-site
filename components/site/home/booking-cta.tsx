import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { bookingPolicy, copy } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../icons";

/** Closing call to action, right before the footer. */
export function BookingCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-secondary">
      <div className="container-site max-w-2xl py-section text-center">
        <h2 id="cta-title" className="text-h1">
          {copy.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          {copy.cta.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/book" className={buttonVariants({ size: "cta" })}>
            {copy.cta.primary}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "cta", variant: "outline" })}
          >
            <WhatsAppIcon /> {copy.cta.secondary}
          </a>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          {bookingPolicy.summary}
        </p>
      </div>
    </section>
  );
}
