import { Brand } from "./brand";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/lib/schema";
export function Header() {
  return (
    <>
      <a className="skip" href="#main">
        Lewati ke konten
      </a>
      <header className="header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navigasi utama">
          <Link href="/kelas">Kelas</Link>
          <Link href="/#tentang">Tentang Shinta</Link>
          <Link href="/galeri">Galeri</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <Link className="button small header-consult" href="/konsultasi">
          Konsultasi <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <details className="mobile-menu">
          <summary>
            Menu <span aria-hidden="true">+</span>
          </summary>
          <nav aria-label="Navigasi ponsel">
            <Link href="/kelas">Pilihan kelas</Link>
            <Link href="/#tentang">Tentang Shinta</Link>
            <Link href="/galeri">Galeri</Link>
            <Link href="/#faq">Pertanyaan umum</Link>
            <Link href="/konsultasi">Konsultasi kelas</Link>
          </nav>
        </details>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div>
        <Brand label="KELAS RAMBUT PRIVAT" />
        <p>Cutting, colouring, dan styling. Belajar langsung, satu per satu.</p>
      </div>
      <div className="footer-links">
        <Link href="/kelas">Program kelas</Link>
        <Link href="/galeri">Galeri</Link>
        <Link href="/konsultasi">Konsultasi</Link>
        <Link href="/privasi">Privasi</Link>
        <Link href="/admin">Dashboard</Link>
      </div>
      <small>© {new Date().getFullYear()} Shinta Kurnia</small>
    </footer>
  );
}
export function ProgramSummary({ className = "" }: { className?: string }) {
  return (
    <div className={`program-summary ${className}`}>
      <span className="eyebrow">KELAS PRIVAT</span>
      <strong>1-on-1</strong>
      <p>Materi, jadwal, dan lokasi dibicarakan bersama sebelum pendaftaran.</p>
    </div>
  );
}
export function Price({ program }: { program: Program }) {
  return (
    <>
      {program.price === null
        ? "Konsultasikan harga"
        : new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(program.price)}
    </>
  );
}
export function ProgramCard({
  program,
  index,
}: {
  program: Program;
  index: number;
}) {
  return (
    <Link className="program-card" href={`/program/${program.slug}`}>
      {program.image ? (
        <div className="program-photo">
          <img
            src={program.image}
            alt={`Program ${program.title}`}
            loading="lazy"
          />
        </div>
      ) : (
        <span className="program-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div className="card-body">
        <div className="eyebrow">
          {program.category} / {program.level}
        </div>
        <h3>
          {program.title}
          <ArrowUpRight size={22} aria-hidden="true" />
        </h3>
        <p>{program.description}</p>
        <div className="card-price">
          <strong>
            <Price program={program} />
          </strong>
          <span>{program.duration}</span>
        </div>
        <small className="price-note">{program.priceNote}</small>
      </div>
    </Link>
  );
}
export function CTA() {
  return (
    <section className="cta">
      <div>
        <span className="eyebrow">BELUM YAKIN MEMILIH PROGRAM?</span>
        <h2>
          Ceritakan dulu
          <br />
          apa yang ingin kamu pelajari.
        </h2>
        <p>
          Sampaikan pengalamanmu, kota, dan waktu yang diinginkan.
          <br />
          Kita tentukan langkah berikutnya bersama.
        </p>
      </div>
      <Link className="button light" href="/konsultasi">
        Mulai konsultasi <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}
export function PublicFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
