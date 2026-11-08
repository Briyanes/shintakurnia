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

test("brand icons, manifest and social preview are correctly sized and deployed-origin aware", async () => {
  const sharp = (await import("sharp")).default;
  const { readFile } = await import("node:fs/promises");
  const { brandMetadata } = await import("../lib/brand-metadata");
  const manifest = (await import("../app/manifest")).default();
  for (const size of [16, 32, 48, 180, 192, 512]) {
    const m = await sharp(`public/brand/icon-${size}.png`).metadata();
    assert.equal(m.width, size);
    assert.equal(m.height, size);
  }
  const social = await sharp("public/brand/social-card.png").metadata();
  assert.equal(social.width, 1200);
  assert.equal(social.height, 630);
  const logo = await sharp(
    "public/brand/shinta-kurnia-wordmark.png",
  ).metadata();
  assert.equal(logo.width, 1600);
  assert.equal(logo.height, 376);
  assert.equal(logo.hasAlpha, true);
  const ico = await readFile("public/favicon.ico");
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  assert.equal(manifest.display, "browser");
  assert.equal(manifest.icons?.length, 2);
  const preview = brandMetadata({
    VERCEL_ENV: "preview",
    VERCEL_URL: "preview.example.test",
    NEXT_PUBLIC_SITE_URL: "https://production.example.test",
  });
  assert.equal(preview.metadataBase?.origin, "https://preview.example.test");
  assert.equal(
    brandMetadata({
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://production.example.test",
    }).metadataBase?.origin,
    "https://production.example.test",
  );
  assert.equal(brandMetadata({}).metadataBase?.origin, "http://localhost:3000");
});

test("editorial program presentation keeps price, duration and detail links with or without photos", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { ProgramCard } = await import("../components/site");
  for (const program of [
    seed.programs[0],
    {
      ...seed.programs[2],
      image: "/api/media/12345678-1234-1234-1234-123456789abc",
    },
  ]) {
    const html = renderToStaticMarkup(
      createElement(ProgramCard, { program, index: 0 }),
    );
    assert.ok(html.includes(`/program/${program.slug}`));
    assert.ok(html.includes(program.title));
    assert.ok(html.includes(program.duration));
    assert.ok(html.includes(program.priceNote));
    assert.ok(
      html
        .replace(/\u00a0/g, "")
        .includes(
          program.price === null ? "Konsultasikan harga" : "Rp5.000.000",
        ),
    );
    assert.equal(html.includes("<img"), Boolean(program.image));
  }
});
