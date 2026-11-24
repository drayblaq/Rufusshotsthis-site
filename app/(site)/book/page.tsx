import type { Metadata } from "next";
import { BookingForm } from "@/components/site/book/booking-form";
import { bookingCopy, bookingPolicy, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Book",
  description: `Book a photoshoot with ${site.shortName}. ${bookingPolicy.summary}`,
};

/** Book: intro + booking rules, then the interactive form (client component). */
export default function BookPage() {
  return (
    <section className="container-site pt-10 pb-section">
      <p className="eyebrow">{site.location.line}</p>
      <h1 className="mt-2 text-h1">{bookingCopy.title}</h1>
      <p className="mt-3 max-w-xl text-base">{bookingCopy.intro}</p>
      <BookingForm />
    </section>
  );
}
