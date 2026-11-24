# RufusShotThis Photography

Portfolio and booking site for RufusShotThis Photography. Based in Ilorin, shooting in Lagos and beyond.
Next.js (App Router) + TypeScript + Tailwind + shadcn/ui. No database, no payments: bookings open a pre-filled WhatsApp message.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Editing the site

Everything editable (contact details, packages, prices, copy, availability, photo list) lives in **`content/site.ts`**.

### Adding photos

1. Put the original photo in `photos-raw/` (this folder is not uploaded to GitHub).
2. Run `npm run photos`. It creates small WebP versions in `public/photos/` and updates `content/photo-manifest.json`.
3. Add an entry to `photoList` in `content/site.ts` with the file name (without extension), a title, alt text and category.

### Blocking days or times

Edit `schedule` in `content/site.ts`: `unavailableDates`, `unavailableSlots` and `closedWeekdays`.

## Scripts

| Script                    | What it does                                                    |
| ------------------------- | --------------------------------------------------------------- |
| `npm run dev`             | Development server                                              |
| `npm run build` / `start` | Production build / serve it                                     |
| `npm run lint`            | ESLint                                                          |
| `npm run typecheck`       | TypeScript (strict)                                             |
| `npm run format`          | Prettier                                                        |
| `npm run photos`          | Optimise photos from `photos-raw/`                              |
| `npm run logos`           | Regenerate logos, favicon and social image from `public/brand/` |
| `npm run test:responsive` | Build + Playwright responsive audit (uses installed Chrome)     |

## Deploy (Vercel)

1. On [vercel.com](https://vercel.com), choose **Add New → Project** and import this GitHub repository.
2. Leave the defaults (Framework: Next.js, build `next build`). No environment variables are required.
3. Deploy. Every push to `main` redeploys automatically; other branches get preview URLs.
4. Optional, once you have a custom domain: add it under **Settings → Domains**, then set
   `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.example.com`) under **Settings → Environment Variables** and redeploy.
   This makes social previews, `sitemap.xml` and `robots.txt` use the custom domain.

Notes:

- Node 24 (`engines` in `package.json`).
- Photos are pre-optimised, so the site does not use Vercel's image optimisation quota.
- Bank details are never on the site; they are sent on WhatsApp after Rufus confirms a date.
