import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import { seed } from "../lib/seed";
import { contentSchema, inquirySchema } from "../lib/schema";
import {
  configured,
  verifyPassword,
  createSession,
  validSession,
} from "../lib/auth";
test("migrated content is valid and no fabricated testimonials or photo claims", () => {
  assert.equal(contentSchema.safeParse(seed).success, true);
  assert.equal(seed.testimonials.length, 0);
  assert.equal(seed.gallery.length, 0);
});
test("duplicate slug and unsafe image URLs rejected", () => {
  const copy = structuredClone(seed);
  copy.programs[1].slug = copy.programs[0].slug;
  assert.equal(contentSchema.safeParse(copy).success, false);
  const unsafe = structuredClone(seed);
  unsafe.portrait = "javascript:alert(1)";
  assert.equal(contentSchema.safeParse(unsafe).success, false);
});
test("inquiry requires consent and contact validation", () => {
  const input = {
    name: "Test Student",
    phone: "081234567890",
    program: "basic-cutting",
    city: "Surabaya",
    date: "",
    experience: "Pemula",
    goal: "Belajar haircut basic",
    consent: true,
    website: "",
  };
  assert.equal(inquirySchema.safeParse(input).success, true);
  assert.equal(
    inquirySchema.safeParse({ ...input, consent: false }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...input, phone: "invalid" }).success,
    false,
  );
});
test("admin fails closed, validates password, rejects forged, expired and rotated sessions", () => {
  delete process.env.ADMIN_PASSWORD_HASH;
  assert.equal(configured(), false);
  assert.equal(validSession("anything"), false);
  const password = randomBytes(24).toString("hex");
  const salt = randomBytes(16).toString("hex");
  process.env.ADMIN_PASSWORD_HASH = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  assert.equal(verifyPassword(password), true);
  assert.equal(verifyPassword("wrong"), false);
  const session = createSession();
  assert.equal(validSession(session), true);
  assert.equal(
    validSession(session.slice(0, -1) + (session.endsWith("a") ? "b" : "a")),
    false,
  );
  assert.equal(
    validSession(`0.${session.split(".").slice(1).join(".")}`),
    false,
  );
  assert.equal(validSession(session + ".extra"), false);
  delete process.env.ADMIN_PASSWORD_HASH;
  assert.equal(validSession(session), false);
});

test("protected APIs deny anonymous access and reject cross-origin writes", async () => {
  const { NextRequest } = await import("next/server");
  const content = await import("../app/api/admin/content/route");
  const inquiries = await import("../app/api/admin/inquiries/route");
  const media = await import("../app/api/admin/media/route");
  const login = await import("../app/api/admin/login/route");
  const publicInquiry = await import("../app/api/inquiry/route");
  const anonymous = new NextRequest("https://example.test/api/admin/content");
  assert.equal((await content.GET(anonymous)).status, 401);
  assert.equal((await inquiries.GET(anonymous)).status, 401);
  const foreign = new NextRequest("https://example.test/api/admin/content", {
    method: "PUT",
    headers: { origin: "https://other.test" },
  });
  assert.equal((await content.PUT(foreign)).status, 401);
  assert.equal(
    (
      await media.POST(
        new NextRequest("https://example.test/api/admin/media", {
          method: "POST",
        }),
      )
    ).status,
    401,
  );
  assert.equal(
    (
      await login.POST(
        new NextRequest("https://example.test/api/admin/login", {
          method: "POST",
          headers: { origin: "https://other.test" },
        }),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await publicInquiry.POST(
        new NextRequest("https://example.test/api/inquiry", {
          method: "POST",
          headers: { origin: "https://other.test" },
        }),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await login.POST(
        new NextRequest("https://example.test/api/admin/login", {
          method: "POST",
          headers: { origin: "https://example.test" },
        }),
      )
    ).status,
    503,
  );
});

test("legacy booking and category URLs resolve to relevant existing destinations", async () => {
  const { legacyRedirects, findCategory } = await import("../lib/catalog");
  const destinations = Object.fromEntries(
    legacyRedirects.map((item) => [item.source, item.destination]),
  );
  assert.equal(destinations["/form-booking"], "/konsultasi");
  assert.equal(destinations["/kursus-tata-rambut"], "/kelas");
  assert.equal(destinations["/galery-treatments-service"], "/galeri");
  for (const redirect of legacyRedirects) {
    assert.equal(redirect.permanent, true);
    assert.equal(redirect.destination.includes("#"), false);
    if (redirect.destination.startsWith("/kelas/"))
      assert.ok(findCategory(redirect.destination.split("/").pop()!));
  }
});

test("category catalogs show only published matching programs and support empty categories", async () => {
  const { publishedPrograms } = await import("../lib/catalog");
  assert.deepEqual(
    publishedPrograms(seed.programs, "cutting").map((p) => p.id),
    ["basic-cutting", "intermediate-haircut"],
  );
  assert.deepEqual(
    publishedPrograms(seed.programs, "blow-styling").map((p) => p.id),
    ["basic-blow", "styling-iron"],
  );
  assert.deepEqual(publishedPrograms(seed.programs, "unknown"), []);
  const programs = structuredClone(seed.programs);
  programs[0].status = "draft";
  programs[1].status = "archived";
  assert.deepEqual(publishedPrograms(programs, "cutting"), []);
  assert.equal(publishedPrograms(programs).length, 3);
});
