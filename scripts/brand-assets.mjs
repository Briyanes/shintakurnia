import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const [wordmarkPath, iconPath] = process.argv.slice(2);
if (!wordmarkPath || !iconPath)
  throw new Error(
    "Usage: node scripts/brand-assets.mjs <original-wordmark.png> <original-monogram.png>",
  );
await mkdir("public/brand", { recursive: true });
// Crop only fully transparent outer pixels; keep the original artwork and proportions.
const { data, info } = await sharp(wordmarkPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
let left = info.width,
  top = info.height,
  right = 0,
  bottom = 0;
for (let y = 0; y < info.height; y++)
  for (let x = 0; x < info.width; x++)
    if (data[(y * info.width + x) * 4 + 3] > 0) {
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
const logo = await sharp(wordmarkPath)
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .resize({ width: 1600, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile("public/brand/shinta-kurnia-wordmark.png", logo);
const sizes = [16, 32, 48, 180, 192, 512];
const icons = new Map();
for (const size of sizes) {
  const icon = await sharp(iconPath)
    .resize(size, size, { fit: "contain", background: "#f8f7f3" })
    .flatten({ background: "#f8f7f3" })
    .png()
    .toBuffer();
  icons.set(size, icon);
  await writeFile(`public/brand/icon-${size}.png`, icon);
}
// ICO container with lossless PNG entries for small browser tab sizes.
const icoSizes = [16, 32, 48];
const header = Buffer.alloc(6 + 16 * icoSizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
let offset = header.length;
for (const [index, size] of icoSizes.entries()) {
  const p = 6 + index * 16,
    bytes = icons.get(size);
  header[p] = size;
  header[p + 1] = size;
  header.writeUInt16LE(1, p + 4);
  header.writeUInt16LE(32, p + 6);
  header.writeUInt32LE(bytes.length, p + 8);
  header.writeUInt32LE(offset, p + 12);
  offset += bytes.length;
}
await writeFile(
  "public/favicon.ico",
  Buffer.concat([header, ...icoSizes.map((size) => icons.get(size))]),
);
const logoMeta = await sharp(logo).metadata();
const shareLogo = await sharp(logo)
  .resize({ width: 850, height: 210, fit: "inside" })
  .toBuffer();
const shareMeta = await sharp(shareLogo).metadata();
const monogram = await sharp(iconPath).resize(96, 96).toBuffer();
const canvas = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f8f7f3"/><rect x="0" y="600" width="1200" height="30" fill="#9bf0d9"/><circle cx="1140" cy="80" r="180" fill="none" stroke="#d9dfd1" stroke-width="2"/><text x="100" y="414" fill="#242c28" font-family="sans-serif" font-size="27" letter-spacing="3">PRIVATE HAIR EDUCATION</text><text x="100" y="470" fill="#626c63" font-family="sans-serif" font-size="23">Cutting · Colouring · Styling — Privat 1-on-1</text></svg>`,
);
await sharp(canvas)
  .composite([
    {
      input: shareLogo,
      left: 100,
      top: 140 + Math.round((210 - shareMeta.height) / 2),
    },
    { input: monogram, left: 1000, top: 435 },
  ])
  .png({ compressionLevel: 9 })
  .toFile("public/brand/social-card.png");
console.log(
  "Brand assets created. Wordmark:",
  logoMeta.width,
  "×",
  logoMeta.height,
);
