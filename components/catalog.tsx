import Link from "next/link";
import { categories, publishedPrograms } from "@/lib/catalog";
import type { Program } from "@/lib/schema";
import { ProgramGroups } from "./program-groups";

export function Catalog({
  programs,
  category,
}: {
  programs: Program[];
  category?: string;
}) {
  const visible = publishedPrograms(programs, category);
  return (
    <>
      <nav className="category-nav" aria-label="Kategori kelas">
        <Link href="/kelas" aria-current={!category ? "page" : undefined}>
          Semua program
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/kelas/${item.slug}`}
            aria-current={category === item.slug ? "page" : undefined}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      {visible.length ? (
        <ProgramGroups programs={visible} />
      ) : (
        <div className="info-box">
          <h2>Belum ada program yang tersedia.</h2>
          <p>
            Konsultasikan tujuan belajarmu untuk mengetahui pilihan kelas
            berikutnya.
          </p>
          <Link className="text-link" href="/konsultasi">
            Konsultasi kelas ↗
          </Link>
        </div>
      )}
      <p className="muted">
        Privat 1-on-1. Jadwal, lokasi, fasilitas, dan total biaya dikonfirmasi
        sebelum pendaftaran.
      </p>
    </>
  );
}
