import { Catalog } from "@/components/catalog";
import { PublicFrame } from "@/components/site";
import { readContent } from "@/lib/store";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Program kelas privat",
  description:
    "Pilih program kelas rambut privat 1-on-1: cutting, colouring, serta blow & styling bersama Shinta Kurnia.",
};
export default async function Classes() {
  const { data } = await readContent();
  return (
    <PublicFrame>
      <main id="main" className="section catalog-page">
        <span className="eyebrow">PROGRAM / KELAS PRIVAT 1-ON-1</span>
        <h1>
          Pilih yang ingin
          <br />
          <em>kamu pelajari.</em>
        </h1>
        <p className="lead">
          Jelajahi program, kenali materinya, dan konsultasikan pilihan yang
          sesuai dengan pengalamanmu.
        </p>
        <Catalog programs={data.programs} />
      </main>
    </PublicFrame>
  );
}
