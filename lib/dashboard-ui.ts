import type { Program } from "./schema";
export const statusLabels: Record<Program["status"], string> = {
  draft: "Draft",
  published: "Terbit",
  archived: "Arsip",
};
export function newProgram(): Program {
  const id = `kelas-${crypto.randomUUID().slice(0, 8)}`;
  return {
    id,
    slug: id,
    title: "Program baru",
    category: "Cutting",
    level: "Pemula",
    description: "Tulis deskripsi program.",
    duration: "Dikonfirmasi",
    price: null,
    priceNote: "Harga dikonfirmasi saat konsultasi.",
    outcomes: ["Tulis tujuan belajar"],
    materials: [],
    facilities: "",
    location: "Berdasarkan kesepakatan",
    format: "offline",
    status: "draft",
    image: "",
  };
}
export function whatsappContact(phone: string) {
  let number = phone.replace(/\D/g, "");
  if (number.startsWith("0")) number = "62" + number.slice(1);
  if (!/^\d{8,15}$/.test(number)) return null;
  return `https://wa.me/${number}`;
}
