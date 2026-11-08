import Link from "next/link";
import { PublicFrame } from "@/components/site";
import { readContent } from "@/lib/store";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Galeri",
  description:
    "Dokumentasi karya dan proses belajar yang diterbitkan oleh Shinta Kurnia.",
};
export default async function Gallery() {
  const { data } = await readContent();
  const photos = data.gallery.filter((item) => item.image);
  return (
    <PublicFrame>
      <main id="main" className="section gallery-page">
        <span className="eyebrow">KARYA & PROSES BELAJAR</span>
        <h1>
          Dokumentasi
          <br />
          <em>kelas & karya.</em>
        </h1>
        {photos.length ? (
          <div className="gallery">
            {photos.map((photo, index) => (
              <figure key={index}>
                <img src={photo.image} alt={photo.caption} loading="lazy" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <section className="gallery-empty">
            <span className="eyebrow">GALERI</span>
            <h2>Dokumentasi sedang disiapkan.</h2>
            <p>
              Foto karya dan proses belajar belum tersedia di website baru.
              Sambil menunggu, jelajahi program atau konsultasikan kelasmu
              langsung.
            </p>
            <div className="actions">
              <Link className="button" href="/kelas">
                Jelajahi program ↗
              </Link>
              <Link className="text-link" href="/konsultasi">
                Konsultasi kelas ↗
              </Link>
            </div>
          </section>
        )}
      </main>
    </PublicFrame>
  );
}
