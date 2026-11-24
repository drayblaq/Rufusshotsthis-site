import { About } from "@/components/site/home/about";
import { BookingCta } from "@/components/site/home/booking-cta";
import { FeaturedWork } from "@/components/site/home/featured-work";
import { Hero } from "@/components/site/home/hero";
import { Services } from "@/components/site/home/services";
import { featuredPhotos } from "@/content/site";

/** Home: hero -> featured work -> about -> services -> booking call to action. */
export default function HomePage() {
  return (
    <>
      <Hero photos={featuredPhotos} />
      <FeaturedWork />
      <About />
      <Services />
      <BookingCta />
    </>
  );
}
