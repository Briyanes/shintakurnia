import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ArrowUpRight,
  ArrowLeft,
  MapPin,
  Clock3,
  UserRound,
} from "lucide-react";
import { readContent } from "@/lib/store";
import { PublicFrame, Price, Art } from "@/components/site";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data } = await readContent();
  const { slug } = await params;
  const p = data.programs.find(
    (p) => p.slug === slug && p.status === "published",
  );
  return {
    title: p?.title || "Program tidak ditemukan",
    description: p?.description,
  };
}
export default async function Program({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await readContent();
  const p = data.programs.find(
    (p) => p.slug === slug && p.status === "published",
  );
  if (!p) notFound();
  return (
    <PublicFrame>
      <main className="section detail-page" id="main">
        <Link className="text-link" href="/#program">
          <ArrowLeft size={16} /> Semua program
        </Link>
        <div className="detail-grid">
          <div>
            <span className="eyebrow">
              {p.category} / {p.level}
            </span>
            <h1 className="detail-title">{p.title}</h1>
            <p className="lead">{p.description}</p>
            <div className="pills">
              <span>
                <UserRound size={15} /> Privat 1-on-1
              </span>
              <span>
                <Clock3 size={15} />
                {p.duration}
              </span>
              <span>{p.format === "offline" ? "Tatap muka" : "Online"}</span>
            </div>
            <h2>Fokus belajarmu</h2>
            <ul className="check-list">
              {p.outcomes.map((v, i) => (
                <li key={i}>
                  <Check size={17} />
                  {v}
                </li>
              ))}
            </ul>
            <h2>Materi kelas</h2>
            <ol className="curriculum">
              {p.materials.map((v, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {v}
                </li>
              ))}
            </ol>
            <h2>Lokasi & fasilitas</h2>
            <p className="body-copy">
              <MapPin size={16} /> {p.location}
            </p>
            <p className="body-copy">{p.facilities}</p>
          </div>
          <aside className="booking-card">
            {p.image ? <img src={p.image} alt={p.title} /> : <Art />}
            <div>
              <span className="eyebrow">INVESTASI BELAJAR</span>
              <h2>
                <Price program={p} />
              </h2>
              <p>{p.priceNote}</p>
              <Link className="button" href={`/konsultasi?program=${p.id}`}>
                Konsultasi & cek jadwal <ArrowUpRight size={18} />
              </Link>
              <small>
                Permintaan konsultasi bukan konfirmasi pendaftaran. Jadwal dan
                total biaya disepakati terlebih dahulu.
              </small>
            </div>
          </aside>
        </div>
      </main>
    </PublicFrame>
  );
}
