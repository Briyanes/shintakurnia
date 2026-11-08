import { NextRequest, NextResponse } from "next/server";
import { COOKIE, validSession } from "./auth";
import { createHash } from "node:crypto";
import { readJson, writeJson } from "./store";
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export function sameOrigin(req: NextRequest) {
  return req.headers.get("origin") === req.nextUrl.origin;
}
export function admin(req: NextRequest, mutate = false) {
  return (
    validSession(req.cookies.get(COOKIE)?.value) && (!mutate || sameOrigin(req))
  );
}
export async function body(req: NextRequest) {
  if (Number(req.headers.get("content-length") || 0) > 64000)
    throw new Error("Request too large");
  const text = await req.text();
  if (Buffer.byteLength(text) > 64000) throw new Error("Request too large");
  return JSON.parse(text);
}
export async function rateLimit(
  req: NextRequest,
  scope: string,
  max: number,
  windowMs: number,
) {
  // Vercel supplies this header; never trust client-supplied x-forwarded-for.
  const ip = process.env.VERCEL
    ? req.headers.get("x-vercel-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"
    : "local";
  const key = createHash("sha256")
    .update(`${scope}:${ip}:${Math.floor(Date.now() / windowMs)}`)
    .digest("hex");
  const path = `limits/${key}.json`;
  for (let tries = 0; tries < 4; tries++) {
    const old = await readJson<{ count: number }>(path);
    if (old && old.data.count >= max) return false;
    try {
      await writeJson(path, { count: (old?.data.count || 0) + 1 }, old?.etag);
      return true;
    } catch (error) {
      if (tries === 3) throw error;
    }
  }
  return false;
}
