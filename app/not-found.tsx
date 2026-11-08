import Link from "next/link";
export default function NotFound() {
  return (
    <main className="section prose">
      <span className="eyebrow">404 / A DIFFERENT PATH</span>
      <h1>Halaman tidak ditemukan.</h1>
      <p>Program mungkin belum diterbitkan atau telah diarsipkan.</p>
      <Link className="button" href="/">
        Kembali ke beranda ↗
      </Link>
    </main>
  );
}
