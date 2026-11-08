import { readContent } from "@/lib/store";
import { PublicFrame } from "@/components/site";
import InquiryForm from "@/components/inquiry-form";
export const dynamic = "force-dynamic";
export const metadata = { title: "Konsultasi kelas" };
export default async function Consult({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const { data } = await readContent();
  const { program } = await searchParams;
  const programs = data.programs.filter((p) => p.status === "published");
  return (
    <PublicFrame>
      <main className="section consult-page" id="main">
        <div>
          <span className="eyebrow">KONSULTASI KELAS</span>
          <h1>
            Belajar apa
            <br />
            <em>berikutnya?</em>
          </h1>
          <p className="lead">
            Ceritakan tujuan belajarmu. Program, lokasi, dan jadwal kita
            bicarakan bersama.
          </p>
          <div className="info-box">
            <strong>Privat 1-on-1 · Lokasi fleksibel</strong>
            <p>
              Biaya perjalanan, alat, model praktik, dan akomodasi—jika
              diperlukan—dikonfirmasi sebelum pendaftaran.
            </p>
          </div>
          <a
            className="text-link"
            href={`https://wa.me/${data.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lebih nyaman lewat WhatsApp? ↗
          </a>
        </div>
        <InquiryForm
          programs={programs}
          selected={
            programs.some((p) => p.id === program) ? program! : "konsultasi"
          }
          whatsapp={data.whatsapp}
        />
      </main>
    </PublicFrame>
  );
}
