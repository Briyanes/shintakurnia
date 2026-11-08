import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  MoveUpRight,
  UserRound,
  MapPin,
  Scissors,
} from "lucide-react";
import { readContent } from "@/lib/store";
import { Art, CTA, ProgramCard, PublicFrame } from "@/components/site";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { data: c } = await readContent();
  return (
    <PublicFrame>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <i /> PRIVATE HAIR EDUCATION · 1-ON-1
            </span>
            <h1>
              {c.headline.split("\n").map((s, i) => (
                <span key={i} className={i ? "serif accent" : ""}>
                  {s}
                </span>
              ))}
            </h1>
            <p>{c.intro}</p>
            <div className="actions">
              <Link className="button" href="/#program">
                Temukan kelasmu <ArrowUpRight size={20} />
              </Link>
              <Link className="text-link" href="/#tentang">
                Kenali Shinta <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="hero-note">
              <span className="mini-icon">
                <Scissors size={19} />
              </span>
              <span>
                Bukan sekadar mengikuti kelas.
                <br />
                <strong>Ini tentang perjalanan belajarmu.</strong>
              </span>
            </div>
          </div>
          <div className="hero-visual">
            {c.portrait ? (
              <img className="hero-photo" src={c.portrait} alt={c.name} />
            ) : (
              <Art />
            )}
            <div className="floating-tag">
              <span>01 / PERSONAL APPROACH</span>
              <strong>
                Satu mentor.
                <br />
                Fokus untuk kamu.
              </strong>
              <MoveUpRight size={22} />
            </div>
            <span className="vertical-label">
              CRAFT YOUR OWN JOURNEY — SHINTA KURNIA
            </span>
          </div>
          <a className="scroll-note" href="#program">
            <ArrowDown size={14} /> SCROLL TO EXPLORE
          </a>
        </section>
        <div className="value-strip">
          <span>
            <UserRound /> Privat 1-on-1
          </span>
          <span>
            <Scissors /> Cutting · Colouring · Styling
          </span>
          <span>
            <MapPin /> Lokasi sesuai kesepakatan
          </span>
        </div>
        <section className="section" id="program">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / FIND YOUR FOCUS</span>
              <h2>
                Kelas yang mengikuti
                <br />
                <em>arah belajarmu.</em>
              </h2>
            </div>
            <p>
              Dari fondasi pertama hingga eksplorasi teknik.
              <br />
              Pilih titik awalmu, lalu konsultasikan kebutuhanmu.
            </p>
          </div>
          <div className="program-grid">
            {c.programs
              .filter((p) => p.status === "published")
              .map((p, i) => (
                <ProgramCard key={p.id} program={p} index={i} />
              ))}
          </div>
          <p className="muted">
            Belum yakin memilih?{" "}
            <Link className="inline-link" href="/konsultasi">
              Ceritakan tujuan belajarmu ↗
            </Link>
          </p>
        </section>
        <section className="about section" id="tentang">
          <div className="about-visual">
            {c.portrait ? (
              <img src={c.portrait} alt={c.name} loading="lazy" />
            ) : (
              <div className="monogram">
                sk
                <span>
                  THE PERSON BEHIND
                  <br />
                  YOUR LEARNING JOURNEY
                </span>
              </div>
            )}
            <span className="sticker">
              Personal.
              <br />
              Practical.
              <br />
              Purposeful.
            </span>
          </div>
          <div>
            <span className="eyebrow">02 / MEET YOUR EDUCATOR</span>
            <h2>
              Kenal mentormu.
              <br />
              <em>{c.name}.</em>
            </h2>
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
        <section className="section process">
          <span className="eyebrow">03 / A SIMPLE START</span>
          <h2>
            Langkah kecil.
            <br />
            <em>Awal yang berarti.</em>
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
        {!!c.gallery.length && (
          <section className="section" id="galeri">
            <span className="eyebrow">LEARNING IN PRACTICE</span>
            <h2>
              Proses nyata.
              <br />
              <em>Karya yang bercerita.</em>
            </h2>
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
            <span className="eyebrow">STUDENT STORIES</span>
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
        <section className="section faq" id="faq">
          <div>
            <span className="eyebrow">04 / GOOD TO KNOW</span>
            <h2>
              Masih penasaran?
              <br />
              <em>Kita jawab dulu.</em>
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
