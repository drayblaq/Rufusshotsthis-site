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
  chat: "Hi Rufus! I have a quick question about a shoot.",
} as const;

/** Labels for the mobile bottom navigation bar. */
export const mobileNavLabels = {
  home: "Home",
  portfolio: "Portfolio",
  book: "Book",
  prices: "Prices",
  chat: "Chat",
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
/* Booking form: options, schedule, copy                               */
/* ------------------------------------------------------------------ */

/** Shoot types offered in the booking form. */
export const shootTypes = [
  { id: "portraits", label: "Portraits" },
  { id: "convocation", label: "Convocation" },
  { id: "sports", label: "Sports" },
  { id: "birthday", label: "Birthday" },
  { id: "wedding", label: "Wedding" },
  { id: "corporate", label: "Corporate" },
  { id: "event", label: "Event" },
  { id: "wildlife", label: "Wildlife" },
] as const;

export const shootLocations = [
  { id: "ilorin", label: "Ilorin" },
  { id: "lagos", label: "Lagos" },
  { id: "other", label: "Other" },
] as const;

/**
 * Availability. Rufus edits this to block days or times.
 * Dates are "YYYY-MM-DD" in Nigerian time (Africa/Lagos).
 */
export const schedule = {
  timeZone: "Africa/Lagos",
  daysAhead: 28, // how many days to show in the day picker
  minNoticeDays: 1, // 1 = earliest booking is tomorrow
  timeSlots: ["09:00", "11:00", "13:00", "15:00", "17:00"], // 24h, shown as "9:00 am"
  closedWeekdays: [] as number[], // 0 = Sunday ... 6 = Saturday, e.g. [0] to never work Sundays
  unavailableDates: ["2026-12-25", "2026-12-26", "2027-01-01"] as string[], // whole day off/booked
  unavailableSlots: {
    // already-booked times on a given day, e.g. "2026-11-29": ["09:00", "11:00"]
  } as Record<string, string[]>,
};

export const bookingCopy = {
  title: "Book a shoot",
  intro:
    "Choose a package, pick a day and time, and send your request on WhatsApp. Rufus will confirm availability.",
  depositLine: `I understand a ${bookingPolicy.depositPercent}% deposit confirms the date`,
  confirm: "Confirm on WhatsApp",
  nextSteps: [
    "Rufus confirms availability with you on WhatsApp.",
    "He sends the bank transfer details there.",
    `Your date is confirmed once the ${bookingPolicy.depositPercent}% deposit is paid.`,
  ],
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

// Order here = order on the Portfolio page. `featured: true` = Home hero (first 6, in order;
// the first one loads first, so make it a strong, eye-catching shot).
const photoList: PhotoEntry[] = [
  // --- Featured (Home hero) ---
  {
    file: "convocation-cap",
    title: "Class of 2026",
    alt: "Graduate in a mortarboard and University of Ilorin stole, smiling against a deep red backdrop",
    category: "convocation",
    featured: true,
  },
  {
    file: "sports-sky-ball",
    title: "Spirit of the game",
    alt: "Woman in a green and white jersey balancing a football on her shoulder against a bright blue sky",
    category: "sports",
    featured: true,
  },
  {
    file: "birthday-crown",
    title: "Birthday crown",
    alt: "Smiling young woman in purple being crowned with a silver tiara on her birthday",
    category: "events",
    featured: true,
  },
  {
    file: "portrait-studio-smile",
    title: "Studio portrait",
    alt: "Woman with long curls smiling warmly in a dark studio portrait",
    category: "portraits",
    featured: true,
  },
  {
    file: "sports-polo-horse",
    title: "Polo at the horse club",
    alt: "Rider in a green cap on a rearing brown horse at a polo field",
    category: "sports",
    featured: true,
  },
  {
    file: "portrait-brothers-mono",
    title: "Brotherhood",
    alt: "Black and white portrait of two men in sharp traditional outfits, one standing and one seated",
    category: "portraits",
    featured: true,
  },

  // --- Convocation ---
  {
    file: "convocation-red-chair",
    title: "Scroll in hand",
    alt: "Graduate in a black dress and cap seated on a leather chair, holding up her scroll against a red backdrop",
    category: "convocation",
  },
  {
    file: "convocation-joy",
    title: "Pure joy",
    alt: "Laughing graduate in a red hijab and mint suit holding a University of Ilorin scroll",
    category: "convocation",
  },
  {
    file: "convocation-friends",
    title: "Graduating together",
    alt: "Four graduates posing together on a red backdrop with scrolls and caps",
    category: "convocation",
  },
  {
    file: "convocation-engineer",
    title: "Newly inducted engineer",
    alt: "Young engineer in a brown waistcoat and stole holding a white safety helmet",
    category: "convocation",
  },
  {
    file: "convocation-stole",
    title: "Poise",
    alt: "Graduate with an updo wearing a University of Ilorin stole, arms folded, against a pale blue backdrop",
    category: "convocation",
  },
  {
    file: "convocation-gown",
    title: "Cap in hand",
    alt: "Graduate in a navy University of Ilorin gown looking down, cap in hand",
    category: "convocation",
  },
  {
    file: "convocation-suit",
    title: "Bachelor of Arts",
    alt: "Young man in a black suit and red tie with arms folded, studio portrait",
    category: "convocation",
  },
  {
    file: "convocation-red-scroll",
    title: "Signed and sealed",
    alt: "Graduate seated on a red backdrop, smiling and holding her scroll",
    category: "convocation",
  },

  // --- Birthdays (Events) ---
  {
    file: "birthday-lilac-gown",
    title: "Lilac dream",
    alt: "Young woman in a full lilac lace gown and tiara looking back over her shoulder",
    category: "events",
  },
  {
    file: "birthday-horse",
    title: "Birthday with a friend",
    alt: "Man in white resting his forehead against a grey horse's head",
    category: "events",
  },
  {
    file: "birthday-white-shirt",
    title: "Birthday in white",
    alt: "Woman in sunglasses, white shirt and jeans posing in the studio",
    category: "events",
  },
  {
    file: "birthday-lilac-smile",
    title: "Quiet joy",
    alt: "Young woman in a lilac lace top, eyes closed, chin resting on her hands",
    category: "events",
  },
  {
    file: "birthday-shades",
    title: "Golden hour glow",
    alt: "Woman lowering her sunglasses in warm studio light",
    category: "events",
  },

  // --- Sports ---
  {
    file: "sports-jersey-team",
    title: "Jersey unveiling",
    alt: "Group of young people in new blue OVS football jerseys, one holding a ball",
    category: "sports",
  },
  {
    file: "sports-jersey-duo",
    title: "Game day",
    alt: "Two people in blue OVS jerseys on an outdoor court, one with a foot on a football",
    category: "sports",
  },
  {
    file: "sports-ball-portrait",
    title: "Eye on the ball",
    alt: "Woman with an afro holding a worn football over half her face",
    category: "sports",
  },

  // --- Portraits ---
  {
    file: "portrait-locs-outdoor",
    title: "Natural light",
    alt: "Woman with long locs smiling over her shoulder outdoors",
    category: "portraits",
  },
  {
    file: "portrait-locs-mono",
    title: "In the details",
    alt: "Black and white close-up of a woman's face framed by locs and her hand",
    category: "portraits",
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
