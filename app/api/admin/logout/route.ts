import { NextRequest } from "next/server";
import { COOKIE } from "@/lib/auth";
import { json, sameOrigin } from "@/lib/http";
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Tidak diizinkan." }, 403);
  const res = json({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
