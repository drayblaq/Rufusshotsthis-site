import type { Metadata } from "next";

export const metadata: Metadata = { title: "Book" };

// Book page shell. Packages + booking flow come next (content from content/site.ts).
export default function BookPage() {
  return (
    <section className="mx-auto max-w-site px-gutter py-section">
      <h1 className="text-4xl">Book</h1>
    </section>
  );
}
