import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog";
import { PublicFrame } from "@/components/site";
import { findCategory } from "@/lib/catalog";
import { readContent } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category = findCategory((await params).category);
  return {
    title: category ? `Kelas ${category.title}` : "Kategori tidak ditemukan",
    description: category?.description,
  };
}
export default async function Category({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category = findCategory((await params).category);
  if (!category) notFound();
  const { data } = await readContent();
  return (
    <PublicFrame>
      <main id="main" className="section catalog-page">
        <span className="eyebrow">KELAS PRIVAT / 1-ON-1</span>
        <h1>
          Kelas
          <br />
          <em>{category.title}.</em>
        </h1>
        <p className="lead">{category.description}</p>
        <Catalog programs={data.programs} category={category.slug} />
      </main>
    </PublicFrame>
  );
}
