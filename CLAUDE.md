# CLAUDE.md — RufusShotThis Photography

Project brief and working rules for this repo. Read this before making changes.

## Project

Portfolio + booking website for **RufusShotThis Photography**.

- **Photographer:** Adeyanju Temilade
  geria. Available to travel.
- **Shoots:** studio portraits, convocation, sports, milestone birthdays, weddings, corporate, events, wildlife.
- **Goal:** show his work and get people to book him.
- **Pages (3):** Home, Portfolio, Book.

## Users

- Mostly on mobile, often on slow data.
- Build **mobile-first**. Keep it **fast** and keep **images small** (responsive sizes, modern formats, lazy loading).

## Style

- Bright, clean, simple, neat. Minimal colour.
- Subtle motion only. Always respect `prefers-reduced-motion`.
- The logo is white script on black, so a **dark version of the logo** is needed for the light site.

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

## Working rules

- Keep **all editable content** (packages, contact, copy, photo list) in **one place**: `/content` or `/lib/site.ts`. Components read from there; no hard-coded business content in components.
- Small, clean, commented components.
- Explain choices briefly as you go.
