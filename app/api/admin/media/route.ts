import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { admin, json } from "@/lib/http";
import { namespace } from "@/lib/store";
export async function POST(req: NextRequest) {
  if (!admin(req, true)) return json({ error: "Silakan login." }, 401);
  if (Number(req.headers.get("content-length") || 0) > 4200000)
    return json({ error: "Maksimal 4 MB." }, 413);
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 4000000)
      return json({ error: "Maksimal 4 MB." }, 400);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const png = bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
    const webp =
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
    const type = jpeg
      ? "image/jpeg"
      : png
        ? "image/png"
        : webp
          ? "image/webp"
          : "";
    if (!type) return json({ error: "Gunakan JPG, PNG, atau WebP." }, 400);
    const id = crypto.randomUUID();
    await put(`${namespace}/media/${id}`, Buffer.from(bytes), {
      access: "private",
      contentType: type,
    });
    return json({ url: `/api/media/${id}` });
  } catch {
    return json({ error: "Unggah gagal." }, 503);
  }
}
