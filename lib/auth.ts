import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
export const COOKIE = "sk_admin";
const DAY = 86400000;
export function configured() {
  return /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(
    process.env.ADMIN_PASSWORD_HASH || "",
  );
}
export function verifyPassword(password: string) {
  if (!configured() || password.length > 256) return false;
  const [salt, expected] = process.env.ADMIN_PASSWORD_HASH!.split(":");
  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(expected, "hex"),
  );
}
function signature(value: string) {
  return createHmac("sha256", process.env.ADMIN_PASSWORD_HASH!)
    .update(`session:${value}`)
    .digest("hex");
}
export function createSession() {
  if (!configured()) throw new Error("Admin not configured");
  const value = `${Date.now() + DAY}.${randomBytes(24).toString("hex")}`;
  return `${value}.${signature(value)}`;
}
export function validSession(token?: string) {
  if (!configured() || !token) return false;
  const [expiry, nonce, mac, extra] = token.split(".");
  if (
    extra ||
    !/^\d+$/.test(expiry || "") ||
    !/^[a-f0-9]{48}$/.test(nonce || "") ||
    !/^[a-f0-9]{64}$/.test(mac || "") ||
    Number(expiry) <= Date.now() ||
    Number(expiry) > Date.now() + DAY + 1000
  )
    return false;
  return timingSafeEqual(
    Buffer.from(mac, "hex"),
    Buffer.from(signature(`${expiry}.${nonce}`), "hex"),
  );
}
