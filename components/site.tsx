import Link from "next/link";
import { ArrowUpRight, Scissors, Sparkles, ArrowRight } from "lucide-react";
import type { Content, Program } from "@/lib/schema";
export function Header() {
  return (
    <>
      <a className="skip" href="#main">
        Lewati ke konten
      </a>
      <header className="header">
        <Link className="brand" href="/">
          shinta kurnia<span>HAIR EDUCATOR</span>
        </Link>
        <nav aria-label="Navigasi utama">
          <Link href="/#program">Program</Link>
          <Link href="/#tentang">Tentang</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <Link className="button small" href="/konsultasi">
          Let’s talk <ArrowUpRight size={16} />
        </Link>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div>
        <Link className="brand" href="/">
          shinta kurnia<span>LEARN. CREATE. GROW.</span>
        </Link>
        <p>Ruang untuk belajar, bertumbuh, dan berkarya.</p>
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
export function Art({ className = "" }: { className?: string }) {
  return (
    <div className={`art ${className}`} aria-hidden="true">
      <div className="art-orbit" />
      <svg viewBox="0 0 360 420" fill="none">
        <path
          d="M70 410C30 270 85 34 211 40c131 6 134 204 61 273-60 57-137 27-144-33-8-74 63-95 72-164"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M82 417C40 269 100 52 211 55c111 3 115 189 54 248-52 51-114 26-121-25-9-61 53-88 60-157M95 422C56 269 115 70 212 70c94 0 96 174 45 222-42 42-91 25-97-18-9-47 44-79 48-146M108 425C75 269 130 85 213 85c77 0 76 159 37 197-34 33-71 23-75-13-6-40 35-67 36-131"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M212 84c-27 45-44 94-41 134M222 90c-20 37-33 75-33 109"
          stroke="currentColor"
        />
      </svg>
      <span className="art-caption">
        THE ART OF
        <br />
        BECOMING.
      </span>
      <Scissors className="art-scissors" strokeWidth={1} />
      <span className="art-dot" />
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
      <div className={`card-art tone-${index % 3}`}>
        {program.image ? (
          <img
            src={program.image}
            alt={`Program ${program.title}`}
            loading="lazy"
          />
        ) : (
          <>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {program.category === "Cutting" ? (
              <Scissors strokeWidth={0.8} />
            ) : (
              <Sparkles strokeWidth={0.8} />
            )}
            <small>{program.category.toUpperCase()} / 1:1</small>
          </>
        )}
      </div>
      <div className="card-body">
        <div className="eyebrow">
          {program.level} <span>↗</span>
        </div>
        <h3>{program.title}</h3>
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
      <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
      <h2>
        Mulai dari rasa ingin tahu.
        <br />
        <em>Tumbuh lewat praktik.</em>
      </h2>
      <Link className="button light" href="/konsultasi">
        Konsultasikan kelasmu <ArrowUpRight size={19} />
      </Link>
      <span className="cta-star" aria-hidden="true">
        ✳
      </span>
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
