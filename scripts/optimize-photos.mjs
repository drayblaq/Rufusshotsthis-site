// Turns original photos into small, fast WebP files for the site.
// Run with: npm run photos            (only processes new/changed photos)
//           npm run photos -- --force (rebuild everything)
//
// In:  photos-raw/<name>.(jpg|jpeg|png|webp|tif|tiff)   (gitignored, full-size originals)
// Out: public/photos/<name>-480.webp, -960.webp, -1600.webp
//      content/photo-manifest.json  { name: { width, height, blurDataURL } }
//
// The manifest is read by content/site.ts, so each photo entry there only needs
// `file: "<name>"` plus its alt text/category; size and blur come from here.
// Widths must match PHOTO_WIDTHS in lib/image-loader.ts.

import sharp from "sharp";
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const RAW_DIR = "photos-raw";
const OUT_DIR = "public/photos";
const MANIFEST = "content/photo-manifest.json";
const WIDTHS = [480, 960, 1600];
const QUALITY = 72; // WebP q72: visually clean for photos at roughly half the size of q90
const INPUT_EXT = /\.(jpe?g|png|webp|tiff?)$/i;
const force = process.argv.includes("--force");

/** "My Photo 01.JPG" -> "my-photo-01" (safe for URLs and the site.ts `file` field) */
const slug = (file) =>
  path
    .parse(file)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0; // missing
  }
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

async function processPhoto(file) {
  const src = path.join(RAW_DIR, file);
  const name = slug(file);
  // .rotate() applies the camera's EXIF orientation, so portrait shots stay upright.
  const base = sharp(src).rotate();

  for (const width of WIDTHS) {
    await base
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(OUT_DIR, `${name}-${width}.webp`));
  }

  // Real pixel size of the largest output, used for the aspect ratio on the site.
  const { width, height } = await sharp(
    path.join(OUT_DIR, `${name}-${WIDTHS.at(-1)}.webp`),
  ).metadata();

  // ~150-byte blurred preview shown while the real image loads.
  const tiny = await base
    .clone()
    .resize({ width: 16 })
    .webp({ quality: 40 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${tiny.toString("base64")}`;

  return [name, { width, height, blurDataURL }];
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let files;
  try {
    files = (await readdir(RAW_DIR)).filter((f) => INPUT_EXT.test(f));
  } catch {
    console.error(
      `No ${RAW_DIR}/ folder. Create it and drop original photos in.`,
    );
    process.exit(1);
  }

  const manifest = await readManifest();
  let done = 0;
  for (const file of files) {
    const name = slug(file);
    const newest = path.join(OUT_DIR, `${name}-${WIDTHS.at(-1)}.webp`);
    const upToDate =
      !force &&
      manifest[name] &&
      (await mtime(newest)) >= (await mtime(path.join(RAW_DIR, file)));
    if (upToDate) continue;
    const [key, entry] = await processPhoto(file);
    manifest[key] = entry;
    done++;
    console.log(`✓ ${file} -> ${key} (${entry.width}x${entry.height})`);
  }

  // Sorted keys keep the JSON diff tidy in git.
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

  const rawNames = new Set(files.map(slug));
  const orphans = Object.keys(sorted).filter((n) => !rawNames.has(n));
  console.log(`${done} processed, ${files.length - done} unchanged.`);
  if (orphans.length) {
    console.log(
      `In manifest but not in ${RAW_DIR}/ (kept): ${orphans.join(", ")}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
