import { WhatsAppLink } from "@/components/whatsapp-link";
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
          <h1>Konsultasi kelas.</h1>
          <p className="lead">
            Ceritakan teknik yang ingin kamu pelajari. Jadwal dan lokasi kita
            bicarakan bersama.
          </p>
          <WhatsAppLink phone={data.whatsapp}>Pilih chat WhatsApp</WhatsAppLink>
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
