import sharp from "sharp";
import { writeFile } from "node:fs/promises";
const source = "public/brand/shinta-kurnia-wordmark.png";
async function cropVisible(rect) {
  const { data, info } = await sharp(source)
    .extract(rect)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width,
    top = info.height,
    right = 0,
    bottom = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] > 5) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .png()
    .toBuffer();
}
const sk = await cropVisible({ left: 0, top: 0, width: 300, height: 376 });
const name = await cropVisible({ left: 300, top: 0, width: 1300, height: 195 });
const mark = await sharp(sk).resize({ height: 135 }).toBuffer();
const markMeta = await sharp(mark).metadata();
const nameImage = await sharp(name).resize({ width: 650 }).toBuffer();
const nameMeta = await sharp(nameImage).metadata();
const tagline = Buffer.from(
  '<svg width="650" height="45" xmlns="http://www.w3.org/2000/svg"><text x="0" y="30" font-family="sans-serif" font-size="24" letter-spacing="7" fill="#252725">HAIR EDUCATOR</text></svg>',
);
const left = markMeta.width + 30;
await sharp({
  create: {
    width: left + 650,
    height: 155,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: mark, left: 0, top: 10 },
    { input: nameImage, left, top: 18 },
    { input: tagline, left, top: 18 + nameMeta.height + 12 },
  ])
  .png()
  .toFile("public/brand/header-educator.png");
// Use the original freestanding SK, not a circular badge. Transparent canvas throughout.
for (const size of [16, 32, 48, 192, 512]) {
  const pad = Math.max(1, Math.round(size * 0.06));
  const black = await sharp(sk)
    .resize({
      width: size - pad * 2,
      height: size - pad * 2,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  await writeFile(`public/brand/sk-transparent-${size}.png`, black);
  const { data, info } = await sharp(black)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i + 1] = data[i + 2] = 245;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(`public/brand/sk-light-${size}.png`);
}
const sizes = [16, 32, 48],
  header = Buffer.alloc(6 + sizes.length * 16),
  chunks = [];
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (const [i, size] of sizes.entries()) {
  const bytes = await sharp(`public/brand/sk-transparent-${size}.png`)
    .png()
    .toBuffer();
  const p = 6 + i * 16;
  header[p] = header[p + 1] = size;
  header.writeUInt16LE(1, p + 4);
  header.writeUInt16LE(32, p + 6);
  header.writeUInt32LE(bytes.length, p + 8);
  header.writeUInt32LE(offset, p + 12);
  offset += bytes.length;
  chunks.push(bytes);
}
await writeFile("public/favicon.ico", Buffer.concat([header, ...chunks]));
console.log(
  "Created approved header lockup and transparent SK favicon variants.",
);
