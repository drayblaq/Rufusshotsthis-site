# CLAUDE.md — RufusShotThis Photography

Project brief and working rules for this repo. Read this before making changes.

## Project

Portfolio + booking website for **RufusShotThis Photography**.

- **Photographer:** Adeyanju Temilade Adedeji ("Rufus")
- **Shoots:** studio portraits, convocation, sports, milestone birthdays, weddings, corporate, events, wildlife.
- **Goal:** show his work and get people to book him.
- **Pages (3):** Home, Portfolio, Book.

## Location

- His office (base) is in **Ilorin, Nigeria**. He also shoots in **Lagos** and is available to travel.
- He can be in Lagos and still take shoots in Ilorin.
- Site wording: **"Based in Ilorin · Shooting in Lagos and beyond"**. Never describe him as "Lagos-based".

## Users

- Mostly on mobile, often on slow data.
- Build **mobile-first**. Keep it **fast** and keep **images small** (responsive sizes, modern formats, lazy loading).

## Style

- Bright, clean, simple, neat. Minimal colour.
- Subtle motion only. Always respect `prefers-reduced-motion`.

## Stack

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS + shadcn/ui.
- Deployed on Vercel.
- **v1: no database, no auth, no payment gateway.**
- Bookings open a **pre-filled WhatsApp message**.

## Packages (Naira)

| Package  | Price | Duration | Outfits | Edited pictures | Gallery                |
| -------- | ----- | -------- | ------- | --------------- | ---------------------- |
| Basic    | ₦30k  | 1h       | 1       | 4               | Private online gallery |
| Standard | ₦35k  | 1h       | 2       | 6               | Private online gallery |
| Premium  | ₦40k  | 1h30     | 2       | 8               | Private online gallery |

## Booking rules

- A deposit of **at least 50%** confirms the date.
- Clients pay by **bank transfer**.
- Account details are sent on WhatsApp **after he confirms**. **Never show bank/account details on the site.**

## Contact

- WhatsApp: +234 901 2191 846
- Email: temiladeadedeji5@gmail.com
- Instagram: @rufusshotthis
- TikTok: @rufusshotthis

## Brand assets

- `public/brand/logo-black-bg.png`: white script on a black square. Source for the favicon and social preview image.
- `public/brand/logo-white.png`: white script, transparent background. Use on dark bands/overlays.
- `public/brand/logo-dark.png`: near-black version generated from `logo-white.png` for the light site (header).
- Regenerate derived assets with `npm run logos` (`scripts/make-logos.mjs`).

## Working rules

- Keep **all editable content** (packages, contact, copy, location wording, photo list) in **one place**: `/content` or `/lib/site.ts`. Components read from there; no hard-coded business content in components.
- Small, clean, commented components.
- Explain choices briefly as you go.
