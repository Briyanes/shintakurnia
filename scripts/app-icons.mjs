import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/app-icons", { recursive: true });
for (const size of [180, 192, 512]) {
  // Full opaque square lets the OS apply its own mask without black corners.
  // Keep all artwork within the central 68%, safe for rounded and circular masks.
  const artwork = await sharp("public/brand/sk-light-512.png")
    .resize(Math.round(size * 0.68))
    .toBuffer();
  const meta = await sharp(artwork).metadata();
  await sharp({
    create: { width: size, height: size, channels: 3, background: "#252725" },
  })
    .composite([
      {
        input: artwork,
        left: Math.floor((size - meta.width) / 2),
        top: Math.floor((size - meta.height) / 2),
      },
    ])
    .png()
    .toFile(`public/app-icons/sk-admin-v2-${size}.png`);
}
