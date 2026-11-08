import type { Program } from "./schema";

export const categories = [
  {
    slug: "cutting",
    title: "Cutting",
    description:
      "Dari fondasi haircut hingga eksplorasi teknik texturizing. Temukan kelas cutting sesuai pengalaman dan tujuan belajarmu.",
    values: ["Cutting"],
  },
  {
    slug: "colouring",
    title: "Colouring",
    description:
      "Eksplorasi dasar warna rambut, formula, tools, dan SOP. Konsultasikan pilihan materi serta level sebelum menentukan kelas.",
    values: ["Colouring"],
  },
  {
    slug: "blow-styling",
    title: "Blow & Styling",
    description:
      "Kenali teknik blow serta ragam styling iron dalam kelas privat 1-on-1.",
    values: ["Styling", "Blow & Styling"],
  },
];

export function findCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function publishedPrograms(programs: Program[], slug?: string) {
  const category = slug ? findCategory(slug) : undefined;
  if (slug && !category) return [];
  return programs.filter(
    (program) =>
      program.status === "published" &&
      (!category || category.values.includes(program.category)),
  );
}

// Only routes observed in the public legacy-site inventory. Do not guess hidden pages.
export const legacyRedirects = [
  { source: "/form-booking", destination: "/konsultasi", permanent: true },
  { source: "/kursus-tata-rambut", destination: "/kelas", permanent: true },
  {
    source: "/kursus-tata-rambut/cutting",
    destination: "/kelas/cutting",
    permanent: true,
  },
  {
    source: "/kursus-tata-rambut/blow-styling",
    destination: "/kelas/blow-styling",
    permanent: true,
  },
  {
    source: "/galery-treatments-service",
    destination: "/galeri",
    permanent: true,
  },
];
