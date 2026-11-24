// Generates every derived brand asset from the two source logos.
// Run with: npm run logos   (re-run whenever a source logo changes)
//
// Sources (hand-supplied, never edited by this script):
//   public/brand/logo-white.png     white script on transparent
//   public/brand/logo-black-bg.png  white script on a black square
//
// Outputs:
//   public/brand/logo-dark.png      near-black version of logo-white (same size)
//   public/brand/logo-dark-web.png  trimmed + compressed, for the light header
//   public/brand/logo-white-web.png trimmed + compressed, for dark bands/overlays
//   app/favicon.ico                 16/32/48px "R" monogram
//   app/icon.png, app/apple-icon.png
//   app/opengraph-image.png         1200x630 social preview
// The app/* files use Next.js file conventions, so Next adds the <link>/<meta> tags itself.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const BRAND = "public/brand";
const SRC_WHITE = `${BRAND}/logo-white.png`;
const SRC_BLACK_BG = `${BRAND}/logo-black-bg.png`;

// Keep in sync with --ink in app/globals.css (near-black, slightly warm).
const INK = { r: 0x1c, g: 0x19, b: 0x17 };

// Header shows the logo at ~170 CSS px wide; 2x for retina, capped at source size.
const WEB_WIDTH = 480;

// Small palette PNGs: ~4x smaller than truecolour, invisible difference for a 2-tone logo.
const png = (img) =>
  img.png({ palette: true, quality: 90, compressionLevel: 9 });

// The black-bg source is a JPEG at heart: its "black" is noisy near-black (values ~0-12),
// which shows as a faint box on a pure #000 canvas. A small level shift crushes it to 0.
const crushBlacks = (img) => img.linear(1.06, -14);

/** Recolour every pixel to INK but keep the original alpha, so anti-aliasing survives. */
async function recolour(input, { r, g, b }) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    // data[i + 3] (alpha) untouched
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

/** Trim transparent edges and resize to web width (never upscale). */
async function webVersion(input) {
  const trimmed = await sharp(input).trim().toBuffer();
  return png(
    sharp(trimmed).resize({ width: WEB_WIDTH, withoutEnlargement: true }),
  ).toBuffer();
}

/**
 * The full wordmark is unreadable at favicon sizes, so the icon is the script "R".
 * It touches the "u" and the "f" descender, so a stepped mask cuts those away.
 * Coordinates are specific to the current logo-black-bg.png (1080x1080).
 */
async function monogram(size) {
  const crop = await crushBlacks(sharp(SRC_BLACK_BG))
    .extract({ left: 40, top: 330, width: 200, height: 390 })
    .ensureAlpha()
    .toBuffer();
  const mask = Buffer.from(
    `<svg width="200" height="390"><polygon fill="#fff" points="0,0 200,0 200,132 118,132 118,186 100,186 100,240 111,240 111,300 0,300"/></svg>`,
  );
  // Two steps: sharp runs flatten() before composite() within one pipeline.
  const cut = await sharp(crop)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  const letter = await sharp(cut)
    .trim()
    .resize({ height: 340 })
    .png()
    .toBuffer();
  let master = await sharp({
    create: { width: 400, height: 400, channels: 4, background: "#000" },
  })
    .composite([{ input: letter, gravity: "centre" }])
    .flatten({ background: "#000" })
    .png()
    .toBuffer();
  // At tiny sizes the hairline strokes vanish; blur + level boost thickens them.
  if (size <= 48) {
    master = await sharp(master).blur(6).linear(2.6, -50).png().toBuffer();
  }
  return sharp(master).resize(size, size).png().toBuffer();
}

/** Pack PNGs into a .ico (PNG-in-ICO is supported by every current browser). */
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

/** 1200x630 social card: the original black logo, centred with breathing room. */
async function socialImage() {
  const trimmed = await sharp(SRC_BLACK_BG).trim({ threshold: 30 }).toBuffer();
  const logo = await crushBlacks(sharp(trimmed))
    .resize({ width: 760 })
    .toBuffer();
  return sharp({
    create: { width: 1200, height: 630, channels: 3, background: "#000" },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  await mkdir(BRAND, { recursive: true });

  const dark = await recolour(SRC_WHITE, INK);
  await writeFile(`${BRAND}/logo-dark.png`, dark);
  await writeFile(`${BRAND}/logo-dark-web.png`, await webVersion(dark));
  await writeFile(`${BRAND}/logo-white-web.png`, await webVersion(SRC_WHITE));

  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map(async (size) => ({ size, buf: await monogram(size) })),
  );
  await writeFile("app/favicon.ico", toIco(icoPngs));
  await writeFile("app/icon.png", await monogram(192));
  await writeFile("app/apple-icon.png", await monogram(180));
  await writeFile("app/opengraph-image.png", await socialImage());

  console.log("Brand assets generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
