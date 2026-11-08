import { NextRequest } from "next/server";
import { admin, body, json } from "@/lib/http";
import { inquiryStatus } from "@/lib/schema";
import { listInquiries, readJson, writeJson } from "@/lib/store";
export async function GET(req: NextRequest) {
  if (!admin(req)) return json({ error: "Silakan login." }, 401);
  try {
    const page = await listInquiries(
      req.nextUrl.searchParams.get("cursor") || undefined,
    );
    const rows = await Promise.all(
      page.blobs.map(async (b) => {
        const id = b.pathname.split("/").pop()!;
        const row = await readJson<Record<string, unknown>>(`inquiries/${id}`);
        return row ? { ...row.data, etag: row.etag } : null;
      }),
    );
    return json({
      rows: rows.filter(Boolean),
      cursor: page.hasMore ? page.cursor : null,
    });
  } catch {
    return json({ error: "Inquiry belum dapat dimuat." }, 503);
  }
}
export async function PATCH(req: NextRequest) {
  if (!admin(req, true)) return json({ error: "Silakan login." }, 401);
  try {
    const input = await body(req);
    const status = inquiryStatus.safeParse(input.status);
    if (!status.success || !/^[a-f0-9-]{36}$/.test(input.id))
      return json({ error: "Data tidak valid." }, 400);
    const row = await readJson<Record<string, unknown>>(
      `inquiries/${input.id}.json`,
    );
    if (!row) return json({ error: "Tidak ditemukan." }, 404);
    if (row.etag !== input.etag)
      return json({ error: "Inquiry berubah. Muat ulang." }, 409);
    await writeJson(
      `inquiries/${input.id}.json`,
      { ...row.data, status: status.data },
      row.etag,
    );
    return json({ ok: true });
  } catch {
    return json({ error: "Gagal memperbarui. Muat ulang." }, 409);
  }
}
