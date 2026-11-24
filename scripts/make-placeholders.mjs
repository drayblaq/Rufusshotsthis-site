// TEMPORARY: writes 12 neutral placeholder "photos" into photos-raw/ so the site
// can be built and tested before real photos exist. Delete this script (and the
// placeholder-* entries in content/site.ts) once real photos are added.
// Run with: node scripts/make-placeholders.mjs && npm run photos

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// [label, width, height, two warm/neutral gradient stops]
const PLACEHOLDERS = [
  ["Portraits", 1600, 2000, "#d8cfc4", "#8c7b6b"],
  ["Convocation", 1600, 2000, "#cfd3d6", "#6d7780"],
  ["Weddings", 2400, 1600, "#eee6dc", "#b59f88"],
  ["Sports", 2400, 1600, "#d5d7cf", "#6f7466"],
  ["Events", 1600, 2000, "#e3d6cc", "#9b7d6a"],
  ["Wildlife", 2400, 1600, "#d6d2c2", "#7a735a"],
  ["Portraits", 1600, 2400, "#e1d9d1", "#76685d"],
  ["Weddings", 1600, 2000, "#efe9e2", "#a89584"],
  ["Convocation", 2400, 1600, "#d9dcdd", "#5f676e"],
  ["Events", 2400, 1600, "#ddd5cd", "#857264"],
  ["Sports", 1600, 2000, "#cfd2c8", "#5d6255"],
  ["Wildlife", 2000, 2000, "#dcd7c6", "#6b6550"],
];

await mkdir("photos-raw", { recursive: true });

for (const [i, [label, w, h, light, dark]] of PLACEHOLDERS.entries()) {
  const n = String(i + 1).padStart(2, "0");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${Math.min(w, h) * 0.16}" fill="#fff" fill-opacity="0.18"/>
    <text x="50%" y="${h * 0.72}" text-anchor="middle" font-family="sans-serif"
      font-size="${Math.min(w, h) * 0.05}" letter-spacing="8" fill="#fff" fill-opacity="0.85">
      ${label.toUpperCase()} · ${n}</text>
  </svg>`;
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 85 })
    .toFile(`photos-raw/placeholder-${n}.jpg`);
}
console.log("12 placeholders written to photos-raw/");
