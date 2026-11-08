import { ProgramGroups } from "@/components/program-groups";
import { WhatsAppLink } from "@/components/whatsapp-link";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { readContent } from "@/lib/store";
import { CTA, PublicFrame } from "@/components/site";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { data: c } = await readContent();
  return (
    <PublicFrame>
      <main id="main">
        <section
          className={`editorial-hero${c.portrait ? " with-portrait" : ""}`}
        >
          <div className="hero-copy">
            <span className="eyebrow">KELAS RAMBUT PRIVAT / SHINTA KURNIA</span>
            <h1>
              {c.headline.split("\n").map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h1>
            <p>{c.intro}</p>
            <div className="actions">
              <Link className="button" href="/#program">
                Lihat pilihan kelas <ArrowUpRight size={18} />
              </Link>
              <WhatsAppLink phone={c.whatsapp} />
            </div>
          </div>
          {c.portrait ? (
            <figure className="editorial-portrait">
              <img src={c.portrait} alt={c.name} />
              <figcaption>{c.name} · Pengajar kelas privat</figcaption>
            </figure>
          ) : (
            <aside className="class-note">
              <span className="eyebrow">BELAJAR SATU PER SATU</span>
              <p>
                Fokus ke teknik <br />
                yang ingin kamu pelajari.
              </p>
              <span>
                Materi, jadwal, dan lokasi dibicarakan bersama sebelum
                mendaftar.
              </span>
            </aside>
          )}
          <dl className="hero-facts">
            <div>
              <dt>Format</dt>
              <dd>Privat 1-on-1</dd>
            </div>
            <div>
              <dt>Materi</dt>
              <dd>Cutting, colouring & styling</dd>
            </div>
            <div>
              <dt>Lokasi</dt>
              <dd>Sesuai kesepakatan</dd>
            </div>
          </dl>
        </section>
        <section className="section" id="program">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PILIHAN KELAS</span>
              <h2>
                Apa yang ingin
                <br />
                kamu pelajari?
              </h2>
            </div>
            <p>
              Baca materi, durasi, dan referensi biaya setiap program. Kita
              konfirmasi detailnya saat konsultasi.
            </p>
          </div>
          <ProgramGroups programs={c.programs} />
          <p className="muted">
            Belum yakin memilih?{" "}
            <Link className="inline-link" href="/konsultasi">
              Ceritakan tujuan belajarmu ↗
            </Link>
          </p>
        </section>
        <section className="about section" id="tentang">
          <div className="educator-heading">
            <span className="eyebrow">PENGAJAR</span>
            <h2>
              Kenal pengajarnya.
              <br />
              <em>{c.name}.</em>
            </h2>
          </div>
          <div>
            <p className="body-copy">{c.bio}</p>
            <div className="about-location">
              <MapPin size={18} />
              {c.location}
            </div>
            <Link className="text-link" href="/konsultasi">
              Kenalan & konsultasi <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
        {c.gallery.some((item) => item.image) && (
          <section className="section" id="galeri">
            <span className="eyebrow">DOKUMENTASI</span>
            <h2>Karya & proses belajar.</h2>
            <div className="gallery">
              {c.gallery
                .filter((g) => g.image)
                .map((g, i) => (
                  <figure key={i}>
                    <img src={g.image} alt={g.caption} loading="lazy" />
                    <figcaption>{g.caption}</figcaption>
                  </figure>
                ))}
            </div>
          </section>
        )}
        {!!c.testimonials.length && (
          <section className="section testimonials">
            <span className="eyebrow">CERITA PESERTA</span>
            <h2>Cerita perjalanan mereka.</h2>
            <div className="steps">
              {c.testimonials.map((t, i) => (
                <blockquote key={i}>
                  <p>“{t.quote}”</p>
                  <cite>{t.name}</cite>
                </blockquote>
              ))}
            </div>
          </section>
        )}
        <section className="section process">
          <span className="eyebrow">CARA MENDAFTAR</span>
          <h2>
            Dari konsultasi
            <br />
            ke jadwal kelas.
          </h2>
          <div className="steps">
            {[
              [
                "01",
                "Pilih fokusmu",
                "Jelajahi program sesuai pengalaman dan teknik yang ingin kamu pelajari.",
              ],
              [
                "02",
                "Cerita & konsultasi",
                "Sampaikan tujuan, kota, dan preferensi waktu. Kita bicarakan program yang sesuai.",
              ],
              [
                "03",
                "Sepakati, lalu mulai",
                "Konfirmasi jadwal, fasilitas, dan total biaya sebelum pendaftaran.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section faq" id="faq">
          <div>
            <span className="eyebrow">SEBELUM MENDAFTAR</span>
            <h2>
              Yang sering
              <br />
              ditanyakan.
            </h2>
            <Link className="text-link" href="/konsultasi">
              Tanya langsung <ArrowUpRight size={17} />
            </Link>
          </div>
          <div>
            {c.faqs.map((f, i) => (
              <details key={i}>
                <summary>
                  {f.question}
                  <span>+</span>
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <CTA />
      </main>
    </PublicFrame>
  );
}
