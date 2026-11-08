import { PublicFrame } from "@/components/site";
import { readContent } from "@/lib/store";
export const dynamic = "force-dynamic";
export const metadata = { title: "Pemberitahuan privasi" };
export default async function Privacy() {
  const { data } = await readContent();
  return (
    <PublicFrame>
      <main id="main" className="section prose">
        <span className="eyebrow">PRIVASI</span>
        <h1>Pemberitahuan privasi</h1>
        <p>
          Formulir konsultasi mengumpulkan nama, nomor kontak, program yang
          diminati, kota, preferensi waktu, pengalaman, dan tujuan belajar. Data
          digunakan oleh pengelola Shinta Kurnia untuk menanggapi permintaan,
          menentukan kebutuhan kelas, dan mencatat tindak lanjut.
        </p>
        <h2>Penyimpanan dan akses</h2>
        <p>
          Data formulir disimpan di penyimpanan privat dan hanya dapat dibaca
          melalui dashboard admin yang terautentikasi. Penyedia hosting dan
          penyimpanan memproses data sebagai bagian dari pengoperasian layanan.
          Jangan mengirim data sensitif atau informasi kartu pembayaran melalui
          formulir.
        </p>
        <h2>WhatsApp</h2>
        <p>
          Tautan WhatsApp membuka layanan pihak ketiga dengan kebijakan
          privasinya sendiri. Formulir tidak mengirim pesan WhatsApp otomatis.
        </p>
        <h2>Permintaan terkait data</h2>
        <p>
          Hubungi pengelola melalui{" "}
          <a href={`https://wa.me/${data.whatsapp}`}>WhatsApp</a> untuk meminta
          akses, koreksi, atau penghapusan data konsultasi. Pengelola perlu
          menetapkan jadwal peninjauan dan penghapusan data sebelum peluncuran
          publik.
        </p>
        <h2>Cookie dan keamanan</h2>
        <p>
          Login admin menggunakan cookie sesi yang diperlukan. Aplikasi ini
          tidak memasang pelacak pemasaran secara bawaan. Catatan pembatasan
          pengiriman menggunakan hash identitas jaringan untuk membantu mencegah
          penyalahgunaan.
        </p>
      </main>
    </PublicFrame>
  );
}
