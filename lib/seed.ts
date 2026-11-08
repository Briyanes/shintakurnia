import type { Content, Program } from "./schema";
const common = {
  location: "Kota dan lokasi disepakati saat konsultasi.",
  format: "offline" as const,
  status: "published" as const,
  image: "",
  facilities:
    "Ketersediaan alat, model praktik, serta biaya perjalanan/akomodasi dikonfirmasi sebelum pendaftaran.",
  priceNote:
    "Referensi harga website lama. Harga terbaru dan total biaya dikonfirmasi saat konsultasi.",
};
export const seed: Content = {
  name: "Shinta Kurnia",
  headline: "Belajar rambut\nlangsung bersama Shinta.",
  intro:
    "Kelas privat 1-on-1 untuk mempelajari cutting, colouring, dan styling. Mulai dari pengalamanmu sekarang; program, waktu, dan lokasi kita bicarakan bersama.",
  bio: "Shinta Kurnia adalah penata rambut dengan pendekatan pembelajaran yang mudah dan santai, serta mengikuti perkembangan tren. Jelajahi program cutting, colouring, dan styling; konsultasikan level serta tujuan belajarmu sebelum menentukan kelas.",
  whatsapp: "6281231600479",
  location: "Lokasi fleksibel · berdasarkan kesepakatan",
  portrait: "",
  programs: [
    {
      ...common,
      id: "basic-cutting",
      slug: "basic-cutting",
      title: "Basic Cutting",
      category: "Cutting",
      level: "Fundamental",
      description:
        "Mulai dari pengenalan alat hingga teknik haircut basic. Fondasi untuk membangun perjalananmu di dunia tata rambut.",
      duration: "3 hari",
      price: 5000000,
      outcomes: [
        "Mengenal alat dan penggunaan gunting",
        "Memahami bentuk wajah dan teknik korektif",
        "Mempelajari teknik haircut basic",
      ],
      materials: [
        "6 materi haircut basic",
        "Pengenalan alat",
        "Penggunaan gunting",
        "Pengguntingan dasar",
        "Bentuk wajah & korektif",
      ],
    },
    {
      ...common,
      id: "intermediate-haircut",
      slug: "intermediate-haircut",
      title: "Intermediate Haircut",
      category: "Cutting",
      level: "Intermediate",
      description:
        "Eksplorasi haircut trend dan teknik texturizing untuk kamu yang ingin mengembangkan keterampilan cutting.",
      duration: "2 hari",
      price: 5000000,
      outcomes: [
        "Mengeksplorasi haircut trend",
        "Mempelajari teknik texturizing",
      ],
      materials: ["6 materi haircut trend", "Teknik texturizing"],
    },
    {
      ...common,
      id: "colouring",
      slug: "colouring",
      title: "Colouring",
      category: "Colouring",
      level: "Konsultasikan level",
      description:
        "Kenali anatomi rambut, formula warna, tools, dan SOP sebelum mengeksplorasi dunia colouring.",
      duration: "Dikonfirmasi saat konsultasi",
      price: null,
      priceNote: "Detail paket dan harga dikonfirmasi saat konsultasi.",
      outcomes: [
        "Mengenal formula dasar warna",
        "Memahami pembacaan kode cat warna",
      ],
      materials: [
        "Anatomi & fisiologi rambut",
        "Basic formula color",
        "Tools & SOP color",
        "Membaca kode cat warna",
      ],
    },
    {
      ...common,
      id: "basic-blow",
      slug: "basic-blow",
      title: "Basic Blow",
      category: "Styling",
      level: "Fundamental",
      description:
        "Pelajari pengenalan alat, teknik mengeringkan rambut, dan variasi basic blow in serta blow out.",
      duration: "Dikonfirmasi saat konsultasi",
      price: 1000000,
      outcomes: [
        "Mengenal alat blow",
        "Mempelajari blow in, blow out & variasi",
      ],
      materials: [
        "Pengenalan alat blow",
        "Teknik mengeringkan rambut",
        "Basic blow in, blow out & variasi",
      ],
    },
    {
      ...common,
      id: "styling-iron",
      slug: "styling-iron",
      title: "Styling Iron",
      category: "Styling",
      level: "Fundamental",
      description:
        "Kenali ragam styling iron dan eksplorasi teknik curly serta wave.",
      duration: "Dikonfirmasi saat konsultasi",
      price: 1000000,
      outcomes: [
        "Mengenal macam-macam styling iron",
        "Mempelajari curly & wave",
      ],
      materials: ["Macam-macam styling iron", "Pengenalan curly & wave"],
    },
  ] satisfies Program[],
  gallery: [],
  testimonials: [],
  faqs: [
    {
      question: "Apakah kelas benar-benar privat?",
      answer:
        "Ya, format kelas adalah 1-on-1. Tujuan belajar dan pilihan program dibicarakan langsung sebelum pendaftaran.",
    },
    {
      question: "Di mana kelas berlangsung?",
      answer:
        "Kota dan lokasi dikonfirmasi bersama. Ketersediaan pengajar serta kemungkinan biaya perjalanan dan akomodasi harus disepakati terlebih dahulu.",
    },
    {
      question: "Apakah tersedia kelas online?",
      answer:
        "Kelas online masih dalam rencana pengembangan. Program yang ditampilkan saat ini adalah tatap muka.",
    },
    {
      question: "Bagaimana cara mendaftar?",
      answer:
        "Pilih program dan kirim permintaan konsultasi. Pengiriman formulir belum merupakan konfirmasi kursi atau jadwal. Jadwal, fasilitas, harga, dan ketentuan pembayaran dikonfirmasi sebelum mendaftar.",
    },
  ],
};
