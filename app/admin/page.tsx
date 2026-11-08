import { Brand } from "@/components/brand";
import { cookies } from "next/headers";
import { configured, COOKIE, validSession } from "@/lib/auth";
import { readContent, storageReady } from "@/lib/store";
import Dashboard, { Login } from "@/components/dashboard";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dashboard Shinta",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  if (!configured() || !storageReady())
    return (
      <main className="admin-setup">
        <Brand label="PRIVATE DASHBOARD" />
        <span className="eyebrow">SECURE BY DEFAULT</span>
        <h1>
          Ruang kelolamu
          <br />
          <em>hampir siap.</em>
        </h1>
        <p>
          Dashboard belum diaktifkan. Pemilik perlu mengatur konfigurasi login
          aman sebelum konten dan data peserta dapat dikelola.
        </p>
        <p>
          Tidak ada akun atau password bawaan. Panduan aktivasi tersedia di
          README repository.
        </p>
        <a className="button" href="/">
          Lihat website ↗
        </a>
      </main>
    );
  const jar = await cookies();
  if (!validSession(jar.get(COOKIE)?.value)) return <Login />;
  const content = await readContent();
  return <Dashboard initial={content.data} initialEtag={content.etag} />;
}
