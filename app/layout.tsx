import type { Metadata, Viewport } from "next";
import { brandMetadata } from "@/lib/brand-metadata";
import "./globals.css";
export const metadata: Metadata = {
  ...brandMetadata(process.env),
  title: {
    default: "Shinta Kurnia — Private Hair Education",
    template: "%s | Shinta Kurnia",
  },
  description:
    "Kelas privat rambut 1-on-1 bersama Shinta Kurnia. Jelajahi cutting, colouring, dan styling; konsultasikan tujuan belajar serta lokasi kelasmu.",
  robots:
    process.env.VERCEL_ENV === "production" &&
    !!process.env.NEXT_PUBLIC_SITE_URL
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#242c28" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
