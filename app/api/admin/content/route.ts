import { NextRequest } from "next/server";
import { admin, body, json } from "@/lib/http";
import { readContent, storageReady, writeJson } from "@/lib/store";
import { contentSchema } from "@/lib/schema";
export async function GET(req: NextRequest) {
  if (!admin(req)) return json({ error: "Silakan login." }, 401);
  try {
    return json(await readContent());
  } catch {
    return json({ error: "Konten belum dapat dibaca." }, 503);
  }
}
export async function PUT(req: NextRequest) {
  if (!admin(req, true)) return json({ error: "Silakan login kembali." }, 401);
  if (!storageReady()) return json({ error: "Penyimpanan belum aktif." }, 503);
  try {
    const input = await body(req);
    const parsed = contentSchema.safeParse(input.data);
    if (!parsed.success)
      return json(
        {
          error: parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        },
        400,
      );
    const old = await readContent();
    if (input.etag !== old.etag)
      return json(
        { error: "Konten berubah di sesi lain. Muat ulang sebelum menyimpan." },
        409,
      );
    await writeJson(`backups/${crypto.randomUUID()}.json`, old.data);
    const result = await writeJson(
      "content.json",
      parsed.data,
      old.etag || undefined,
    );
    return json({ ok: true, etag: result.etag });
  } catch {
    return json(
      {
        error:
          "Penyimpanan gagal atau konten berubah. Muat ulang sebelum mencoba lagi.",
      },
      409,
    );
  }
}
