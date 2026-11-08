import { z } from "zod";
const short = z.string().trim().min(1).max(200);
const image = z
  .string()
  .max(1000)
  .refine(
    (v) => !v || /^\/api\/media\/[a-f0-9-]+$/.test(v),
    "Gunakan unggah gambar dashboard.",
  );
export const programSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(80),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(100),
  title: short,
  category: short,
  level: short,
  description: z.string().trim().min(1).max(2000),
  duration: short,
  price: z.number().int().min(0).max(1000000000).nullable(),
  priceNote: z.string().max(300),
  outcomes: z.array(short).min(1).max(20),
  materials: z.array(short).max(30),
  facilities: z.string().max(1000),
  location: z.string().max(500),
  format: z.enum(["offline", "online"]),
  status: z.enum(["draft", "published", "archived"]),
  image,
});
export const contentSchema = z
  .object({
    name: short,
    headline: z.string().trim().min(1).max(180),
    intro: z.string().trim().min(1).max(600),
    bio: z.string().trim().min(1).max(3000),
    whatsapp: z.string().regex(/^62\d{8,13}$/),
    location: short,
    portrait: image,
    programs: z.array(programSchema).max(50),
    gallery: z.array(z.object({ image, caption: short })).max(30),
    testimonials: z
      .array(
        z.object({ name: short, quote: z.string().trim().min(1).max(1000) }),
      )
      .max(30),
    faqs: z
      .array(
        z.object({
          question: short,
          answer: z.string().trim().min(1).max(1500),
        }),
      )
      .max(30),
  })
  .refine(
    (c) => new Set(c.programs.map((p) => p.slug)).size === c.programs.length,
    "Slug program harus unik.",
  )
  .refine(
    (c) => new Set(c.programs.map((p) => p.id)).size === c.programs.length,
    "ID program harus unik.",
  );
export type Content = z.infer<typeof contentSchema>;
export type Program = z.infer<typeof programSchema>;
export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{8,22}$/),
  program: z.string().max(100),
  city: short,
  date: z.string().max(100),
  experience: z.enum(["Pemula", "Sudah berpengalaman"]),
  goal: z.string().trim().min(10).max(1500),
  consent: z.literal(true),
  website: z.string().max(200).default(""),
});
export const inquiryStatus = z.enum([
  "Baru",
  "Dihubungi",
  "Konsultasi",
  "Terkonfirmasi",
  "Selesai",
  "Batal",
]);
