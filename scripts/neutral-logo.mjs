import sharp from "sharp";
import { writeFile } from "node:fs/promises";
// Approved derivative of the existing 1600×376 web wordmark. The left initial
// extends below the name; remove only the separate lower-right tagline area.
const { data, info } = await sharp("public/brand/shinta-kurnia-wordmark.png")
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
if (info.width !== 1600 || info.height !== 376)
  throw new Error("Review the crop before using a different master.");
for (let y = 195; y < info.height; y++)
  for (let x = 300; x < info.width; x++) data[(y * info.width + x) * 4 + 3] = 0;
const logo = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile("public/brand/shinta-kurnia-neutral.png", logo);
const monogram = await sharp("public/brand/icon-512.png").resize(96).toBuffer();
const wordmark = await sharp(logo).resize({ width: 850 }).toBuffer();
const canvas = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f6f5f0"/><rect y="600" width="1200" height="30" fill="#b5e4d3"/><text x="100" y="414" fill="#252725" font-family="sans-serif" font-size="27" letter-spacing="3">KELAS RAMBUT PRIVAT</text><text x="100" y="470" fill="#5d625c" font-family="sans-serif" font-size="23">Cutting · Colouring · Styling — Privat 1-on-1</text></svg>`,
);
await sharp(canvas)
  .composite([
    { input: wordmark, left: 100, top: 140 },
    { input: monogram, left: 1000, top: 435 },
  ])
  .png()
  .toFile("public/brand/social-card.png");
