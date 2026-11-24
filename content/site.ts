/**
 * SINGLE SOURCE OF TRUTH for everything editable on the site.
 * Change wording, prices, contact details and photos here; components only read from this file.
 *
 * Photos: put the original in photos-raw/, run `npm run photos`, then add an entry
 * to `photoList` below using the file name without extension (e.g. "ada-convocation").
 */

import manifest from "./photo-manifest.json";

/* ------------------------------------------------------------------ */
/* Brand + location                                                    */
/* ------------------------------------------------------------------ */

export const site = {
  name: "RufusShotThis Photography",
  shortName: "RufusShotThis",
  photographer: { fullName: "Adeyanju Temilade Adedeji", nickname: "Rufus" },
  // Wording rule: based in Ilorin, never "Lagos-based".
  location: {
    base: "Ilorin",
    line: "Based in Ilorin · Shooting in Lagos and beyond",
  },
  description:
    "Portrait, convocation, wedding, sports, event and wildlife photography. Based in Ilorin, shooting in Lagos and beyond.",
} as const;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  whatsapp: {
    display: "+234 901 2191 846",
    number: "2349012191846", // international format, no "+" or spaces (used in wa.me links)
  },
  email: "temiladeadedeji5@gmail.com",
  instagram: {
    handle: "@rufusshotthis",
    url: "https://www.instagram.com/rufusshotthis",
  },
  tiktok: {
    handle: "@rufusshotthis",
    url: "https://www.tiktok.com/@rufusshotthis",
  },
} as const;

/** Pre-filled WhatsApp messages. Keep them short and friendly. */
export const whatsappMessages = {
  general:
    "Hi Rufus, I found you on your website and I'd like to ask about a shoot.",
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/book", label: "Book" },
] as const;

/* ------------------------------------------------------------------ */
/* Categories (portfolio filter chips) + services                      */
/* ------------------------------------------------------------------ */

