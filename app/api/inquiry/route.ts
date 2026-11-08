import { NextRequest } from "next/server";
import { body, json, sameOrigin, rateLimit } from "@/lib/http";
import { inquirySchema } from "@/lib/schema";
import { readContent, storageReady, writeJson } from "@/lib/store";
export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return json({ error: "Permintaan tidak diizinkan." }, 403);
  if (!storageReady())
    return json(
      { error: "Formulir belum aktif. Silakan hubungi WhatsApp." },
      503,
    );
  try {
    const input = inquirySchema.safeParse(await body(req));
    if (!input.success)
      return json({ error: "Periksa isian dan persetujuan privasi." }, 400);
    if (input.data.website) return json({ ok: true });
    const { data: content } = await readContent();
    const program = content.programs.find(
      (p) => p.id === input.data.program && p.status === "published",
    );
    if (!program && input.data.program !== "konsultasi")
      return json({ error: "Pilih program yang tersedia." }, 400);
    if (!(await rateLimit(req, "inquiry", 5, 60 * 60 * 1000)))
      return json(
        {
          error:
            "Batas pengiriman tercapai. Coba lagi nanti atau hubungi WhatsApp.",
        },
        429,
      );
    const id = crypto.randomUUID();
    await writeJson(`inquiries/${id}.json`, {
      ...input.data,
      website: undefined,
      id,
      status: "Baru",
      createdAt: new Date().toISOString(),
      programTitle: program?.title || "Konsultasi program",
      quotedPrice: program?.price ?? null,
      priceNote: program?.priceNote || "",
    });
    return json({ ok: true, id });
  } catch {
    return json(
      { error: "Belum berhasil mengirim. Coba lagi atau hubungi WhatsApp." },
      503,
    );
  }
}
