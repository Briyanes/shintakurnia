import { get, put, list } from "@vercel/blob";
import { seed } from "./seed";
import { contentSchema, type Content } from "./schema";
export const namespace = `app/${process.env.VERCEL_ENV || "development"}`;
export function storageReady() {
  return Boolean(
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN,
  );
}
export async function readJson<T>(
  path: string,
): Promise<{ data: T; etag: string } | null> {
  const result = await get(`${namespace}/${path}`, {
    access: "private",
    useCache: false,
  });
  if (!result) return null;
  if (result.statusCode !== 200) throw new Error("Unexpected storage response");
  return {
    data: JSON.parse(await new Response(result.stream).text()) as T,
    etag: result.blob.etag,
  };
}
export async function writeJson(path: string, data: unknown, etag?: string) {
  return put(`${namespace}/${path}`, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: Boolean(etag),
    ...(etag ? { ifMatch: etag } : {}),
  });
}
export async function readContent() {
  if (!storageReady()) return { data: seed, etag: null };
  const result = await readJson<Content>("content.json");
  if (!result) return { data: seed, etag: null };
  return { data: contentSchema.parse(result.data), etag: result.etag };
}
export async function listInquiries(cursor?: string) {
  return list({ prefix: `${namespace}/inquiries/`, limit: 50, cursor });
}
