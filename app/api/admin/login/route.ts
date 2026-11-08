import { NextRequest } from "next/server";
import { configured, verifyPassword, createSession, COOKIE } from "@/lib/auth";
import { body, json, sameOrigin, rateLimit } from "@/lib/http";
import { storageReady } from "@/lib/store";
export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return json({ error: "Permintaan tidak diizinkan." }, 403);
  if (!configured() || !storageReady())
    return json({ error: "Login belum diaktifkan oleh pemilik." }, 503);
  try {
    if (!(await rateLimit(req, "login", 5, 15 * 60 * 1000)))
      return json(
        { error: "Terlalu banyak percobaan. Tunggu hingga 15 menit." },
        429,
      );
    const input = await body(req);
    if (typeof input.password !== "string" || !verifyPassword(input.password))
      return json({ error: "Password tidak sesuai." }, 401);
    const res = json({ ok: true });
    res.cookies.set(COOKIE, createSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });
    return res;
  } catch {
    return json({ error: "Login tidak dapat diproses. Coba lagi nanti." }, 503);
  }
}
