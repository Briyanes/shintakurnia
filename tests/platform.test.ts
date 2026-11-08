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

test("learning groups use only published CMS levels, with no guessed audience for custom levels", async () => {
  const { learningGroups } = await import("../lib/catalog");
  const groups = learningGroups(seed.programs);
  assert.deepEqual(
    groups.map((g) => [g.id, g.programs.map((p) => p.id)]),
    [
      ["dasar", ["basic-cutting", "basic-blow", "styling-iron"]],
      ["pendalaman", ["intermediate-haircut"]],
      ["konsultasi", ["colouring"]],
    ],
  );
  const custom = {
    ...seed.programs[0],
    id: "custom",
    slug: "custom",
    level: "Khusus tim",
  };
  assert.equal(learningGroups([custom])[0].id, "konsultasi");
  assert.equal(learningGroups([{ ...custom, status: "draft" }]).length, 0);
});

test("mobile menu keeps all navigation links and WhatsApp link uses line icon without unsafe window opener", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { Header } = await import("../components/site");
  const { WhatsAppLink } = await import("../components/whatsapp-link");
  const menu = renderToStaticMarkup(createElement(Header));
  assert.ok(menu.includes('<details class="mobile-menu"'));
  assert.ok(menu.includes("<summary>Menu"));
  for (const path of ["/kelas", "/#tentang", "/galeri", "/#faq", "/konsultasi"])
    assert.ok(menu.includes(`href="${path}"`));
  const wa = renderToStaticMarkup(
    createElement(WhatsAppLink, {
      phone: "620000000000",
      message: "Kelas & lokasi?",
    }),
  );
  assert.ok(
    wa.includes("https://wa.me/620000000000?text=Kelas%20%26%20lokasi%3F"),
  );
  assert.ok(wa.includes('rel="noopener noreferrer"'));
  assert.ok(wa.includes("<svg"));
  assert.equal(wa.includes("↗"), false);
});

test("neutral logo preserves main artwork and removes only the separate tagline area", async () => {
  const sharp = (await import("sharp")).default;
  const original = await sharp("public/brand/shinta-kurnia-wordmark.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const neutral = await sharp("public/brand/shinta-kurnia-neutral.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert.equal(neutral.info.width, original.info.width);
  assert.equal(neutral.info.height, original.info.height);
  let removed = 0;
  for (let y = 0; y < original.info.height; y++)
    for (let x = 0; x < original.info.width; x++) {
      const i = (y * original.info.width + x) * 4;
      if (y >= 195 && x >= 300) {
        assert.equal(neutral.data[i + 3], 0);
        if (original.data[i + 3]) removed++;
      } else
        assert.deepEqual(
          neutral.data.subarray(i, i + 4),
          original.data.subarray(i, i + 4),
        );
    }
  assert.ok(removed > 0);
});

test("primary text, muted text and button foreground colors meet normal-text AA contrast", () => {
  const lum = (hex: string) => {
    const c = hex
      .match(/\w\w/g)!
      .map((n) => parseInt(n, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  for (const [a, b] of [
    ["252725", "f6f5f0"],
    ["5d625c", "f6f5f0"],
    ["ffffff", "252725"],
    ["ffffff", "3d6558"],
  ]) {
    const values = [lum(a), lum(b)].sort((a, b) => b - a);
    assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5);
  }
});

test("approved educator lockup and favicon PNGs have transparent backgrounds and theme variants", async () => {
  const sharp = (await import("sharp")).default;
  const { brandMetadata } = await import("../lib/brand-metadata");
  const logo = await sharp("public/brand/header-educator.png").metadata();
  assert.equal(logo.height, 155);
  assert.equal(logo.hasAlpha, true);
  for (const size of [16, 32, 48, 192, 512]) {
    const dark = await sharp(`public/brand/sk-transparent-${size}.png`)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const light = await sharp(`public/brand/sk-light-${size}.png`)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.equal(dark.info.width, size);
    assert.equal(dark.info.height, size);
    let visible = 0,
      transparent = 0;
    for (let i = 0; i < dark.data.length; i += 4) {
      assert.equal(dark.data[i + 3], light.data[i + 3]);
      if (dark.data[i + 3] === 0) transparent++;
      else visible++;
    }
    assert.ok(visible > 0);
    assert.ok(transparent > (size * size) / 3);
    assert.equal(dark.data[3], 0);
  }
  const metadata = JSON.stringify(brandMetadata({}));
  assert.ok(metadata.includes("/brand/sk-transparent-32.png"));
  assert.ok(metadata.includes("/brand/sk-light-32.png"));
  assert.ok(metadata.includes("prefers-color-scheme: dark"));
});

test("program cards never tint their background on touch hover or active state", async () => {
  const { readFile } = await import("node:fs/promises");
  const css = await readFile("app/globals.css", "utf8");
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(
    ([, selector]) => selector.includes(".program-card"),
  );
  const backgrounds = blocks.flatMap(([, selector, body]) =>
    [...body.matchAll(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+);/g)].map(
      (match) => ({ selector, value: match[1].trim() }),
    ),
  );
  assert.ok(backgrounds.length);
  // Old base declarations may exist; the current hover/active override must stay transparent.
  const interactive = backgrounds.filter(
    (b) => b.selector.includes(":hover") || b.selector.includes(":active"),
  );
  assert.ok(interactive.length);
  assert.ok(interactive.every((b) => b.value === "transparent"));
  assert.ok(css.includes(".program-card:focus-visible"));
  assert.ok(css.includes("@media (hover: hover) and (pointer: fine)"));
});

test("uploaded process photos are available publicly, labelled and never replace custom program images", async () => {
  const { programIllustration, profilePhoto } =
    await import("../lib/photo-assets");
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { ProgramCard } = await import("../components/site");
  for (const p of seed.programs) {
    assert.ok(programIllustration(p.id));
  }
  assert.equal(programIllustration("unknown"), undefined);
  assert.equal(programIllustration("toString"), undefined);
  const illustration = programIllustration("basic-cutting")!;
  const html = renderToStaticMarkup(
    createElement(ProgramCard, {
      program: seed.programs[0],
      index: 0,
      illustration,
    }),
  );
  assert.ok(html.includes("Foto ilustrasi, bukan dokumentasi kelas Shinta."));
  assert.ok(html.includes("/photos/cutting.webp"));
  const custom = renderToStaticMarkup(
    createElement(ProgramCard, {
      program: { ...seed.programs[0], image: "/api/media/12345678" },
      index: 0,
      illustration,
    }),
  );
  assert.ok(custom.includes("/api/media/12345678"));
  assert.equal(custom.includes("/photos/cutting.webp"), false);
  const sharp = (await import("sharp")).default;
  for (const name of ["colouring", "cutting", "styling", "blow", "shinta"]) {
    const m = await sharp(`public/photos/${name}.webp`).metadata();
    assert.equal(m.format, "webp");
    assert.ok(!m.exif);
    assert.ok(m.width! <= 1000);
  }
  assert.equal(profilePhoto, "/photos/shinta.webp");
});
