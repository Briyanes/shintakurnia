"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="section prose">
      <h1>Halaman belum bisa dimuat.</h1>
      <p>
        Silakan coba kembali. Data tidak ditampilkan dari salinan lama ketika
        penyimpanan gagal diakses.
      </p>
      <button className="button" onClick={reset}>
        Coba lagi
      </button>
    </main>
  );
}