export const categories = [
  { id: "portraits", label: "Portraits" },
  { id: "convocation", label: "Convocation" },
  { id: "sports", label: "Sports" },
  { id: "weddings", label: "Weddings" },
  { id: "events", label: "Events" },
  { id: "wildlife", label: "Wildlife" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

/** Every kind of shoot offered. `category` links each one to a portfolio filter. */
export const services: {
  title: string;
  blurb: string;
  category: CategoryId;
}[] = [
  {
    title: "Studio portraits",
    blurb: "Clean, flattering portraits in studio light.",
    category: "portraits",
  },
  {
    title: "Convocation",
    blurb: "Your graduation day, solo or with family.",
    category: "convocation",
  },
  {
    title: "Milestone birthdays",
    blurb: "Birthday shoots that feel like you.",
    category: "events",
  },
  {
    title: "Weddings",
    blurb: "Traditional and white weddings, start to finish.",
    category: "weddings",
  },
  {
    title: "Corporate",
    blurb: "Headshots and team photos for work.",
    category: "portraits",
  },
  {
    title: "Events",
    blurb: "Parties, launches and gatherings.",
    category: "events",
  },
  { title: "Sports", blurb: "Fast action, sharp moments.", category: "sports" },
  {
    title: "Wildlife",
    blurb: "Patient shots of animals and nature.",
    category: "wildlife",
  },
];

/* ------------------------------------------------------------------ */
/* Packages + booking rules                                            */
/* ------------------------------------------------------------------ */

export type Package = {
  id: "basic" | "standard" | "premium";
  name: string;
  price: number; // Naira
  duration: string;
  outfits: number;
  editedPhotos: number;
  includes: string[];
  popular?: boolean;
};

export const packages: Package[] = [
  {
    id: "basic",
    name: "Basic",
    price: 30000,
    duration: "1 hour",
    outfits: 1,
    editedPhotos: 4,
    includes: ["Private online gallery"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 35000,
    duration: "1 hour",
    outfits: 2,
    editedPhotos: 6,
    includes: ["Private online gallery"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 40000,
    duration: "1 hour 30 minutes",
    outfits: 2,
    editedPhotos: 8,
    includes: ["Private online gallery"],
  },
];

/** Never put bank/account details here: they are sent on WhatsApp after confirmation. */
export const bookingPolicy = {
  depositPercent: 50,
  summary: "A deposit of at least 50% confirms your date.",
  payment:
    "Payment is by bank transfer. Account details are sent on WhatsApp once Rufus confirms your date.",
} as const;

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

// TODO(Rufus): replace with your own words. Keep it short; people read on phones.
export const bio = {
  heading: "Hi, I'm Rufus.",
  paragraphs: [
    "I'm Adeyanju Temilade Adedeji, the photographer behind RufusShotThis. I shoot portraits, convocations, weddings, birthdays, sports, events and wildlife.",
    "My studio is in Ilorin, and I regularly shoot in Lagos and travel wherever the story is. I keep things relaxed so you look like yourself, just at your best.",
  ],
} as const;

export const copy = {
  hero: {
    eyebrow: site.location.line,
    title: "Photos that feel like the day did.",
    intro:
      "Portraits, convocations, weddings and more, shot with care and delivered in a private online gallery.",
  },
  featured: {
    eyebrow: "Selected work",
    title: "A little of everything I shoot",
  },
  services: {
    eyebrow: "Services",
    title: "What I shoot",
    packagesNote: "Packages from",
  },
  cta: {
    title: "Got a date in mind?",
    body: "Message me on WhatsApp with your date and the kind of shoot you want. I'll confirm availability quickly.",
    primary: "Book a shoot",
    secondary: "Chat on WhatsApp",
  },
  portfolio: {
    title: "Portfolio",
    intro: "Tap a category to filter. Tap any photo to view it full screen.",
    all: "All",
  },
  footer: { rights: "All rights reserved." },
} as const;

/* ------------------------------------------------------------------ */
/* Photos                                                              */
/* ------------------------------------------------------------------ */

type PhotoEntry = {
  file: keyof typeof manifest; // name from photos-raw/ (after `npm run photos`)
  title: string;
  alt: string; // describe what's in the photo for screen readers
  category: CategoryId;
  featured?: boolean; // featured photos appear in the home page hero (first 6)
};

// TODO: replace placeholder-* entries with real photos.
const photoList: PhotoEntry[] = [
  {
    file: "placeholder-01",
    title: "Studio portrait",
    alt: "Placeholder for a studio portrait",
    category: "portraits",
    featured: true,
  },
  {
    file: "placeholder-02",
    title: "Class of 2026",
    alt: "Placeholder for a convocation photo",
    category: "convocation",
    featured: true,
  },
  {
    file: "placeholder-03",
    title: "The first look",
    alt: "Placeholder for a wedding photo",
    category: "weddings",
    featured: true,
  },
  {
    file: "placeholder-04",
    title: "Match day",
    alt: "Placeholder for a sports photo",
    category: "sports",
    featured: true,
  },
  {
    file: "placeholder-05",
    title: "Thirty and thriving",
    alt: "Placeholder for a milestone birthday photo",
    category: "events",
    featured: true,
  },
  {
    file: "placeholder-06",
    title: "Golden hour",
    alt: "Placeholder for a wildlife photo",
    category: "wildlife",
    featured: true,
  },
  {
    file: "placeholder-07",
    title: "Window light",
    alt: "Placeholder for a portrait",
    category: "portraits",
  },
  {
    file: "placeholder-08",
    title: "Owambe colours",
    alt: "Placeholder for a traditional wedding photo",
    category: "weddings",
  },
  {
    file: "placeholder-09",
    title: "Caps in the air",
    alt: "Placeholder for a convocation group photo",
    category: "convocation",
  },
  {
    file: "placeholder-10",
    title: "Company dinner",
    alt: "Placeholder for a corporate event photo",
    category: "events",
  },
  {
    file: "placeholder-11",
    title: "Final whistle",
    alt: "Placeholder for a sports photo",
    category: "sports",
  },
  {
    file: "placeholder-12",
    title: "Still waters",
    alt: "Placeholder for a wildlife photo",
    category: "wildlife",
  },
];

export type Photo = PhotoEntry & {
  src: string; // base path; lib/image-loader.ts adds "-<width>.webp"
  width: number;
  height: number;
  blurDataURL: string;
};

/** Photos with size + blur placeholder merged in from the generated manifest. */
export const photos: Photo[] = photoList.map((p) => ({
  ...p,
  src: `/photos/${p.file}`,
  ...manifest[p.file],
}));

export const featuredPhotos = photos.filter((p) => p.featured).slice(0, 6);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

export const categoryLabel = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.label ?? id;
