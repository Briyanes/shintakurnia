import { notFound } from "next/navigation";
import Dashboard from "@/components/dashboard";
import { seed } from "@/lib/seed";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Demo desain dashboard",
  robots: { index: false, follow: false },
};
export default function Demo() {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  return <Dashboard initial={seed} initialEtag={null} demo />;
}
